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

// Module to interact with LLMs.

import {
  GenerativeModel,
  HarmBlockThreshold,
  HarmCategory,
  ModelParams,
  VertexAI,
  Schema,
  SchemaType,
} from "@google-cloud/vertexai";
import { Topic, Comment, isCommentType, isTopicType } from "../types";

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({
  project: "conversation-ai-experiments",
  location: "us-central1",
});
const model = "gemini-1.5-pro-002";

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_UNSPECIFIED,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

// RESPONSE SCHEMAS
// For details see: https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/control-generated-output
const topicLearningSchema: Schema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      name: { type: SchemaType.STRING },
    },
  },
};

const topicAndSubtopicLearningSchema: Schema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      name: { type: SchemaType.STRING },
      subtopics: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            name: { type: SchemaType.STRING },
          },
        },
      },
    },
  },
};

const topicCategorizationSchema: Schema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    required: ["id", "topics"],
    properties: {
      id: { type: SchemaType.STRING }, // Comment id
      topics: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          required: ["name"],
          properties: {
            name: { type: SchemaType.STRING }, // Topic name
          },
        },
      },
    },
  },
};

const topicAndSubtopicCategorizationSchema: Schema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    required: ["id", "topics"],
    properties: {
      id: { type: SchemaType.STRING }, // Comment id
      topics: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          required: ["name", "subtopics"],
          properties: {
            name: { type: SchemaType.STRING }, // Topic name
            subtopics: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                required: ["name"],
                properties: {
                  name: { type: SchemaType.STRING }, // Subtopic name
                },
              },
            },
          },
        },
      },
    },
  },
};

/**
 * Creates a model specification object for Vertex AI generative models.
 *
 * @param schema Optional. The JSON schema for the response. Only used if responseMimeType is 'application/json'.
 * @returns A model specification object ready to be used with vertex_ai.getGenerativeModel().
 */
function getModelSpec(schema?: Schema): ModelParams {
  return {
    model: model,
    generationConfig: {
      // Param docs: http://cloud/vertex-ai/generative-ai/docs/model-reference/inference#generationconfig
      maxOutputTokens: 8192,
      temperature: 0,
      topP: 0,
      ...(schema && {
        // if no `schema` is provided, the params below won't be set
        response_mime_type: "application/json",
        schema,
      }),
    },
    safetySettings: safetySettings,
  };
}

// Instantiate the models
const baseModel = vertex_ai.getGenerativeModel(
  getModelSpec() // No schema for the base model
);
const topicLearningModel = vertex_ai.getGenerativeModel(getModelSpec(topicLearningSchema));
const topicAndSubtopicLearningModel = vertex_ai.getGenerativeModel(
  getModelSpec(topicAndSubtopicLearningSchema)
);
const topicCategorizationModel = vertex_ai.getGenerativeModel(
  getModelSpec(topicCategorizationSchema)
);
const topicAndSubtopicCategorizationModel = vertex_ai.getGenerativeModel(
  getModelSpec(topicAndSubtopicCategorizationSchema)
);

// The maximum number of times an API call should be retried.
export const MAX_RETRIES = 3;
// How long in miliseconds to wait between API calls.
export const RETRY_DELAY_MS = 2000; // 2 seconds. TODO: figure out how to set it to zero for tests

function getRequest(prompt: string) {
  return {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  };
}

/**
 * Lower level protocol for sending a set of instructions to an llm with
 * comments (which could contain summary information).
 */
export async function executeRequest(prompt: string): Promise<string> {
  const req = getRequest(prompt);
  const streamingResp = await baseModel.generateContentStream(req);

  const response = await streamingResp.response;
  if (response.candidates![0].content.parts[0].text) {
    return response.candidates![0].content.parts[0].text;
  } else {
    console.warn("Malformed response: ", response);
    throw new Error("Error from Generative Model, response: " + response);
  }
}

/**
 * Generates topics and optionally subtopics based on a prompt.
 * @param prompt includes both model instructions and comments to find topics for.
 * @param includeSubtopics when true both Topics and Subtopics will be found.
 * @returns a list of topics that are present in the input.
 */
