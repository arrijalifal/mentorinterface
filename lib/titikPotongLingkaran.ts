export default function titikPotongLingkaran(
    x1: number, y1: number, r1: number, x2: number, y2: number,
    r2: number): [[number, number], [number, number]]|null {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const d = Math.hypot(dx, dy);

  // Tidak ada titik potong
  if (d > r1 + r2 || d < Math.abs(r1 - r2) || (d === 0 && r1 === r2)) {
    return null;
  }

  const a = (r1 ** 2 - r2 ** 2 + d ** 2) / (2 * d);
  const h = Math.sqrt(r1 ** 2 - a ** 2);

  const x3 = x1 + a * dx / d;
  const y3 = y1 + a * dy / d;

  const rx = -dy * (h / d);
  const ry = dx * (h / d);

  const xi1 = x3 + rx;
  const yi1 = y3 + ry;
  const xi2 = x3 - rx;
  const yi2 = y3 - ry;

  return [[xi1, yi1], [xi2, yi2]];
}

// Contoh pemakaian:
// const hasil = titikPotongLingkaran(0, 0, 5, 4, 0, 3);
// if (hasil) {
//   console.log('Titik potong:', hasil[0], 'dan', hasil[1]);
// } else {
//   console.log('Tidak ada titik potong.');
// }
