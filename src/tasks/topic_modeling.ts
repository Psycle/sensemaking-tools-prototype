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
  let instructions =
    "Identify a " +
    depth +
    "-tiered hierarchical topic modeling of the following comments, and return the results as ";
  if (depth == 1) {
    instructions += "an array of strings.";
  } else if (depth == 2) {
    instructions +=
      "an array of objects with keys name and subtopics, where subtopics points to an array strings (no nested objects).";
  }
  if (parentTopics !== undefined) {
    instructions +=
      " The top level topics should be: " +
      JSON.stringify([
        "Infrastructure & Development",
        "Social & Community Issues",
        "Economy & Employment",
        "Governance & Policy",
      ]) +
      ".";
    console.log(instructions);
  }
  return instructions;
}