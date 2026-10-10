import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";

export { SITE_URL, businessJsonLd, canonicalUrl, getPageMeta, pages } from "./lib/site";

// Used by scripts/prerender.mjs to render each route to static HTML at build time.
export const render = (url: string) =>
  renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
