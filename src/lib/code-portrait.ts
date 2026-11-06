// Turns a photo into a grid of brightness values for drawing portraits out of characters.

const COLS = 72;
// Character cells are taller than they are wide
export const CELL_ASPECT = 0.6;

export type Cell = { lum: number; t: number };

/** Crop as fractions of the photo: [x, y, width, height]. */
export type Crop = [number, number, number, number];

/**
 * Build the grid of brightness values from a photo. The crop frames the head and
 * shoulders; a plain background is dropped, and contrast is stretched so the face reads.
 */
export const cellsFromImage = (
  img: HTMLImageElement,
  crop: Crop = [0, 0, 1, 1],
  cols = COLS
): { cells: Cell[]; rows: number } => {
  const sx = crop[0] * img.naturalWidth;
  const sy = crop[1] * img.naturalHeight;
  const sw = crop[2] * img.naturalWidth;
  const sh = crop[3] * img.naturalHeight;
  const rows = Math.round(cols * (sh / sw) * CELL_ASPECT);
  const c = document.createElement("canvas");
  c.width = cols;
  c.height = rows;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
  const { data } = ctx.getImageData(0, 0, cols, rows);

  const px = (x: number, y: number) => {
    const i = (y * cols + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };

  // Background colour: the average of the left and right edges
  const edge: number[][] = [];
  for (let y = 0; y < rows; y++) edge.push(px(0, y), px(cols - 1, y));
  const bg = [0, 1, 2].map((k) => edge.reduce((s, p) => s + p[k], 0) / edge.length);
  const spread =
    Math.sqrt(edge.reduce((s, p) => s + (p[0] - bg[0]) ** 2 + (p[1] - bg[1]) ** 2 + (p[2] - bg[2]) ** 2, 0) / edge.length) || 0;
  // Only remove the background when it is a plain, even colour
  const plainBackground = spread < 22;
  const threshold = Math.max(26, spread * 2.2);

  // Contrast stretch: map the 4th-96th percentile of brightness to 0-1
  const lums: number[] = [];
  for (let i = 0; i < data.length; i += 4) lums.push((0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255);
  const sorted = [...lums].sort((a, b) => a - b);
  const lo = sorted[Math.floor(sorted.length * 0.04)];
  const hi = sorted[Math.floor(sorted.length * 0.96)];
  const stretch = (v: number) => Math.max(0, Math.min(1, (v - lo) / Math.max(0.05, hi - lo)));

  // Edge strength (Sobel) makes eyes, brows, mouth and hairline stand out
  const L = (x: number, y: number) => lums[Math.min(rows - 1, Math.max(0, y)) * cols + Math.min(cols - 1, Math.max(0, x))];
  const edges: number[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const gx = L(x + 1, y - 1) + 2 * L(x + 1, y) + L(x + 1, y + 1) - L(x - 1, y - 1) - 2 * L(x - 1, y) - L(x - 1, y + 1);
      const gy = L(x - 1, y + 1) + 2 * L(x, y + 1) + L(x + 1, y + 1) - L(x - 1, y - 1) - 2 * L(x, y - 1) - L(x + 1, y - 1);
      edges.push(Math.sqrt(gx * gx + gy * gy));
    }
  }
  const edgeMax = [...edges].sort((a, b) => a - b)[Math.floor(edges.length * 0.95)] || 1;

  const cells: Cell[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const [r, g, b] = px(x, y);
      const dist = Math.sqrt((r - bg[0]) ** 2 + (g - bg[1]) ** 2 + (b - bg[2]) ** 2);
      const lum = stretch((0.299 * r + 0.587 * g + 0.114 * b) / 255);
      // Soft oval fade towards the edges keeps busy backgrounds quiet
      const dx = (x / cols - 0.5) / 0.5;
      const dy = (y / rows - 0.42) / 0.6;
      const fade = Math.max(0, Math.min(1, (plainBackground ? 1.5 : 1.25) - Math.sqrt(dx * dx + dy * dy)));
      const edge = Math.min(1, edges[y * cols + x] / edgeMax);
      const value = Math.min(1, 0.5 * Math.pow(lum, 1.2) + 0.85 * edge) * fade;
      cells.push({
        lum: (plainBackground && dist < threshold) || value < 0.04 ? -1 : value,
        // Decodes roughly top to bottom, with some randomness
        t: 0.65 * (y / rows) + 0.3 * Math.random(),
      });
    }
  }
  return { cells, rows };
};
