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

import { HarmBlockThreshold, HarmCategory, VertexAI } from "@google-cloud/vertexai";

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
const topicLearningSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      name: { type: "string" },
    },
  },
};

const topicAndSubtopicLearningSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      name: { type: "string" },
      subtopics: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
          },
        },
      },
    },
  },
};

const topicCategorizationSchema = {
  type: "array",
  items: {
    type: "object",
    required: ["id", "topics"],
    properties: {
      id: { type: "string" }, // Comment id
      topics: {
        type: "array",
        items: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string" }, // Topic name
          },
        },
      },
    },
  },
};

const topicAndSubtopicCategorizationSchema = {
  type: "array",
  items: {
    type: "object",
    required: ["id", "topics"],
    properties: {
      id: { type: "string" }, // Comment id
      topics: {
        type: "array",
        items: {
          type: "object",
          required: ["name", "subtopics"],
          properties: {
            name: { type: "string" }, // Topic name
            subtopics: {
              type: "array",
              items: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string" }, // Subtopic name
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
 * @param responseSchema Optional. The JSON schema for the response. Only used if responseMimeType is 'application/json'.
 * @returns A model specification object ready to be used with vertex_ai.getGenerativeModel().
 */
function getModelSpec(responseSchema?: any): any {
  return {
    model: model,
    generationConfig: {
      // Param docs: http://cloud/vertex-ai/generative-ai/docs/model-reference/inference#generationconfig
      maxOutputTokens: 8192,
      temperature: 0,
      topP: 0,
      ...(responseSchema && {
        // if no `responseSchema` is provided, the params below won't be set
        response_mime_type: "application/json",
        responseSchema,
      }),
    },
    safetySettings: safetySettings,
  };
}

// Instantiate the models
const baseModel = vertex_ai.getGenerativeModel(
  getModelSpec() // No responseSchema for the base model
);
export const topicLearningModel = vertex_ai.getGenerativeModel(getModelSpec(topicLearningSchema));
export const topicAndSubtopicLearningModel = vertex_ai.getGenerativeModel(
  getModelSpec(topicAndSubtopicLearningSchema)
);
export const topicCategorizationModel = vertex_ai.getGenerativeModel(
  getModelSpec(topicCategorizationSchema)
);
export const topicAndSubtopicCategorizationModel = vertex_ai.getGenerativeModel(
  getModelSpec(topicAndSubtopicCategorizationSchema)
);

export const MAX_RETRIES = 3;
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
 * Utility function for sending a set of instructions to an LLM with comments,
 * and returning the results as JSON. It includes retry logic to handle rate limit errors.
 *
 * @param instructions The instructions for the LLM on how to process the comments.
 * @param prompt The instructions for the LLM on how to process the comments.
 * @returns A Promise that resolves with the LLM's output parsed as a JSON object.
 * @throws An error if the LLM's response is malformed or if there's an error during processing.
 */
export async function generateJSON(prompt: string, model: any): Promise<any> {
  const req = getRequest(prompt);
  let streamingResp;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      streamingResp = await model.generateContentStream(req);
      break; // Exit loop if successful
    } catch (error: any) {
      if (
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
    return generatedJSON;
  } else {
    console.warn("Malformed response: ", response);
    throw new Error("Error from Generative Model, response: " + response);
  }
}
