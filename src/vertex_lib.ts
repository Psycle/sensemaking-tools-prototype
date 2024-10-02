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

import { HarmBlockThreshold, HarmCategory, VertexAI } from "@google-cloud/vertexai";
import { generateTopicModelingPrompt } from "./tasks/topic_modeling";
import { Comment, Topic } from "./types";
import {
  addMissingTextToCategorizedComments,
  findMissingComments,
  generateCategorizationPrompt,
  parseTopicsJson,
  validateCategorizedComments,
} from "./tasks/categorization";

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({
  project: "conversation-ai-experiments",
  location: "us-central1",
});
const model = "gemini-1.5-pro-002";

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

// TODO: create a separate schema for 1-tier categorization
// For details see: https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/control-generated-output
const categorizationSchemaCommentsFirst = {
  type: "array",
  items: {
    type: "object",
    required: ["id", "topics"],
    properties: {
      id: { type: "string" }, // Comment id
      topics: {
        type: "array",
        items: {
          type: "object",
          required: ["name", "subtopics"],
          properties: {
            name: { type: "string" }, // Topic name
            subtopics: {
              type: "array",
              items: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string" }, // Subtopic name
                },
              },
            },
          },
        },
      },
    },
  },
};

const baseModelSpec = {
  model: model,
  generationConfig: {
    // Docs: http://cloud/vertex-ai/generative-ai/docs/model-reference/inference#generationconfig
    maxOutputTokens: 8192,
    temperature: 0,
    topP: 0,
  },
  safetySettings: safetySettings,
};

const jsonModelSpec = {
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

const jsonModelSpecForCategorization = {
  model: model,
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 0,
    topP: 0,
    response_mime_type: "application/json",
    responseSchema: categorizationSchemaCommentsFirst,
  },
  safetySettings: safetySettings,
};

// Instantiate the models
const generativeModel = vertex_ai.getGenerativeModel(baseModelSpec);
const generativeJsonModel = vertex_ai.getGenerativeModel(jsonModelSpec);
const categorizationModel = vertex_ai.getGenerativeModel(jsonModelSpecForCategorization);

/**
 * Combines the data and instructions into a prompt to send to Vertex.
 * @param instructions: what the model should do.
 * @param data: the data that the model should consider.
 * @returns the instructions and the data as a text
 */
export function getPrompt(instructions: string, data: string[]) {
  return `Instructions:
${instructions}
Comments:
${data.join('\n')}`;  // separate comments with newlines
}

function getRequest(instructions: string, data: string[]) {
  return {
    contents: [
      { role: "user", parts: [{ text: getPrompt(instructions, data) }] },
    ],
  };
}

/**
 * Lower level protocol for sending a set of instructions to an llm with
 * comments (which could contain summary information).
 */
export async function executeRequest(
  instructions: string,
  comments: string[]
): Promise<string> {
  const req = getRequest(instructions, comments);
  const streamingResp = await generativeModel.generateContentStream(req);

  const response = await streamingResp.response;
  if (response.candidates![0].content.parts[0].text) {
    return response.candidates![0].content.parts[0].text;
  } else {
    console.warn("Malformed response: ", response);
    throw new Error("Error from Generative Model, response: " + response);
  }
}

/**
 * Utility function for sending a set of instructions to an LLM with comments,
 * and returning the results as JSON.
 *
 * @param instructions The instructions for the LLM on how to process the comments.
 * @param comments The array of comments to be processed by the LLM.
 * @param model The Vertex AI generative model instance to use for processing.
 * @returns A Promise that resolves with the LLM's output parsed as a JSON object.
 * @throws An error if the LLM's response is malformed or if there's an error during processing.
 */
export async function generateJSON(instructions: string, comments: string[], model: any): Promise<any> {
  const req = getRequest(instructions, comments);
  const streamingResp = await model.generateContentStream(req);

  const response = await streamingResp.response;
  if (response.candidates![0].content.parts[0].text) {
    const responseText = response.candidates![0].content.parts[0].text;
    const generatedJSON = JSON.parse(responseText);
    return generatedJSON;
  } else {
    console.warn("Malformed response: ", response);
    throw new Error("Error from Generative Model, response: " + response);
  }
}

export async function learnTopics(
  comments: Comment[],
  { depth = 1, parentTopics }: { depth?: number; parentTopics?: string[] }
): Promise<Topic[]> {
  const instructions = generateTopicModelingPrompt(depth, parentTopics);
  const commentTexts = comments.map(comment => comment.text);
  const response = await generateJSON(instructions, commentTexts, generativeJsonModel);
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
  comments: Comment[]
): Promise<string> {
  const commentTexts = comments.map(comment => comment.text);
  return await executeRequest(instructions, commentTexts);
}

/**
 * Utility function for formatting the comments together with vote tally data
 * @param commentData: the data to summarize, as an array of Comment objects
 * @returns: comments, together with vote tally information as JSON
 */
export function formatCommentsWithVotes(
  commentData: Comment[]
): string[] {
  return commentData.map(
    (comment: Comment) =>
      comment.text +
      "\n  vote info per group: " +
      JSON.stringify(comment.voteTalliesByGroup)
  );
}

/**
 * Summarizes the comments using a LLM on Vertex.
 * @param instructions: how the comments should be summarized.
 * @param commentData: the data to summarize, as an array of Comment objects
 * @returns: the LLM's summarization.
 */
