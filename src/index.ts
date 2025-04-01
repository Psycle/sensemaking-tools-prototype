import { handleRoute, navigate } from "./lib/router";
import './themes/index.scss';

// Attach navigate function globally (for inline onclick handlers)
(window as any).navigate = navigate;

// Load the initial route
handleRoute();