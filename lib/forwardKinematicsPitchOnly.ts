type Matrix4x4 = number[][];

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function dhTransform(
    theta: number, alpha: number, a: number, d: number): Matrix4x4 {
  const ct = Math.cos(toRad(theta));
  const st = Math.sin(toRad(theta));
  const ca = Math.cos(toRad(alpha));
  const sa = Math.sin(toRad(alpha));

  return [
    [ct, -st * ca, st * sa, a * ct], [st, ct * ca, -ct * sa, a * st],
    [0, sa, ca, d], [0, 0, 0, 1]
  ];
}

function matMul(a: Matrix4x4, b: Matrix4x4): Matrix4x4 {
  const result: Matrix4x4 = Array.from({length: 4}, () => Array(4).fill(0));

  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++)
      for (let k = 0; k < 4; k++) result[i][j] += a[i][k] * b[k][j];

  return result;
}

/**
 * Forward kinematics: 4 joint (θ1–θ4), θ5 is ignored (pitch only).
 */
export function forwardKinematics(
    θ1: number, θ2: number, θ3: number, θ4: number): Matrix4x4 {


  const T1 = dhTransform(θ1, 90, 0, 18.5 + 10);
  const T2 = dhTransform(θ2, 0, -16.5 - 5.5, 0);
  const T3 = dhTransform(θ3, 0, -15.0 - 5.5, 0);

  // Combine T4 and T5 since θ5 = 0 (roll is ignored)
  const T4 = dhTransform(θ4, 90, 0, 0);
  const T5 = dhTransform(0, 0, 0, 11.0);
  const T45 = matMul(T4, T5);

  let T = T1;
  for (const Ti of [T2, T3, T45]) {
    T = matMul(T, Ti);
  }

  // Rotate from Z-up (DH) to Y-up (Three.js)
  const RxNeg90: Matrix4x4 =
    [[1, 0, 0, 0],
      [0, 0, 1, 0],
      [0, -1, 0, 0],
      [0, 0, 0, 1]];

  return matMul(RxNeg90, T);
}

/**
 * Extract XYZ position from transformation matrix.
 */
export function getPositionFromMatrix(T: Matrix4x4):
    {x: number; y: number; z: number} {
  return {x: T[0][3], y: T[1][3], z: T[2][3]};
}
