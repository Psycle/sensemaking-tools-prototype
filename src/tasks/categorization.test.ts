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
  it('should generate a categorization prompt with sample topics', () => {
    const topics = `
[{"name":"Economic Development","subtopics":[{"name":"Job Creation"},{"name":"Business Growth"}]},
{"name":"Housing","subtopics":[{"name":"Affordable Housing Options"},{"name":"Rental Market Prices"}]}]
`;
    const prompt = generateCategorizationPrompt(topics);
    expect(prompt).toContain('Economic Development');
    expect(prompt).toContain('Job Creation');
    expect(prompt).toContain('Housing');
    expect(prompt).toContain('Rental Market Prices');
    expect(prompt).toContain('Output Format:');
    expect(prompt).toContain('Important Considerations:');
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