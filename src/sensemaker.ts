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
  categorizeWithRetry,
  generateCategorizationPrompt,
  groupCommentsByTopic,
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
 * Extracts topics from the comments using a LLM on Vertex AI. Retries if the LLM response is invalid.
 * @param comments The comments data for topic modeling
 * @param includeSubtopics Whether to include subtopics in the topic modeling
 * @param topics Optional. The user provided top-level topics, if these are specified only
 * subtopics will be learned.
 * @param additionalInstructions Optional. Context to add to the LLM prompt.
 * @returns: Topics (optionally containing subtopics) representing what is discussed in the
 * comments.
 */
export async function learnTopics(
  comments: Comment[],
  includeSubtopics: boolean,
  topics?: Topic[],
  additionalInstructions?: string
): Promise<Topic[]> {
  const instructions = generateTopicModelingPrompt(includeSubtopics, topics);
  // surround each comment by triple backticks to avoid model's confusion with single, double quotes and new lines
  const commentTexts = comments.map((comment) => "```" + comment.text + "```");
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const response = await GEMINI_MODEL.generateTopics(
      getPrompt(instructions, commentTexts),
      includeSubtopics
    );

    if (learnedTopicsValid(response, topics)) {
      return response;
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
 * @param topics The user provided topics (and optionally subtopics).
 * @param additionalInstructions Optional. Context to add to the LLM prompt.
 * @param groupByTopic Optional. Whether to group comments by topic in the output. Defaults to false.
 * @returns: The LLM's categorization.
 */
export async function categorizeComments(
  comments: Comment[],
  includeSubtopics: boolean,
  topics?: Topic[],
  additionalInstructions?: string,
  groupByTopic: boolean = false
): Promise<string> {
  if (!topics) {
    topics = await learnTopics(comments, includeSubtopics, undefined, additionalInstructions);
  }
  const givenTopicsContainSubtopics = topics.some((topic: Topic) => {
    return topic.subtopics !== undefined && topic.subtopics.length > 0;
  });

  const instructions = generateCategorizationPrompt(topics, includeSubtopics);

  // Call the model in batches, validate results and retry if needed.
  const categorized: Comment[] = [];
  for (let i = 0; i < comments.length; i += GEMINI_MODEL.categorizationBatchSize) {
    const uncategorizedBatch = comments.slice(i, i + GEMINI_MODEL.categorizationBatchSize);
    const categorizedBatch = await categorizeWithRetry(
      GEMINI_MODEL,
      instructions,
      uncategorizedBatch,
      includeSubtopics,
      topics
    );
    categorized.push(...categorizedBatch);
  }

  return groupByTopic ? groupCommentsByTopic(categorized) : JSON.stringify(categorized, null, 2);
}
