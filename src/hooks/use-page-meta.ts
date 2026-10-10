import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { canonicalUrl, getPageMeta } from "@/lib/site";

const setAttr = (selector: string, attr: string, value: string) => {
  document.head.querySelector(selector)?.setAttribute(attr, value);
};

// Keeps <title>, description and canonical in sync during client-side navigation.
// The initial values for each URL are written into the HTML by scripts/prerender.mjs.
export const usePageMeta = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = getPageMeta(pathname);
    const url = canonicalUrl(pathname);

    document.title = meta.title;
    setAttr('meta[name="description"]', "content", meta.description);
    setAttr('meta[name="robots"]', "content", meta.noindex ? "noindex" : "index, follow");
    setAttr('link[rel="canonical"]', "href", url);
    setAttr('meta[property="og:url"]', "content", url);
    setAttr('meta[property="og:title"]', "content", meta.title);
    setAttr('meta[property="og:description"]', "content", meta.description);
    setAttr('meta[name="twitter:title"]', "content", meta.title);
    setAttr('meta[name="twitter:description"]', "content", meta.description);
  }, [pathname]);
};
