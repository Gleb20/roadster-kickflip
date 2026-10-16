// Nine video-derived poses, normalized to 256 x 160 with one centre anchor.
// The final key closes the loop on the original upright frame.
const keys = [0, .10, .25, .35, .43, .53, .67, .78, .92, 1];
export function flipFrameAt(jumpPhase) {
  const phase = Math.max(0, Math.min(1, (jumpPhase - .08) / .84));
  for (let i = 0; i < keys.length - 1; i++) {
    if (phase < (keys[i] + keys[i + 1]) / 2) return i;
  }
  return 0;
}
export function createFlipSprite() {
  const image = new Image();
  return {
    load() {
      return new Promise((resolve, reject) => {
        image.onload = resolve; image.onerror = reject;
        image.src = new URL('../assets/roadster-flip/atlas.png', import.meta.url).href;
      });
    },
    drawFrame(ctx, frame, x, y, width = 108) {
      const height = width * 160 / 256;
      ctx.drawImage(image, (frame % 3) * 256, Math.floor(frame / 3) * 160,
        256, 160, x - width / 2, y - 6 - height / 2, width, height);
    },
    draw(ctx, x, y, phase) { this.drawFrame(ctx, flipFrameAt(phase), x, y); }
  };
}
