// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Module to interact with Vertex AI.

import {
  HarmBlockThreshold,
  HarmCategory,
  VertexAI,
} from "@google-cloud/vertexai";
import {generateTopicModelingPrompt} from "./tasks/topic_modeling";
import {generateCategorizationPrompt, mergeCategorizations} from "./tasks/categorization";

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({
  project: "conversation-ai-experiments",
  location: "us-central1",
});
const model = "gemini-1.5-pro-001";

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_UNSPECIFIED,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

const base_model_spec = {
  model: model,
  generationConfig: { // Docs: http://cloud/vertex-ai/generative-ai/docs/model-reference/inference#generationconfig
    maxOutputTokens: 8192,
    temperature: 0,
    topP: 0,
  },
  safetySettings: safetySettings,
};

// Topic schema
const topics_schema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      name: { type: "string" },
      subtopics: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
          },
        },
      },
    },
  },
};

const json_model_spec = {
  model: model,
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 0,
    topP: 0,
    response_mime_type: "application/json",
    responseSchema: topics_schema,
  },
  safetySettings: safetySettings,
};

// Instantiate the models
const generativeModel = vertex_ai.getGenerativeModel(base_model_spec);
const generativeJsonModel = vertex_ai.getGenerativeModel(json_model_spec);

/**
 * Combines the data and instructions into a prompt to send to Vertex.
 * @param instructions: what the model should do.
 * @param data: the data that the model should consider.
 * @returns the instructions and the data as a text
 */
export function getPrompt(instructions: string, data: string[]) {
  return `${instructions} ${data.join()}`;
}

function getRequest(instructions: string, data: string[]) {
  return {
    contents: [
      { role: "user", parts: [{ text: getPrompt(instructions, data) }] },
    ],
  };
}

class FailedExecutionError extends Error {
  constructor(public response: any, message?: string) {
    super(message || "An error occurred calling Vertex");
    this.name = "VertexAIExecutionError";
    this.response = response;
  }
}

/**
 * Lower level protocol for sending a set of instructions to an llm with
 * comments (which could contain summary information).
 */
export async function executeRequest(
  instructions: string,
  comments: string[]
): Promise<string | FailedExecutionError> {
  const req = getRequest(instructions, comments);
  const streamingResp = await generativeModel.generateContentStream(req);

  const response = await streamingResp.response;
  if (response.candidates![0].content.parts[0].text) {
    return response.candidates![0].content.parts[0].text;
  } else {
    console.warn("Malformed response: ", response);
    throw new FailedExecutionError(response);
  }
}

/**
 * Utility function for sending a set of instructions to an LLM with comments,
 * and returning the results as JSON.
 */
export async function generateJSON(instructions: string, comments: string[]) {
  const req = getRequest(instructions, comments);
  const streamingResp = await generativeJsonModel.generateContentStream(req);

  const response = await streamingResp.response;
  if (response.candidates![0].content.parts[0].text) {
    const responseText = response.candidates![0].content.parts[0].text;
    const generatedJSON = JSON.parse(responseText);
    return generatedJSON;
  } else {
    console.warn("Malformed response: ", response);
    throw new FailedExecutionError(response);
  }
}

interface Topic {
  name: string;
  subtopics?: Topic[];
}

export async function learnTopics(
  comments: string[],
  { depth = 1, parentTopics }: { depth?: number; parentTopics?: string[] }
): Promise<Topic[]> {
  const instructions = generateTopicModelingPrompt(depth, parentTopics);
  const response = await generateJSON(instructions, comments);
  return response;
}

/**
 * Summarizes the comments using a LLM on Vertex.
 * @param instructions: how the comments should be summarized.
 * @param comments: the data to summarize
 * @returns: the LLM's summarization.
 */
export async function basicSummarize(
  instructions: string,
  comments: string[]
): Promise<string> {
  const summaryResponse = await executeRequest(instructions, comments);
  if (summaryResponse instanceof FailedExecutionError) {
    throw summaryResponse;
  } else {
    return summaryResponse;
  }
}