export async function voteTallySummarize(
  instructions: string,
  commentData: Comment[]
): Promise<string> {
  return await executeRequest(
    instructions,
    formatCommentsWithVotes(commentData)
  );
}

/**
 * Parses a comma-separated string of topics into an array of trimmed strings.
 *
 * @param topics The comma-separated string of topics (may be undefined, empty, or contain only whitespace).
 * @returns An array of trimmed topic strings, or undefined if the input is undefined, empty, or contains only whitespace.
 */
function parseTopics(topics: string | undefined): string[] | undefined {
  if (topics && topics.trim() !== "") {
    return topics.split(",").map((topic) => topic.trim());
  }
  // No need to return undefined explicitly here, as it's the default if the condition is false.
}

/**
 * Extracts topics from the comments using a LLM on Vertex AI.
 * @param comments The comments data for topic modeling
 * @param topicDepth The user provided topics depth (1 or 2). TODO: replace with `includeSubtopics` boolean flag.
 * @param topics Optional. The user provided comma-separated string of top-level topics
 * @returns: The LLM's topic modeling.
 */
export async function getTopics(
  comments: Comment[],
  topicDepth: number,
  topics?: string
): Promise<string> {
  const parentTopics = parseTopics(topics);
  const topicsResponse = await learnTopics(comments, {
    depth: topicDepth,
    parentTopics: parentTopics,
  });
  return JSON.stringify(topicsResponse, null, 2); // format and indent by 2 spaces
}

/**
 * Categorize the comments by topics using a LLM on Vertex.
 * @param comments The data to summarize
 * @param topicDepth The user provided topics depth (1 or 2). TODO: replace with `includeSubtopics` boolean flag.
 * @param topics The user provided top-level topics in JSON format following the interface `Topic`.
 * @param instructions Optional. How the comments should be categorized.
 * @param batchSize The number of comments to send to the LLM in each batch. Defaults to 100.
 * @returns: The LLM's categorization.
 */
export async function categorize(
  comments: Comment[],
  topicDepth: number,
  topics: string,
  instructions?: string,
  batchSize = 100
): Promise<string> {
  // Either use provided instructions or generate them based in the provided topics structure.
  if (!instructions) {
    instructions = generateCategorizationPrompt(topics, topicDepth);
  }

  // Parse the topics JSON string into an array of Topic objects for easy access to topic names during validation.
  const topicsJson: Topic[] = parseTopicsJson(topics);

  // Call the model in batches, validate results and retry if needed.
  const categorized: Comment[] = [];
  for (let i = 0; i < comments.length; i += batchSize) {
    const uncategorizedBatch = comments.slice(i, i + batchSize);
    const categorizedBatch = await categorizeWithRetry(instructions, uncategorizedBatch, topicDepth, topicsJson);
    categorized.push(...categorizedBatch);
  }

  return JSON.stringify(categorized, null, 2); // format and indent by 2 spaces
}

/**
 * Makes API call to generate JSON and retries with any comments that were not properly categorized.
 * @param instructions Instructions for the LLM on how to categorize the comments.
 * @param inputComments The comments to categorize.
 * @param topicDepth The user provided topics depth (1 or 2)
 * @param topics The topics and subtopics provided to the LLM for categorization.
 * @returns The categorized comments.
 */
export async function categorizeWithRetry(instructions: string, inputComments: Comment[], topicDepth: number, topics: Topic[]): Promise<Comment[]> {
  // a holder for uncategorized comments: first - input comments, later - any failed ones that need to be retried
  let uncategorized: Comment[] = [...inputComments];
  const categorized: Comment[] = [];
  // Lookup map to get comments by ID (a LLM returns IDs only, this is used to pull the text to build a proper Comment)
  const inputCommentsLookup = new Map<string, Comment>(inputComments.map(comment => [comment.id, comment]));

  // Start a while loop running until all comments are properly categorized
  do {
    // convert JSON to string representation that will be sent to the model
    const uncategorizedCommentsForModel: string[] = uncategorized.map(comment =>
      JSON.stringify({ id: comment.id, text: comment.text })
    );
    // call the model
    const newCategorized: any[] = await generateJSON(instructions, uncategorizedCommentsForModel, categorizationModel);
    // Add missing 'text' properties to the result using the lookup map, so we can cast to Comment type that requires text.
    const newCategorizedComments: Comment[] = addMissingTextToCategorizedComments(newCategorized, inputCommentsLookup);

    // PERFORM VALIDATION
    // Check for comments that were never in the input, have no topics, or non-matching topic names.
    const {
      commentsPassedValidation,
      commentsWithInvalidTopics
    } = validateCategorizedComments(newCategorizedComments, inputComments, topicDepth, topics);
    categorized.push(...commentsPassedValidation);
    // Check for comments completely missing in the model's response
    const missingComments: Comment[] = findMissingComments(newCategorizedComments, uncategorized);
    // Reset uncategorized: combine all invalid comments for retry
    uncategorized = [...missingComments, ...commentsWithInvalidTopics];

    if (uncategorized.length > 0) {
      console.warn(`Expected all ${uncategorizedCommentsForModel.length} comments to be categorized, but ${uncategorized.length} are not categorized properly. Retrying...`);
    }
  } while (uncategorized.length > 0);

  return categorized;
}
