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

import {
  categorize,
  categorizeWithRetry,
  generateJSON,
  getPrompt,
  formatCommentsWithVotes,
  learnTopics
} from "./vertex_lib";
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
    const includeSubtopics = false;
    const batchSize = 1;

    const generateContentStreamMock = jest.requireMock("@google-cloud/vertexai").generateContentStreamMock;
    const batch1Response = `[{"id": "1", "text": "Comment 1", "topics": [{"name": "Topic 1", "subtopics": []}]}]`;
    mockSingleModelResponse(generateContentStreamMock, batch1Response);
    const batch2Response = `[{"id": "2", "text": "Comment 2", "topics": [{"name": "Topic 1", "subtopics": []}]}]`;
    mockSingleModelResponse(generateContentStreamMock, batch2Response);

    const categorizedComments = await categorize(comments, includeSubtopics, topics, undefined, false, batchSize);

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
    const includeSubtopics = false;
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

    const categorizedComments = await categorizeWithRetry(instructions, comments, includeSubtopics, topicsJson);

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

describe("generateJSON", () => {
  it("should retry on rate limit error and return valid JSON", async () => {
    const instructions = "Some instructions";
    const comments = ["Comment 1", "Comment 2"];
    const expectedJSON = { result: "success" };

    // if we can pass the model mock directly to the function where it's being called (instead of relying on import),
    // then we don't need to use something like `jest.requireMock("@google-cloud/vertexai").generativeJsonModelMock`
    const generativeJsonModelMock = {
      generateContentStream: jest.fn(),
    };
    const generateContentStreamMock = generativeJsonModelMock.generateContentStream;

    // Mock the first call to throw a rate limit error
    generateContentStreamMock.mockImplementationOnce(() => {
      throw new Error("429 Too Many Requests");
    });

    // Mock the second call to return the expected JSON
    mockSingleModelResponse(generateContentStreamMock, JSON.stringify(expectedJSON));

    const result = await generateJSON(instructions, comments, generativeJsonModelMock);

    // Assert that the mock was called twice (initial call + retry)
    expect(generateContentStreamMock).toHaveBeenCalledTimes(2);

    // Assert that the result is the expected JSON
    expect(result).toEqual(expectedJSON);
  });
});

describe("learnTopics", () => {
  it("should retry topic modeling with invalid responses", async () => {
    const comments: Comment[] = [
      { id: "1", text: "Comment about Roads" },
      { id: "2", text: "Comment about Parks" },
      { id: "3", text: "Another comment about Roads" },
    ];
    const includeSubtopics = true;
    const topics = 'Infrastructure, Environment';

    const generateContentStreamMock = jest.requireMock("@google-cloud/vertexai").generateContentStreamMock;

    // Invalid: Subtopic "Environment" has the same name as a main topic
    const invalidResponse1 = `[
      {
        "name": "Infrastructure",
        "subtopics": [
          { "name": "Roads" },
          { "name": "Environment" }
        ]
      },
      {
        "name": "Environment",
        "subtopics": [
          { "name": "Parks" }
        ]
      }
    ]`;
    mockSingleModelResponse(generateContentStreamMock, invalidResponse1);

    // Invalid: Top-level topic "Economy" in not in parentTopics and not "Other"
    const invalidResponse2 = `[
      {
        "name": "Infrastructure",
        "subtopics": [
          { "name": "Roads" }
        ]
      },
      {
        "name": "Environment",
        "subtopics": [
          { "name": "Parks" }
        ]
      },
      {
        "name": "Economy",
        "subtopics": []
      }
    ]`;
    mockSingleModelResponse(generateContentStreamMock, invalidResponse2);

    const validResponse = `[
      {
        "name": "Infrastructure",
        "subtopics": [
          { "name": "Roads" }
        ]
      },
      {
        "name": "Environment",
        "subtopics": [
          { "name": "Parks" }
        ]
      }
    ]`;
    mockSingleModelResponse(generateContentStreamMock, validResponse);

    const categorizedComments = await learnTopics(comments, includeSubtopics, topics);

    // Assert the mock was called 3 times (initial call and 2 retries)
    expect(generateContentStreamMock).toHaveBeenCalledTimes(3);

    expect(categorizedComments).toEqual(JSON.stringify(JSON.parse(validResponse), null, 2));
  });
});