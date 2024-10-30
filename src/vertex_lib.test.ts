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

import {
  categorize,
  categorizeWithRetry,
  formatCommentsWithVotes,
  getPrompt,
  learnTopics,
} from "./vertex_lib";
import { Comment } from "./types";
import { VertexModel } from "./models/vertex_model";

// Mock the model response. This mock needs to be set up to return response specific for each test.
let mockGenerateComments: jest.SpyInstance;
let mockGenerateTopics: jest.SpyInstance;

describe("VertexLibTest", () => {
  beforeEach(() => {
    mockGenerateComments = jest.spyOn(VertexModel.prototype, "generateComments");
    mockGenerateTopics = jest.spyOn(VertexModel.prototype, "generateTopics");
  });

  afterEach(() => {
    mockGenerateTopics.mockRestore();
    mockGenerateComments.mockRestore();
  });

  it("should create a prompt", () => {
    expect(getPrompt("Summarize this:", ["comment1", "comment2"])).toEqual(
      "Instructions:\n" + "Summarize this:\n" + "Comments:\n" + "comment1\n" + "comment2"
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

  describe("CategorizeTest", () => {
    it("should batch comments correctly", async () => {
      const comments: Comment[] = [
        { id: "1", text: "Comment 1" },
        { id: "2", text: "Comment 2" },
      ];
      const topics = '[{"name": "Topic 1"}]';
      const includeSubtopics = false;
      const batchSize = 1;
      mockGenerateComments
        .mockReturnValueOnce(
          Promise.resolve([
            {
              id: "1",
              text: "Comment 1",
              topics: [{ name: "Topic 1" }],
            },
          ])
        )
        .mockReturnValueOnce(
          Promise.resolve([
            {
              id: "2",
              text: "Comment 2",
              topics: [{ name: "Topic 1" }],
            },
          ])
        );

      const categorizedComments = await categorize(
        comments,
        includeSubtopics,
        topics,
        undefined,
        false,
        batchSize
      );

      expect(mockGenerateComments).toHaveBeenCalledTimes(2);

      // Assert that the categorized comments are correct
      const expected = [
        {
          id: "1",
          text: "Comment 1",
          topics: [{ name: "Topic 1" }],
        },
        {
          id: "2",
          text: "Comment 2",
          topics: [{ name: "Topic 1" }],
        },
      ];
      expect(categorizedComments).toEqual(JSON.stringify(expected, null, 2));
    });

    it("should retry categorization with all missing comments", async () => {
      const comments: Comment[] = [
        { id: "1", text: "Comment 1" },
        { id: "2", text: "Comment 2" },
        { id: "3", text: "Comment 3" },
      ];
      const includeSubtopics = false;
      const instructions = "Categorize the comments based on these topics:  [{'name': 'Topic 1'}]";
      const commentsWithTextAndTopics = [
        {
          id: "1",
          text: "Comment 1",
          topics: [{ name: "Topic 1", subtopics: [] }],
        },
        {
          id: "2",
          text: "Comment 2",
          topics: [{ name: "Topic 1", subtopics: [] }],
        },
        {
          id: "3",
          text: "Comment 3",
          topics: [{ name: "Topic 1", subtopics: [] }],
        },
      ];

      // The first response is incorrectly missing all comments, and then
      // on retry the text is present.
      mockGenerateComments
        .mockReturnValueOnce(Promise.resolve([]))
        .mockReturnValueOnce(Promise.resolve(commentsWithTextAndTopics));

      const categorizedComments = await categorizeWithRetry(
        instructions,
        comments,
        includeSubtopics,
        [{ name: "Topic 1", subtopics: [] }]
      );

      expect(mockGenerateComments).toHaveBeenCalledTimes(2);
      expect(categorizedComments).toEqual(commentsWithTextAndTopics);
    });

    it("should retry categorization with some missing comments", async () => {
      const comments: Comment[] = [
        { id: "1", text: "Comment 1" },
        { id: "2", text: "Comment 2" },
        { id: "3", text: "Comment 3" },
      ];
      const includeSubtopics = false;
      const instructions = "Categorize the comments based on these topics:  [{'name': 'Topic 1'}]";
      const commentsWithTextAndTopics = [
        {
          id: "1",
          text: "Comment 1",
          topics: [{ name: "Topic 1", subtopics: [] }],
        },
        {
          id: "2",
          text: "Comment 2",
          topics: [{ name: "Topic 1", subtopics: [] }],
        },
        {
          id: "3",
          text: "Comment 3",
          topics: [{ name: "Topic 1", subtopics: [] }],
        },
      ];

      // The first mock response includes only one comment, and for the next
      // response the two missing comments are returned.
      mockGenerateComments
        .mockReturnValueOnce(Promise.resolve([commentsWithTextAndTopics[0]]))
        .mockReturnValueOnce(
          Promise.resolve([commentsWithTextAndTopics[1], commentsWithTextAndTopics[2]])
        );

      const categorizedComments = await categorizeWithRetry(
        instructions,
        comments,
        includeSubtopics,
        [{ name: "Topic 1", subtopics: [] }]
      );

      expect(mockGenerateComments).toHaveBeenCalledTimes(2);
      expect(categorizedComments).toEqual(commentsWithTextAndTopics);
    });

    it('should assign "Other" topic and "Uncategorized" subtopic to comments that failed categorization after max retries', async () => {
      const comments: Comment[] = [
        { id: "1", text: "Comment 1" },
        { id: "2", text: "Comment 2" },
        { id: "3", text: "Comment 3" },
      ];
      const topics = '[{"name": "Topic 1", "subtopics": []}]';
      const instructions = "Categorize the comments based on these topics: " + topics;
      const includeSubtopics = true;
      const topicsJson = [{ name: "Topic 1", subtopics: [] }];

      // Mock the model to always return an empty response. This simulates a
      // categorization failure.
      mockGenerateComments.mockReturnValue(Promise.resolve([]));

      const categorizedComments = await categorizeWithRetry(
        instructions,
        comments,
        includeSubtopics,
        topicsJson
      );

      expect(mockGenerateComments).toHaveBeenCalledTimes(3);

      const expected = [
        {
          id: "1",
          text: "Comment 1",
          topics: [{ name: "Other", subtopics: [{ name: "Uncategorized" }] }],
        },
        {
          id: "2",
          text: "Comment 2",
          topics: [{ name: "Other", subtopics: [{ name: "Uncategorized" }] }],
        },
        {
          id: "3",
          text: "Comment 3",
          topics: [{ name: "Other", subtopics: [{ name: "Uncategorized" }] }],
        },
      ];
      expect(categorizedComments).toEqual(expected);
    });
  });

  describe("TopicModelingTest", () => {
    it("should retry topic modeling when the subtopic is the same as a main topic", async () => {
      const comments: Comment[] = [
        { id: "1", text: "Comment about Roads" },
        { id: "2", text: "Comment about Parks" },
        { id: "3", text: "Another comment about Roads" },
      ];
      const includeSubtopics = true;
      const topics = "Infrastructure, Environment";

      const validResponse = [
        {
          name: "Infrastructure",
          subtopics: [{ name: "Roads" }],
        },
        {
          name: "Environment",
          subtopics: [{ name: "Parks" }],
        },
      ];

      // Mock LLM call incorrectly returns a subtopic that matches and existing
      // topic at first, and then on retry returns a correct categorization.
      mockGenerateTopics
        .mockReturnValueOnce(
          Promise.resolve([
            {
              name: "Infrastructure",
              subtopics: [{ name: "Roads" }, { name: "Environment" }],
            },
            {
              name: "Environment",
              subtopics: [{ name: "Parks" }],
            },
          ])
        )
        .mockReturnValueOnce(Promise.resolve(validResponse));

      const categorizedComments = await learnTopics(comments, includeSubtopics, topics);

      expect(mockGenerateTopics).toHaveBeenCalledTimes(2);
      expect(categorizedComments).toEqual(JSON.stringify(validResponse, null, 2));
    });

    it("should retry topic modeling when a new topic is added", async () => {
      const comments: Comment[] = [
        { id: "1", text: "Comment about Roads" },
        { id: "2", text: "Comment about Parks" },
        { id: "3", text: "Another comment about Roads" },
      ];
      const includeSubtopics = true;
      const topics = "Infrastructure, Environment";

      const validResponse = [
        {
          name: "Infrastructure",
          subtopics: [{ name: "Roads" }],
        },
        {
          name: "Environment",
          subtopics: [{ name: "Parks" }],
        },
      ];

      // Mock LLM call returns an incorrectly added new topic at first, and then
      // is correct on retry.
      mockGenerateTopics
        .mockReturnValueOnce(
          Promise.resolve([
            {
              name: "Infrastructure",
              subtopics: [{ name: "Roads" }],
            },
            {
              name: "Environment",
              subtopics: [{ name: "Parks" }],
            },
            {
              name: "Economy",
              subtopics: [],
            },
          ])
        )
        .mockReturnValueOnce(Promise.resolve(validResponse));

      const categorizedComments = await learnTopics(comments, includeSubtopics, topics);

      expect(mockGenerateTopics).toHaveBeenCalledTimes(2);
      expect(categorizedComments).toEqual(JSON.stringify(validResponse, null, 2));
    });
  });
});
