// Shared wave field — ocean mesh, ship and treasure all sample this.
export function waveHeight(x, z, t) {
  return (
    Math.sin(x * 0.055 + t * 0.9) * 1.05 +
    Math.sin(z * 0.075 + t * 1.15) * 0.75 +
    Math.sin((x + z) * 0.04 + t * 0.55) * 0.55 +
    Math.sin((x - z) * 0.09 + t * 1.6) * 0.25
  );
}
