// Serves dist/ the way Vercel does: /about -> about/index.html, /about/ redirects to
// /about, and unknown paths get 404.html with a 404 status. `vite preview` falls back
// to the home page HTML instead, which hides pre-rendering problems.

import { createReadStream } from "node:fs";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");
const portArg = process.argv.indexOf("--port");
const port = Number(portArg > -1 ? process.argv[portArg + 1] : process.env.PORT) || 4173;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".glb": "model/gltf-binary",
};

const isFile = (file) => fs.stat(file).then((s) => s.isFile(), () => false);

const send = (res, status, file) => {
  res.writeHead(status, { "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
};

http
  .createServer(async (req, res) => {
    const { pathname, search } = new URL(req.url, "http://localhost");
    const urlPath = decodeURIComponent(pathname);

    if (urlPath.length > 1 && urlPath.endsWith("/")) {
      res.writeHead(308, { Location: urlPath.replace(/\/+$/, "") + search });
      return res.end();
    }

    const target = path.join(dist, urlPath);
    if (!target.startsWith(dist)) {
      res.writeHead(403);
      return res.end();
    }

    for (const file of [target, path.join(target, "index.html")]) {
      if (await isFile(file)) return send(res, 200, file);
    }
    send(res, 404, path.join(dist, "404.html"));
  })
  .listen(port, () => console.log(`Serving dist/ at http://localhost:${port}`));
