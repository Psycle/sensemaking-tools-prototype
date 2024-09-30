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
