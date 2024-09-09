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
 * @fileoverview Helper functions for performing topic modeling on sets of comments.
 */

export const LEARN_TOPICS_PROMPT = `
Identify a 1-tiered hierarchical topic modeling of the following comments, and return the results as an array of strings.
Use Title Case for topic names.
`;

export const LEARN_TOPICS_AND_SUBTOPICS_PROMPT = `
Identify a 2-tiered hierarchical topic modeling of the following comments, and return the results as an array of JSON objects with keys 'name' and 'subtopics', where 'name' is a topic name and 'subtopics' is an array of short-named subtopics (no nested objects).

Follow these steps:

1. **Define Topics:** Start by identifying the main topics. Use Title Case for topic names.
2. **Identify Subtopics:** For each topic, identify relevant subtopics. Use Title Case for subtopic names.
3. **Enforce Exclusion: It is absolutely crucial that no subtopic should have the same name as any of the main topics. Before adding any subtopic to a topic, rigorously check if a topic with the same name already exists. If it does, discard that subtopic completely and do not include it in any topic's list of subtopics.**
`;

export function learnSubtopicsPrompt(parentTopics: string[]): string {
  return `
Analyze the following comments and identify relevant subtopics within each of the following main topics:
${JSON.stringify(parentTopics)}

Output Format:

Present your analysis in the following JSON structure:

\`\`\`json
[
  {
    "name": "Topic 1",
    "subtopics": [
      { "name": "Subtopic 1" },
      { "name": "Subtopic 2" },
      ...
    ]
  },
  {
    "name": "Topic 2",
    "subtopics": [
      { "name": "Subtopic 1" },
      { "name": "Subtopic 2" },
      ...
    ]
  },
  // ... other topics
]

Important Considerations:
- Use Title Case for all subtopic names.
- Ensure that each subtopic is relevant to its assigned main topic.
- No subtopic should have the same name as any of the main topics.
- Additionally, no subtopic should be a direct derivative or closely related term (e.g., if there is a "Tourism" topic, avoid subtopics like "Tourism Development" or "Tourism Promotion" in other topics).

Example of Incorrect Output:

\`\`\`json
[
  {
    "name": "Economic Development",
    "subtopics": [
        { "name": "Job Creation" },
        { "name": "Business Growth" },
        { "name": "Tourism Development" }, // Incorrect: Too closely related to the "Tourism" topic
        { "name": "Tourism Promotion" } // Incorrect: Too closely related to the "Tourism" topic
      ]
  },
  {
    "name": "Tourism",
    ...
  },
  // ... other topics
]
`;
}

/**
 * Generates an LLM prompt for topic modeling of a set of comments.
 *
 * @param depth - The desired depth of the topic hierarchy (1 or 2).
 * @param parentTopics - Optional. An array of top-level topics to use.
 * @returns The generated prompt string.
 */
export function generateTopicModelingPrompt(
  depth: number,
  parentTopics?: string[]
): string {

  switch (depth) {
    case 1:
      return LEARN_TOPICS_PROMPT;
    case 2:
      return parentTopics?.length ? learnSubtopicsPrompt(parentTopics) : LEARN_TOPICS_AND_SUBTOPICS_PROMPT;
    default:
      throw new Error("Invalid depth. Please provide a depth of 1 or 2.");
  }
}