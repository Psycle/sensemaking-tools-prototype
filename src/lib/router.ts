const routes: Record<string, () => Promise<{ default: () => string }>> = {
  "/": () => import("../pages/homepage"),
  "/about-us": () => import("../pages/about-us"),
};

// GitHub Pages requires hash routing since it's a static site.
// All routes (except home) need "/#/", e.g., "/#/about-us".

export async function handleRoute() {
  let path = window.location.hash;

  // Remove the hash prefix only if it starts with "#/"
  if (path.startsWith("#/")) {
    path = path.replace("#/", "/");
  } else {
    path = "/";
  }

  const route = routes[path] || (() => import("../pages/not-found"));
  const module = await route(); // Dynamically import the module

  // Import layout parts
  const [headerModule, footerModule, containerModule] = await Promise.all([
    import("../layout/header"),
    import("../layout/footer"),
    import("../layout/container"),
  ]);

  // Dynamically assemble the layout
  const header = headerModule.default();
  const footer = footerModule.default();
  const container = containerModule.default(module.default());

  const renderedHtml = `
    ${header}
    ${container}
    ${footer}
  `;

  // Update the DOM with the full layout
  document.getElementById("root")!.innerHTML = renderedHtml;
}

// Handle navigation events
export function navigate(event: Event) {
  event.preventDefault();
  const path = (event.target as HTMLAnchorElement).getAttribute("href");
  if (path) {
    // Add the hash prefix only if the path is not "/"
    const hashPath = path === "/" ? path : `/#${path}`;
    window.history.pushState({}, "", hashPath);
    handleRoute();
  }
}

// Listen for back/forward navigation
window.onpopstate = handleRoute;
