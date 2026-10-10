# SYNCODE Website

## Project Description
Official website for SYNCODE, a professional software company. The experience is responsive, premium, and monochrome (black-and-white) with 3D effects, scroll-driven animations, and interactive team hover popups to showcase services, projects, and team expertise.

## Live Demo
[Hosted Link Here]

## Tech Stack
- Frontend: Next.js, React
- Styling: Tailwind CSS
- Animations & Motion: Framer Motion
- Version control: Git
- Package manager: npm (with committed package-lock.json)

## Project Structure
- /pages (Home, About Us, Services, Projects, Contact)
- /components (reusable components like Hero, Services Card, Project Card, Team Popup, Testimonials)
- /public (assets: logo, images, videos)
- /styles (global Tailwind CSS configuration)

## Features
- Full-screen hero video with 3D text overlay
- Horizontal scrolling testimonials
- Services overview with individual service pages
- Projects section with 3 initial project pages including diagrams and final product images
- About Us page with embedded team section and 3D hover popups
- Contact page with form and embedded map
- Fully responsive across devices

## Installation
1) Clone the repository
```sh
git clone <REPO_URL>
cd <REPO_NAME>
```
2) Install dependencies
```sh
npm install
```
3) Run the development server
```sh
npm run dev
```
4) Open the app
Visit http://localhost:5173 (or the port shown in the terminal).

## Contributing
Contributions from the team are welcome. Please follow existing code standards, keep changes scoped, and open pull requests with clear descriptions and testing notes.

## License
MIT License (or update this section with the chosen license).

## Build and pre-rendering
The site is a Vite + React SPA that is pre-rendered at build time, so every page ships its real content in the HTML (needed for search engines and link previews).

- `npm run build` builds the client, builds a server bundle (`src/entry-server.tsx`), then runs `scripts/prerender.mjs`, which writes `dist/<route>/index.html` for every route, plus `404.html` and `sitemap.xml`.
- `npm run preview` serves `dist/` the same way Vercel does.
- **Adding a page:** add the route in `src/App.tsx` and add its path, title and description to `pages` in `src/lib/site.ts`. A route that is missing from that list is not pre-rendered and returns 404 when opened directly.
- Business details (name, address, phone, hours, social links) live in `src/lib/site.ts` and must match the Google Business Profile.
- Code that touches `window` or `document` must run inside `useEffect`, because components also render in Node during the build.
