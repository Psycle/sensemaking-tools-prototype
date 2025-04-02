// UI Components
import { Header } from "@google/glue";

document.addEventListener("DOMContentLoaded", () => {
    // @Initializers..
    const headerEl = document.querySelector<HTMLElement>(".glue-header");
    if (headerEl) new Header(headerEl);
});
 