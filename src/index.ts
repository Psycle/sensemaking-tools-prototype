// UI Components
import { Header } from "@google/glue";
import { YoutubeVideo } from "@google/glue";

document.addEventListener("DOMContentLoaded", () => {
  // @Initializers..
  const headerEl = document.querySelector<HTMLElement>(".glue-header");
  if (headerEl) new Header(headerEl);

  const videoElement = document.querySelector<HTMLElement>(".glue-video");
  if (videoElement) new YoutubeVideo(videoElement);
});
