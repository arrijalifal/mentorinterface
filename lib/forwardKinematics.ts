export default function forwardKinematics(
    joint0: number, joint1: number, joint2: number, joint3: number) {
  const l1 = 18.5;  // tinggi link pertama (dari base ke shoulder)
  const l2 = 15;    // panjang link 2 (elbow)
  const l3 = 15;    // panjang link 3 (wrist)
  const l4 = 7;     // gripper / cone

  const toRad = (deg: number) => deg * Math.PI / 180;

  const t0 = toRad(joint0);
  const t1 = toRad(joint1);
  const t2 = toRad(joint2);
  const t3 = toRad(joint3);

  const t12 = t1 + t2;
  const t123 = t1 + t2 + t3;

  const r = l2 * Math.cos(t1) + l3 * Math.cos(t12) + l4 * Math.cos(t123);
  const x = Math.cos(t0) * r;
  const y = Math.sin(t0) * r;
  const z = l1 + l2 * Math.sin(t1) + l3 * Math.sin(t12) + l4 * Math.sin(t123);

  return {x, y, z};
}