export interface VoteData {
  agreeCount: number;
  disagreeCount: number;
  passCount?: number;
  totalCount: number;
}

export interface CommentDataRow {
  commentText: string,
  groupVoteTallies: { [key: string]: VoteData }
}

/**
 * Utility function for formatting the comments together with vote tally data
 * @param commentData: the data to summarize, as an array of CommentDataRow objects
 * @returns: comments, together with vote tally information as JSON
 */
export function formatCommentsWithVotes(commentData: CommentDataRow[]): string[] {
  return commentData.map((row: CommentDataRow) =>
    row.commentText + "\n  vote info per group: " + JSON.stringify(row.groupVoteTallies)
  );
}

/**
 * Summarizes the comments using a LLM on Vertex.
 * @param instructions: how the comments should be summarized.
 * @param commentData: the data to summarize, as an array of CommentDataRow objects
 * @returns: the LLM's summarization.
 */
export async function voteTallySummarize(
  instructions: string,
  commentData: CommentDataRow[]
): Promise<string> {
  const summaryResponse = await executeRequest(instructions, formatCommentsWithVotes(commentData));
  if (summaryResponse instanceof FailedExecutionError) {
    throw summaryResponse;
  } else {
    return summaryResponse;
  }
}

/**
 * Parses a comma-separated string of topics into an array of trimmed strings.
 *
 * @param topics The comma-separated string of topics (may be undefined, empty, or contain only whitespace).
 * @returns An array of trimmed topic strings, or undefined if the input is undefined, empty, or contains only whitespace.
 */
function parseTopics(topics: string | undefined): string[] | undefined {
  if (topics && topics.trim() !== "") {
    return topics.split(',').map(topic => topic.trim());
  }
  // No need to return undefined explicitly here, as it's the default if the condition is false.
}

/**
 * Extracts topics from the comments using a LLM on Vertex AI.
 * @param comments The comments data for topic modeling
 * @param topicDepth The user provided topics depth (1 or 2)
 * @param topics Optional. The user provided comma-separated string of top-level topics
 * @returns: The LLM's topic modeling.
 */
export async function getTopics(comments: string[], topicDepth: number, topics?: string): Promise<string> {
  const parentTopics = parseTopics(topics);
  const topicsResponse = await learnTopics(comments, { depth: topicDepth, parentTopics: parentTopics });
  if (topicsResponse instanceof FailedExecutionError) {
    throw topicsResponse;
  } else {
    return JSON.stringify(topicsResponse, null, 2);  // format and indent by 2 spaces
  }
}

/**
 * Categorize the comments by topics using a LLM on Vertex.
 * @param comments The data to summarize
 * @param topicDepth The user provided topics depth (1 or 2)
 * @param topics Optional. The user provided top-level topics
 * @param instructions Optional. How the comments should be categorized.
 * @returns: The LLM's categorization.
 */
export async function categorize(
  comments: string[],
  topicDepth: number,
  topics?: string,
  instructions?: string
): Promise<string> {

  if (!instructions) {
    // Generate instructions if not supplied
    const parentTopics = parseTopics(topics);
    const learnedTopics = await learnTopics(comments, { depth: topicDepth, parentTopics: parentTopics });

    instructions = generateCategorizationPrompt(JSON.stringify(learnedTopics), topicDepth);
  }

  let allCategorizations: any[] = [];  // TODO: replace with a more specific type

  const batchSize = 250; // TODO: make it an input param
  for (let i = 0; i < comments.length; i += batchSize) {
    const batch = comments.slice(i, i + batchSize);

    let categorizedBatch = await executeRequest(instructions, batch);

    if (categorizedBatch instanceof FailedExecutionError) {
      throw categorizedBatch;
    } else {
      mergeCategorizations(allCategorizations, JSON.parse(categorizedBatch));
    }
  }

  return JSON.stringify(allCategorizations, null, 2);  // format and indent by 2 spaces
}
