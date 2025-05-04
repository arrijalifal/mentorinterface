export default function forwardKinematicsDH(jointAngles: number[]) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dhMatrix = (theta: number, alpha: number, a: number, d: number) => {
    const th = toRad(theta);
    const al = toRad(alpha);
    return [
      [
        Math.cos(th), -Math.sin(th) * Math.cos(al), Math.sin(th) * Math.sin(al),
        a * Math.cos(th)
      ],
      [
        Math.sin(th), Math.cos(th) * Math.cos(al), -Math.cos(th) * Math.sin(al),
        a * Math.sin(th)
      ],
      [0, Math.sin(al), Math.cos(al), d],
      [0, 0, 0, 1],
    ];
  };

  const multiply4x4 = (a: number[][], b: number[][]): number[][] => {
    return a.map(
        (row, i) => row.map(
            (_, j) => a[i].reduce((sum, _, k) => sum + a[i][k] * b[k][j], 0)));
  };

  // D-H parameter for 4 joints (in meters)
  const dhParams: [number, number, number, number][] = [
    [jointAngles[0], 90, 0, 0.185],
    [jointAngles[1] - 90, 0, 0.165, 0],
    [jointAngles[2], 0, 0.150, 0],
    [jointAngles[3], 90, 0, 0.110],
    [0, 0, 0, 0.110],
  ];

  let T = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];

  for (const [theta, alpha, a, d] of dhParams) {
    T = multiply4x4(T, dhMatrix(theta, alpha, a, d));
  }

  return {x: T[0][3], y: T[1][3], z: T[2][3]};
  // return {x: T[0][3], y: T[2][3], z: T[1][3]};
}
