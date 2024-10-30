// Copyright 2024 Google LLC
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

// Module to interact with sensemaking tools.

// TODO: remove this once the library more closely matches the library specification doc. The
// unused variables should be gone once the library is more fully implemented.
/* eslint-disable @typescript-eslint/no-unused-vars */

import { generateTopicModelingPrompt, learnedTopicsValid } from "./tasks/topic_modeling";
import { MAX_RETRIES, RETRY_DELAY_MS, VertexModel } from "./models/vertex_model";
import { Comment, SummarizationType, Topic, VoteTally } from "./types";
import {
  addMissingTextToCategorizedComments,
  assignDefaultCategory,
  generateCategorizationPrompt,
  parseTopicsJson,
  groupCommentsByTopic,
  processCategorizedComments,
} from "./tasks/categorization";
import { basicSummarize, voteTallySummarize } from "./tasks/summarization";
import { getPrompt } from "./sensemaker_utils";

// TODO: this should be initialized outside of the library. Remove this once this library can be
// initialized as a class.
const GEMINI_MODEL = new VertexModel(
  "conversation-ai-experiments",
  "us-central1",
  "gemini-1.5-pro-002"
);

/**
 * Summarize a set of comments using all available metadata.
 * @param comments the text and (optional) vote data to consider
 * @param summarizationType what summarization method to use
 * @param topics the set of topics that should be present in the final summary
 * @param additionalInstructions additional context to give the model as part of the prompt
 * @returns a summary of the information as a string.
 */
export function summarize(
  comments: Comment[],
  summarizationType: SummarizationType = SummarizationType.VOTE_TALLY,
  topics?: Topic[],
  additionalInstructions?: string
): Promise<string> {
  if (summarizationType == SummarizationType.BASIC) {
    return basicSummarize(comments, GEMINI_MODEL);
  } else if (summarizationType == SummarizationType.VOTE_TALLY) {
    return voteTallySummarize(comments, GEMINI_MODEL);
  } else {
    throw TypeError("Unknown Summarization Type.");
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
    return topics.split(",").map((topic) => topic.trim());
  }
  // No need to return undefined explicitly here, as it's the default if the condition is false.
}

/**
 * Extracts topics from the comments using a LLM on Vertex AI. Retries if the LLM response is invalid.
 * @param comments The comments data for topic modeling
 * @param includeSubtopics Whether to include subtopics in the topic modeling
 * @param topics Optional. The user provided comma-separated string of top-level topics
 * @returns: The LLM's topic modeling.
 */
export async function learnTopics(
  comments: Comment[],
  includeSubtopics: boolean,
  topics?: string
): Promise<string> {
  const parentTopics = parseTopics(topics);
  const instructions = generateTopicModelingPrompt(includeSubtopics, parentTopics);
  // surround each comment by triple backticks to avoid model's confusion with single, double quotes and new lines
  const commentTexts = comments.map((comment) => "```" + comment.text + "```");
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const response = await GEMINI_MODEL.generateTopics(
      getPrompt(instructions, commentTexts),
      includeSubtopics
    );

    if (learnedTopicsValid(response, parentTopics)) {
      return JSON.stringify(response, null, 2);
    } else {
      console.warn(
        `Learned topics failed validation, attempt ${attempt}. Retrying in ${RETRY_DELAY_MS / 1000} seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }

  throw new Error("Topic modeling failed after multiple retries.");
}

/**
 * Categorize the comments by topics using a LLM on Vertex.
 * @param comments The data to summarize
 * @param includeSubtopics Whether to include subtopics in the categorization.
 * @param topics The user provided topics (and subtopic) in JSON format following the interface `Topic`.
 * @param instructions Optional. How the comments should be categorized.
 * @param groupByTopic Optional. Whether to group comments by topic in the output. Defaults to false.
 * @param batchSize Optional. The number of comments to send to the LLM in each batch. Defaults to 100.
 * @returns: The LLM's categorization.
 */
export async function categorize(
  comments: Comment[],
  includeSubtopics: boolean,
  topics: string,
  instructions?: string,
  groupByTopic: boolean = false,
  batchSize = 100
): Promise<string> {
  // Parse the topics JSON string into an array of Topic objects for easy access to topic names during validation.
  const topicsJson: Topic[] = parseTopicsJson(topics);

  // Either use provided instructions or generate them based in the provided topics structure.
  if (!instructions) {
    instructions = generateCategorizationPrompt(topicsJson, includeSubtopics);
  }

  // Call the model in batches, validate results and retry if needed.
  const categorized: Comment[] = [];
  for (let i = 0; i < comments.length; i += batchSize) {
    const uncategorizedBatch = comments.slice(i, i + batchSize);
    const categorizedBatch = await categorizeWithRetry(
      instructions,
      uncategorizedBatch,
      includeSubtopics,
      topicsJson
    );
    categorized.push(...categorizedBatch);
  }

  return groupByTopic ? groupCommentsByTopic(categorized) : JSON.stringify(categorized, null, 2);
}

/**
 * Makes API call to generate JSON and retries with any comments that were not properly categorized.
 * @param instructions Instructions for the LLM on how to categorize the comments.
 * @param inputComments The comments to categorize.
 * @param includeSubtopics Whether to include subtopics in the categorization.
 * @param topics The topics and subtopics provided to the LLM for categorization.
 * @returns The categorized comments.
 */
export async function categorizeWithRetry(
  instructions: string,
  inputComments: Comment[],
  includeSubtopics: boolean,
  topics: Topic[]
): Promise<Comment[]> {
  // a holder for uncategorized comments: first - input comments, later - any failed ones that need to be retried
  let uncategorized: Comment[] = [...inputComments];
  const categorized: Comment[] = [];
  // Lookup map to get comments by ID (a LLM returns IDs only, this is used to pull the text to build a proper Comment)
  const inputCommentsLookup = new Map<string, Comment>(
    inputComments.map((comment) => [comment.id, comment])
  );

  for (let attempts = 1; attempts <= MAX_RETRIES; attempts++) {
    // convert JSON to string representation that will be sent to the model
    const uncategorizedCommentsForModel: string[] = uncategorized.map((comment) =>
      JSON.stringify({ id: comment.id, text: comment.text })
    );

    const newCategorized: Comment[] = await GEMINI_MODEL.generateComments(
      getPrompt(instructions, uncategorizedCommentsForModel),
      includeSubtopics
    );
    // Add missing 'text' properties to the result using the lookup map, so we can cast to Comment type that requires text.
    const newCategorizedComments: Comment[] = addMissingTextToCategorizedComments(
      newCategorized,
      inputCommentsLookup
    );

    // perform validation, update categorized, reset uncategorized
    uncategorized = processCategorizedComments(
      newCategorizedComments,
      inputComments,
      uncategorized,
      includeSubtopics,
      topics,
      categorized
    );

    if (uncategorized.length === 0) {
      break; // All comments categorized successfully
    }

    if (attempts < MAX_RETRIES) {
      console.warn(
        `Expected all ${uncategorizedCommentsForModel.length} comments to be categorized, but ${uncategorized.length} are not categorized properly. Retrying in ${RETRY_DELAY_MS / 1000} seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    } else {
      assignDefaultCategory(uncategorized, categorized);
    }
  }

  return categorized;
}
