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
Assign each of the following comments to the most relevant topic.

Main Topics:
${topics}

Output Format:

\`\`\`json
[
  {
    "name": "Topic 1",
    "comments": ["comment 1", "comment 2"]
  },
  {
    "name": "Topic 2",
    "comments": ["comment 3", "comment 4"]
  },
  // ... other topics
]

Important Considerations:
- Ensure the assignment of comments to topics is accurate and reflects the meaning of the comment.
- If comments touch on multiple topics, they should be added to each of the corresponding topics .
- Prioritize assigning comments to existing topics whenever possible.
- Only create a new relevant topic if absolutely necessary. This should be done in very exceptional cases where no existing topic can be reasonably applied. For example, don't create a new "Transportation" topic if there's a "Public Transportation" topic.
- When creating a new topic, explicitly mark it as "NEW" so we can track what was added to the original ones. For example:
{ "name": "NEW TOPIC: Other", ... }
- In the final output, only include topics that have at least one comment assigned.
- Do not add \`\`\`json at the beginning of your response.
- Before providing the final output, ensure that the generated JSON is valid and well-formed.
`;
}

export function subtopicCategorizationPrompt(topics: string): string {
  return `
Assign each of the following comments to the most relevant subtopic within the corresponding main topic.

Main Topics and Subtopics:
${topics}

Output Format:

\`\`\`json
[
  {
    "name": "Topic 1",
    "subtopics": [
        { "name": "Subtopic 1.1",
          "comments": ["comment 1", "comment 2"] },
        { "name": "Subtopic 1.2",
          "comments": ["comment 3"] },
        // ... other subtopics and their comments
    ]
  },
  {
    "name": "Topic 2",
    "subtopics": [
        // ... subtopics and their comments
    ]
  },
  // ... other topics
]

Important Considerations:
- Ensure the assignment of comments to subtopics is accurate and reflects the meaning of the comment.
- If comments touch on multiple topics, they should be added to each of the corresponding topics and their relevant subtopics.
- Ideally, all comments should be assigned to at least one subtopic for better hierarchy.
- Prioritize assigning comments to existing subtopics whenever possible.
- Only create a new relevant subtopic within an existing main topic or a new main topic if absolutely necessary. This should be done in very exceptional cases where no existing subtopic can be reasonably applied. For example, don't create a new "Transportation" topic if there's a "Public Transportation" subtopic.
- If creating a new main topic like "Other", try to come up with relevant subtopics (e.g., "Ambiguous", "Humorous", "Off-topic") to categorize different types of comments within that topic.
- When creating a new topic or subtopic, explicitly mark it as "NEW" so we can track what was added to the original ones. For example:
{ "name": "NEW TOPIC: Other", ... }  // for topics
{ "name": "NEW SUBTOPIC: Ambiguous", ... }  // for subtopics
- In the final output, only include topics that have at least one comment assigned to one or more of their subtopics. Similarly, within each topic, only include subtopics that have at least one comment assigned to them.
- Do not add \`\`\`json at the beginning of your response.
- Before providing the final output, ensure that the generated JSON is valid and well-formed.

Example of Incorrect Output - invalid JSON syntax:

...
  {
    "name": "Quality of Life",
    "subtopics": [
      {
        "name": "Parks and Recreation",
        "comments": [
          "Skating rink on Gordon ave."
        ]
      ] // Incorrect: Should be a closing brace '}' here instead of a closing bracket ']'
    ]
  ] // Incorrect: Should be a closing brace '}' here instead of a closing bracket ']'
]

Example of Incorrect Output - a subtopic with empty comments included in the output:

{
  "name": "Stormwater Management",
  "comments": []  // Incorrect: a subtopic without comments should be removed from the output
},
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
 * Merges a new batch of categorized comments into an existing categorization structure.
 *
 * This function iterates through the topics and subtopics in the `newBatch` and either:
 *   - Merges comments into existing topics/subtopics if they have matching names.
 *   - Adds new topics/subtopics to the `allExisting` structure if they don't exist.
 *
 * @param allExisting - The existing categorization structure to merge into. This array will be modified in-place.
 * @param newBatch - The new batch of categorized comments to merge.
 */
export function mergeCategorizations(allExisting: any, newBatch: any) {
  for (const batchTopic of newBatch) {
    const existingTopic = allExisting.find((existingTopic: any) => existingTopic.name === batchTopic.name);

    if (!existingTopic) {
      // New topic, add it
      allExisting.push(batchTopic);
      continue;
    }

    // Topic exists, merge subtopics
    for (const batchSubtopic of batchTopic.subtopics) {
      const existingSubtopic = existingTopic.subtopics.find(
        (existingSubtopic: any) => existingSubtopic.name === batchSubtopic.name
      );

      if (existingSubtopic) {
        // Subtopic exists, merge comments
        existingSubtopic.comments = [
          ...(existingSubtopic.comments || []), // handle undefined comments
          ...batchSubtopic.comments,
        ];
      } else {
        // New subtopic, add it
        existingTopic.subtopics.push(batchSubtopic);
      }
    }
  }
}