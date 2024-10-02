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

import {Comment, Topic} from "../types";

/**
 * @fileoverview Helper functions for performing comments categorization.
 */

export function topicCategorizationPrompt(topics: string): string {
  return `
For each of the following comments, identify the most relevant topic from the list below.

Main Topics:
${topics}

Important Considerations:
- Ensure the assigned topic accurately reflects the meaning of the comment.
- A comment can be assigned to multiple topics if relevant.
- Prioritize using the existing topics whenever possible.
- All comments must be assigned at least one topic.
- If no existing topic fits a comment well, assign it to the "Other" topic.
- Do not create any new topics besides "Other".
`;
}

export function subtopicCategorizationPrompt(topics: string): string {
  return `
For each of the following comments, identify the most relevant topic and subtopic from the list below.

Main Topics and Subtopics:
${topics}

Important Considerations:
- Ensure the assignment of comments to subtopics is accurate and reflects the meaning of the comment.
- If comments relate to multiple topics, they should be added to each of the corresponding topics and their relevant subtopics.
- Prioritize assigning comments to existing subtopics whenever possible.
- All comments must be assigned to at least one topic and subtopic.
- If no existing subtopic can be reasonably applied to a comment, assign it to the "Other" subtopic under the relevant main topic.
- If no existing topic or subtopic can be reasonably applied to a comment, assign it to the 'Other' topic and the 'Other' subtopic.
- Do not create any new topics or subtopics besides "Other".
`;
}

/**
 * Generates a prompt for an LLM to categorize comments based on a predefined set of topics (and subtopics).
 *
 * @param topics A JSON string representing the hierarchy of topics (and optional subtopics).
 *   The structure should be an array of objects, where each object has a "name" property (for the topic)
 *   and a "subtopics" property (an array of objects with "name" properties for subtopics).
 *
 * @param topicDepth The user provided topics depth (1 or 2)
 * @returns The generated prompt string, including instructions, output format, and considerations for categorization.
 */
export function generateCategorizationPrompt(topics: string, topicDepth: number): string {
  switch (topicDepth) {
    case 1:
      return topicCategorizationPrompt(topics);
    case 2:
      return subtopicCategorizationPrompt(topics);
    default:
      throw new Error("Invalid topic depth. Please provide a depth of 1 or 2.");
  }
}

/**
 * Validates categorized comments, checking for:
 *  - Extra comments (not present in the original input)
 *  - Empty topics or subtopics
 *  - Invalid topic or subtopic names
 * @param categorizedComments The categorized comments to validate.
 * @param inputComments The original input comments.
 * @param topicDepth The user provided topics depth (1 or 2).
 * @param topics The topics and subtopics provided to the LLM for categorization.
 * @returns An object containing:
 *  - `validCategorizedComments`: An array of validated categorized comments.
 *  - `commentsWithInvalidTopics`: An array of comments that failed validation.
 */
export function validateCategorizedComments(
  categorizedComments: Comment[],
  inputComments: Comment[],
  topicDepth: number,
  topics: Topic[]
): { commentsPassedValidation: Comment[], commentsWithInvalidTopics: Comment[] } {
  const commentsPassedValidation: Comment[] = [];
  const commentsWithInvalidTopics: Comment[] = [];
  // put all input comment ids together for output ids validation
  const inputCommentIds: string[] = inputComments.map(comment => comment.id);
  // topic -> subtopics lookup for naming validation
  const topicLookup: Record<string, string[]> = createTopicLookup(topics);

  categorizedComments.forEach((comment) => {
    if (isExtraComment(comment, inputCommentIds)) {
      return; // Skip to the next comment
    }

    if (hasEmptyTopicsOrSubtopics(comment, topicDepth)) {
      commentsWithInvalidTopics.push(comment);
      return; // Skip to the next comment
    }

    if (hasInvalidTopicNames(comment, topicDepth, topicLookup)) {
      commentsWithInvalidTopics.push(comment);
      return; // Skip to the next comment
    }

    // If all checks pass, add the comment to the valid ones
    commentsPassedValidation.push(comment);
  });

  return { commentsPassedValidation, commentsWithInvalidTopics };
}

/**
 * Creates a lookup table (dictionary) from an array of input Topic objects.
 * This table maps topic names to arrays of their corresponding subtopic names.
 *
 * @param inputTopics The array of Topic objects to create the lookup table from.
 * @returns A dictionary where keys are topic names (strings) and values are arrays of subtopic names (strings).
 *   If a topic has no subtopics, an empty array is used as the value to avoid dealing with undefined values.
 */
function createTopicLookup(inputTopics: Topic[]): Record<string, string[]> {
  const lookup: Record<string, string[]> = {};
  for (const topic of inputTopics) {
    lookup[topic.name] = topic.subtopics ? topic.subtopics.map(subtopic => subtopic.name) : [];
  }
  return lookup;
}

/**
 * Checks if a comment is an extra comment (not present in the original input).
 * @param comment The categorized comment to check.
 * @param inputCommentIds An array of IDs of the original input comments.
 * @returns True if the comment is extra, false otherwise.
 */
function isExtraComment(comment: Comment, inputCommentIds: string[]): boolean {
  if (!inputCommentIds.includes(comment.id)) {
    console.warn(`Extra comment in model's response: ${JSON.stringify(comment)}`);
    return true;
  }
  return false;
}

