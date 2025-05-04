export default function inverseKinematics(x: number, y: number, z: number) {
  const L1 = 3;
  const L2 = 2.5;
  const L3 = 2.5;
  let jointAngles = {joint0: 0, joint1: 0, joint2: 0, joint3: 0};

  // Joint 0 (Base rotation)
  jointAngles.joint0 = Math.atan2(y, x) * (180 / Math.PI);

  // Hitung posisi end-effector dalam bidang XZ
  let d = Math.sqrt(x * x + y * y);
  let h = z;
  let r = Math.sqrt(d * d + h * h);

  // Gunakan hukum cosinus untuk menghitung joint1 dan joint2
  let alpha =
      Math.acos((L2 * L2 + r * r - L3 * L3) / (2 * L2 * r)) * (180 / Math.PI);
  let beta =
      Math.acos((L2 * L2 + L3 * L3 - r * r) / (2 * L2 * L3)) * (180 / Math.PI);

  // Joint 1 (Shoulder rotation)
  jointAngles.joint1 = Math.atan2(h, d) * (180 / Math.PI) + alpha;

  // Joint 2 (Elbow rotation)
  jointAngles.joint2 = 180 - beta;

  // Joint 3 (Wrist rotation, diatur ke 0 untuk sekarang)
  jointAngles.joint3 = 0;

  return jointAngles;
}
