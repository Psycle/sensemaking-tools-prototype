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

import { categorize, categorizeWithRetry, getPrompt, formatCommentsWithVotes } from "./vertex_lib";
import { Comment, Topic } from "./types";

// Mock the VertexAI module - this mock will be used when the module is imported within a test run.
jest.mock("@google-cloud/vertexai", () => {
  // Mock the model response. This mock needs to be set up to return response specific for each test.
  const generateContentStreamMock = jest.fn();
  return {
    // Mock `generateContentStream` function within VertexAI module
    VertexAI: jest.fn(() => ({
      getGenerativeModel: jest.fn(() => ({
        generateContentStream: generateContentStreamMock,
      })),
    })),
    // Expose the mocked function, so we can get it within a test using `jest.requireMock`, and spy on its invocations.
    generateContentStreamMock: generateContentStreamMock,
    // Mock other imports from VertexAI module
    HarmBlockThreshold: {},
    HarmCategory: {},
  };
});

function mockSingleModelResponse(generateContentStreamMock: jest.Mock, responseMock: string) {
  generateContentStreamMock.mockImplementationOnce(() => Promise.resolve({ response: { candidates: [{ content: { parts: [{ text: responseMock }] } }] } }));
}

beforeEach(() => {
  // Reset the mock before each test
  jest.requireMock("@google-cloud/vertexai").generateContentStreamMock.mockClear();
});

describe("VertexLibTest", () => {
  it("should create a prompt", () => {
    expect(getPrompt("Summarize this:", ["comment1", "comment2"])).toEqual(
      "Instructions:\n" +
      "Summarize this:\n" +
      "Comments:\n" +
      "comment1\n" +
      "comment2"
    );
  });
  it("should format comments with vote tallies via formatCommentsWithVotes", () => {
    expect(
      formatCommentsWithVotes([
        {
          id: "1",
          text: "comment1",
          voteTalliesByGroup: {
            "0": {
              agreeCount: 10,
              disagreeCount: 5,
              passCount: 0,
              totalCount: 15,
            },
            "1": {
              agreeCount: 5,
              disagreeCount: 10,
              passCount: 5,
              totalCount: 20,
            },
          },
        },
        {
          id: "2",
          text: "comment2",
          voteTalliesByGroup: {
            "0": {
              agreeCount: 2,
              disagreeCount: 5,
              passCount: 3,
              totalCount: 10,
            },
            "1": {
              agreeCount: 5,
              disagreeCount: 3,
              passCount: 2,
              totalCount: 10,
            },
          },
        },
      ])
    ).toEqual([
      `comment1
  vote info per group: {"0":{"agreeCount":10,"disagreeCount":5,"passCount":0,"totalCount":15},"1":{"agreeCount":5,"disagreeCount":10,"passCount":5,"totalCount":20}}`,
      `comment2
  vote info per group: {"0":{"agreeCount":2,"disagreeCount":5,"passCount":3,"totalCount":10},"1":{"agreeCount":5,"disagreeCount":3,"passCount":2,"totalCount":10}}`,
    ]);
  });
});

describe("categorize", () => {
  it("should batch comments correctly", async () => {
    const comments: Comment[] = [
      { id: "1", text: "Comment 1" },
      { id: "2", text: "Comment 2" },
    ];
    const topics = '[{"name": "Topic 1"}]';
    const topicDepth = 1;
    const batchSize = 1;

    const generateContentStreamMock = jest.requireMock("@google-cloud/vertexai").generateContentStreamMock;
    const batch1Response = `[{"id": "1", "text": "Comment 1", "topics": [{"name": "Topic 1", "subtopics": []}]}]`;
    mockSingleModelResponse(generateContentStreamMock, batch1Response);
    const batch2Response = `[{"id": "2", "text": "Comment 2", "topics": [{"name": "Topic 1", "subtopics": []}]}]`;
    mockSingleModelResponse(generateContentStreamMock, batch2Response);

    const categorizedComments = await categorize(comments, topicDepth, topics, undefined, batchSize);

    // Assert the mock was called twice (for two batches)
    expect(generateContentStreamMock).toHaveBeenCalledTimes(2);

    // Assert that the categorized comments are correct
    const expected = [
      { id: "1", text: "Comment 1", topics: [{ name: "Topic 1", subtopics: [] }] },
      { id: "2", text: "Comment 2", topics: [{ name: "Topic 1", subtopics: [] }] },
    ];
    expect(categorizedComments).toEqual(JSON.stringify(expected, null, 2));
  });

  it("should retry categorization with missing comments", async () => {
    const comments: Comment[] = [
      { id: "1", text: "Comment 1" },
      { id: "2", text: "Comment 2" },
      { id: "3", text: "Comment 3" },
    ];
    const topics = '[{"name": "Topic 1"}]';
    const topicDepth = 1;
    const topicsJson: Topic[] = [{ name: "Topic 1", subtopics: [] }];
    const instructions = "Categorize the comments based on these topics: " + topics;

    const generateContentStreamMock = jest.requireMock("@google-cloud/vertexai").generateContentStreamMock;

    // Mock the first response with two missing comments
    const responseMissing2Comments = `[{"id": "1", "text": "Comment 1", "topics": [{"name": "Topic 1", "subtopics": []}]}]`;
    mockSingleModelResponse(generateContentStreamMock, responseMissing2Comments);

    // Mock the second response with one missing comment
    const responseMissing1Comment = `[{"id": "2", "text": "Comment 2", "topics": [{"name": "Topic 1", "subtopics": []}]}]`;
    mockSingleModelResponse(generateContentStreamMock, responseMissing1Comment);

    // Mock the third response with all comments categorized correctly
    const responseRetriedComment = `[{"id": "3", "text": "Comment 3", "topics": [{"name": "Topic 1", "subtopics": []}]}]`;
    mockSingleModelResponse(generateContentStreamMock, responseRetriedComment);

    const categorizedComments = await categorizeWithRetry(instructions, comments, topicDepth, topicsJson);

    // Assert the mock was called 3 times (initial call and 2 retries)
    expect(generateContentStreamMock).toHaveBeenCalledTimes(3);

    const expected = [
      { id: "1", text: "Comment 1", topics: [{ name: "Topic 1", subtopics: [] }] },
      { id: "2", text: "Comment 2", topics: [{ name: "Topic 1", subtopics: [] }] },
      { id: "3", text: "Comment 3", topics: [{ name: "Topic 1", subtopics: [] }] },
    ];
    expect(categorizedComments).toEqual(expected);
  });
});
