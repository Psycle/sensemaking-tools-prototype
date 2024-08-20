import { getPrompt } from "./vertex_lib";

describe("VertexLibTest", () => {
  it("should create a prompt", () => {
    expect(getPrompt("Summarize this:", ["comment1", "comment2"])).toEqual(
      "Summarize this: comment1,comment2"
    );
  });
});
