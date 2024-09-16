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

import {generateCategorizationPrompt, mergeCategorizations} from './categorization';

describe('Categorization Prompt Generator', () => {
  const sampleTopics = `
[{"name":"Economic Development","subtopics":[{"name":"Job Creation"},{"name":"Business Growth"}]},
{"name":"Housing","subtopics":[{"name":"Affordable Housing Options"},{"name":"Rental Market Prices"}]}]
`;

  it('should generate a 1-level categorization prompt', () => {
    const topicDepth = 1;
    const prompt = generateCategorizationPrompt(sampleTopics, topicDepth);
    expect(prompt).toContain('Assign each of the following comments to the most relevant topic.');
    expect(prompt).toContain('Economic Development');
  });

  it('should generate a 2-level categorization prompt', () => {
    const topicDepth = 2;
    const prompt = generateCategorizationPrompt(sampleTopics, topicDepth);
    expect(prompt).toContain('Assign each of the following comments to the most relevant subtopic within the corresponding main topic.');
    expect(prompt).toContain('Economic Development');
  });

  it('should throw an error for more than two levels topics', () => {
    const topicDepth = 3;
    expect(() => generateCategorizationPrompt(sampleTopics, topicDepth)).toThrowError("Invalid topic depth. Please provide a depth of 1 or 2.");
  });
});

describe('Categorization Merger', () => {
  it('should merge new categories into existing categories', () => {
    const allExisting = [
      {
        "name": "Economic Development",
        "subtopics": [
          {"name": "Job Creation", "comments": ["comment 1"]},
          {"name": "Business Growth", "comments": ["comment 2"]}
        ]
      },
      {
        "name": "Housing",
        "subtopics": [
          {"name": "Affordable Housing Options", "comments": ["comment 3"]}
        ]
      }
    ];

    const newBatch = [
      {
        "name": "Economic Development",
        "subtopics": [
          {"name": "Job Creation", "comments": ["comment 4"]},
          {"name": "NEW SUBTOPIC: Infrastructure", "comments": ["comment 5"]}
        ]
      },
      {
        "name": "NEW TOPIC: Environment",
        "subtopics": [
          {"name": "NEW SUBTOPIC: Parks", "comments": ["comment 6"]}
        ]
      }
    ];

    mergeCategorizations(allExisting, newBatch);

    expect(allExisting).toEqual([
      {
        "name": "Economic Development",
        "subtopics": [
          {"name": "Job Creation", "comments": ["comment 1", "comment 4"]},
          {"name": "Business Growth", "comments": ["comment 2"]},
          {"name": "NEW SUBTOPIC: Infrastructure", "comments": ["comment 5"]}
        ]
      },
      {
        "name": "Housing",
        "subtopics": [
          {"name": "Affordable Housing Options", "comments": ["comment 3"]}
        ]
      },
      {
        "name": "NEW TOPIC: Environment",
        "subtopics": [
          {"name": "NEW SUBTOPIC: Parks", "comments": ["comment 6"]}
        ]
      }
    ]);
  });
});