/**
 * Checks if a comment has empty topics or subtopics.
 * @param comment The categorized comment to check.
 * @param topicDepth The user provided topics depth (1 or 2).
 * @returns True if the comment has empty topics or subtopics, false otherwise.
 */
function hasEmptyTopicsOrSubtopics(comment: Comment, topicDepth: number): boolean {
  if ((!comment.topics || comment.topics.length === 0) ||
    (topicDepth === 2 && comment.topics.some(
        (topic) => !topic.subtopics || topic.subtopics.length === 0)
    )
  ) {
    console.warn(`Comment with empty topics or subtopics: ${JSON.stringify(comment)}`);
    return true;
  }
  return false;
}

/**
 * Checks if a categorized comment has topic or subtopic names different from the provided ones to the LLM.
 * @param comment The categorized comment to check.
 * @param topicDepth The user provided topics depth (1 or 2).
 * @param inputTopics The lookup table mapping the input topic names to arrays of their subtopic names.
 * @returns True if the comment has invalid topic or subtopic names, false otherwise.
 */
function hasInvalidTopicNames(comment: Comment, topicDepth: number, inputTopics: Record<string, string[]>): boolean {
  // TODO: Currently comment.topics can be undefined, so we need this. Remove it once we have a new type that has topics required.
  const topicsToCheck = comment.topics || [];

  // We use `some` here to return as soon as we find an invalid topic (or subtopic).
  return topicsToCheck.some(topic => {
    if (topic.name === "Other") {
      // If the topic is "Other", we don't need to check subtopics
      return false;
    }

    const isValidTopic = topic.name in inputTopics || topic.name === "Other";
    if (!isValidTopic) {
      console.warn(`Comment has an invalid topic: ${topic.name}, comment: ${JSON.stringify(comment)}`);
      return true; // Invalid topic found, stop checking and return `hasInvalidTopicNames` true for this comment.
    }

    if (topicDepth === 2 && topic.subtopics) {
      const areAllSubtopicsValid = areSubtopicsValid(topic.subtopics, inputTopics[topic.name]);
      if (!areAllSubtopicsValid) {
        console.warn(`Comment has invalid subtopics under topic: ${topic.name}, comment: ${JSON.stringify(comment)}`);
        return true; // Invalid subtopics found, stop checking and return `hasInvalidTopicNames` true for this comment.
      }
    }

    // The current topic (and all its subtopics) is valid, go to the next one.
    return false;
  });
}

/**
 * Checks if an array of subtopics is valid against a list of valid subtopic names.
 * A subtopic is considered valid if its name is present in the input subtopics or if it's named "Other".
 *
 * @param subtopicsToCheck An array of subtopic objects, each having a 'name' property.
 * @param inputSubtopics An array of input subtopic names.
 * @returns True if all subtopics are valid, false otherwise.
 */
function areSubtopicsValid(subtopicsToCheck: { name: string }[], inputSubtopics: string[]): boolean {
  return subtopicsToCheck.every(subtopic =>
    inputSubtopics.includes(subtopic.name) || subtopic.name === "Other"
  );
}

/**
 * Finds comments that are missing from the categorized output.
 * @param categorizedComments The categorized comments received from the model.
 * @param inputComments The original input comments.
 * @returns An array of comments that were present in the input, but not in categorized.
 */
export function findMissingComments(categorizedComments: Comment[], inputComments: Comment[]): Comment[] {
  const categorizedCommentIds: string[] = categorizedComments.map((comment) => comment.id);
  const missingComments = inputComments.filter(
    (inputComment) => !categorizedCommentIds.includes(inputComment.id)
  );

  if (missingComments.length > 0) {
    console.warn(`Missing comments in model's response: ${JSON.stringify(missingComments)}`);
  }
  return missingComments;
}

/**
 * Adds the missing 'text' property to categorized comments using a lookup map.
 * This is necessary because the LLM returns only IDs, and we need the original text.
 *
 * @param categorizedComments The categorized comments received from the model (missing the 'text' property).
 * @param inputCommentsLookup A map to look up the original input comments by their ID.
 * @returns An array of Comment objects with the 'text' property added.
 */
export function addMissingTextToCategorizedComments(categorizedComments: any[], inputCommentsLookup: Map<string, Comment>): Comment[] {
  categorizedComments.forEach((categorizedComment: any) => {
    const inputComment = inputCommentsLookup.get(categorizedComment.id);
    if (inputComment) {
      categorizedComment.text = inputComment.text;
    } else {
      // This may happen if model returned a comment id that was not in the input. We filter such comments on the later steps.
      console.warn(`Could not find input comment for ID ${categorizedComment.id}`);
    }
  });
  return categorizedComments as Comment[];
}

/**
 * Parses a JSON string representing topics into an array of Topic objects.
 *
 * @param topicsJsonString The JSON string to parse.
 * @returns An array of Topic objects.
 * @throws An error if the input is not a valid JSON string representing an array of Topic objects.
 */
export function parseTopicsJson(topicsJsonString: string): Topic[] {
  try {
    return JSON.parse(topicsJsonString);
  } catch (error) {
    throw new Error("Invalid topics JSON string. Please provide a valid JSON array of Topic objects.");
  }
}
