export default function sudutAntaraTigaTitik(
    x1: number, y1: number, x2: number, y2: number, x3: number,
    y3: number): number|null {
  // Vektor v1 dan v2
  const v1x = x2 - x1;
  const v1y = y2 - y1;
  const v2x = x3 - x1;
  const v2y = y3 - y1;

  // Dot product dan magnitude
  const dot = v1x * v2x + v1y * v2y;
  const mag1 = Math.hypot(v1x, v1y);
  const mag2 = Math.hypot(v2x, v2y);

  // Hindari pembagian nol
  if (mag1 === 0 || mag2 === 0) {
    return null;  // Sudut tidak terdefinisi
  }

  // Sudut dalam radian
  let cosTheta = dot / (mag1 * mag2);

  // Koreksi numerik agar tetap dalam [-1, 1]
  cosTheta = Math.max(-1, Math.min(1, cosTheta));

  const thetaRad = Math.acos(cosTheta);

  // Konversi ke derajat
  const thetaDeg = thetaRad * (180 / Math.PI);

  return thetaDeg;
}

// Contoh pemakaian:
// const sudut = sudutAntaraTigaTitik(0, 0, 1, 0, 1, 1);
// if (sudut !== null) {
//   console.log(`Sudut: ${sudut.toFixed(2)} derajat`);
// } else {
//   console.log('Sudut tidak terdefinisi.');
// }