export async function generateTopics(prompt: string, includeSubtopics: boolean): Promise<Topic[]> {
  const model = includeSubtopics ? topicAndSubtopicLearningModel : topicLearningModel;
  return generateTopicsWithModel(prompt, model);
}

/**
 *  Categorizes the comments based on the given Topics.
 * @param prompt includes both model instructions and comments to categorize.
 * @param includeSubtopics when true both Topics and Subtopics will be found.
 * @returns a list of Comments which all contain at least one associated Topic.
 */
export async function generateComments(
  prompt: string,
  includeSubtopics: boolean
): Promise<Comment[]> {
  const model = includeSubtopics ? topicAndSubtopicCategorizationModel : topicCategorizationModel;
  return generateCommentsWithModel(prompt, model);
}

/**
 * Helper function for tests. Categorizes the comments based on the given Topics.
 * @param prompt includes both model instructions and comments to categorize.
 * @param model what model to call for generation.
 * @returns a list of Comments which all contain at least one associated Topic.
 */
// TODO: Restrict access to this function. It is intended to only be available for testing. It can
// be made "protected" once it is a class method.
export async function generateCommentsWithModel(
  prompt: string,
  model: GenerativeModel
): Promise<Comment[]> {
  const response = await generateJSON(prompt, model);
  if (!response.every((comment: Comment) => isCommentType(comment))) {
    // TODO: Add retry logic for this error.
    throw new Error("Model response comments are not all valid, response: " + response);
  }
  return response;
}

/**
 * Helper function for tests. Generates topics and optionally subtopics based on a prompt.
 * @param prompt includes both model instructions and comments to find topics for.
 * @param model what model to call for generation.
 * @returns a list of topics that are present in the input.
 */
// TODO: Restrict access to this function. It is intended to only be available for testing. It can
// be made "protected" once it is a class method.
export async function generateTopicsWithModel(
  prompt: string,
  model: GenerativeModel
): Promise<Topic[]> {
  const response = await generateJSON(prompt, model);
  if (!response.every((topic: Topic) => isTopicType(topic))) {
    // TODO: Add retry logic for this error.
    throw new Error("Model response topics are not all valid, response: " + response);
  }
  return response;
}

/**
 * Utility function for sending a set of instructions to an LLM with comments,
 * and returning the results as an array of JSON. It includes retry logic to handle rate limit
 * errors.
 *
 * @param instructions The instructions for the LLM on how to process the comments.
 * @param prompt The instructions for the LLM on how to process the comments.
 * @returns A Promise that resolves with the LLM's output parsed as a JSON object.
 * @throws An error if the LLM's response is malformed or if there's an error during processing.
 */
// TODO: Restrict access to this function. It is intended to only be available for testing. It can
// be made "protected" once it is a class method.
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export async function generateJSON(prompt: string, model: GenerativeModel): Promise<any[]> {
  const req = getRequest(prompt);
  let streamingResp;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      streamingResp = await model.generateContentStream(req);
      break; // Exit loop if successful
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("429 Too Many Requests") ||
          error.message.includes("RESOURCE_EXHAUSTED")) &&
        attempt < MAX_RETRIES
      ) {
        console.warn(
          `Rate limit error, attempt ${attempt}. Retrying in ${RETRY_DELAY_MS / 1000} seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      } else {
        console.error("Error during generateJSON:", error);
        throw error;
      }
    }
  }

  if (!streamingResp) {
    throw new Error("Failed to get a model response after multiple retries.");
  }

  const response = await streamingResp.response;

  if (response.candidates![0].content.parts[0].text) {
    const responseText = response.candidates![0].content.parts[0].text;
    const generatedJSON = JSON.parse(responseText);
    if (!Array.isArray(generatedJSON)) {
      throw new Error("Model response is not a list: " + response);
    }
    return generatedJSON;
  } else {
    console.warn("Malformed response: ", response);
    throw new Error("Error from Generative Model, response: " + response);
  }
}
