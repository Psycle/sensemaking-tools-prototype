import { handleRoute, navigate } from "./router";

// Attach navigate function globally (for inline onclick handlers)
(window as any).navigate = navigate;

// Load the initial route
handleRoute();