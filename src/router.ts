const routes: Record<string, () => Promise<{ default: () => string }>> = {
    "/": () => import('./pages/homepage'),
    "/about-us": () => import('./pages/about-us'),
 };

export async function handleRoute() {
    const path = window.location.pathname;
    const route = routes[path] || (() => import("./pages/not-found"));

    const module = await route(); // Dynamically import the module
    document.getElementById("app")!.innerHTML = module.default();
}

// Handle navigation events
export function navigate(event: Event) {
    event.preventDefault();
    const path = (event.target as HTMLAnchorElement).getAttribute("href");
    if (path) {
        window.history.pushState({}, "", path);
        handleRoute();
    }
}

// Listen for back/forward navigation
window.onpopstate = handleRoute;