import confetti from 'canvas-confetti';

const cannonIntervalMs = 250;
const celebrationMs = 3000;

function createCannon(): confetti.CreateTypes {
  return confetti.create(undefined, { resize: true, disableForReducedMotion: true });
}

/** Short burst from a point of the screen (x and y from 0 to 1), used for a round win. */
export function burst(colors: string[], origin: confetti.Origin): void {
  createCannon()({
    particleCount: 70,
    spread: 80,
    startVelocity: 32,
    scalar: 0.9,
    ticks: 120,
    origin,
    colors,
  });
}

/**
 * Game win: one burst from the top, then cannons from both sides.
 * Returns a function that stops it early.
 */
export function celebrate(colors: string[]): () => void {
  const shoot = createCannon();
  shoot({ particleCount: 160, spread: 110, startVelocity: 45, origin: { y: 0.3 }, colors });

  const endsAt = Date.now() + celebrationMs;
  const cannons = setInterval(() => {
    if (Date.now() > endsAt) {
      clearInterval(cannons);
      return;
    }
    shoot({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0, y: 0.75 }, colors });
    shoot({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1, y: 0.75 }, colors });
  }, cannonIntervalMs);

  return () => {
    clearInterval(cannons);
    shoot.reset();
  };
}
