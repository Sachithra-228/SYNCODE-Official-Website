import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { normalizePath } from "./lib/site";
import "./index.css";

const container = document.getElementById("root")!;
const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Pages are pre-rendered at build time (scripts/prerender.mjs). Hydrate when the markup
// was rendered for this exact URL; otherwise (dev server, 404 page) render from scratch.
if (container.dataset.prerendered === normalizePath(window.location.pathname)) {
  hydrateRoot(container, app);
} else {
  container.innerHTML = "";
  createRoot(container).render(app);
}
