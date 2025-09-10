import * as THREE from 'three';

export default function inverseKinematicsFromMatrix(
    x: number, y: number, z: number, theta4_deg: number) {
  // === STEP 1: Buat matrix target end-effector ===
  const position = new THREE.Vector3(x, y, z);
  const rotation =
      new THREE.Euler(0, 0, THREE.MathUtils.degToRad(theta4_deg));  // hanya Z
  const quaternion = new THREE.Quaternion().setFromEuler(rotation);
  const T_ee = new THREE.Matrix4().compose(
      position, quaternion, new THREE.Vector3(1, 1, 1));

  // === STEP 2: Inverse semua translasi yang kamu pakai di FK ===
  const T5_inv =
      new THREE.Matrix4().makeTranslation(10.6172, 0, 0);  // TEffector⁻¹
  const T4_inv =
      new THREE.Matrix4().makeTranslation(15.1391, 0, 4.64517);  // TGripper⁻¹
  const T3_inv =
      new THREE.Matrix4().makeTranslation(17.398, 0, -0.56835);  // TLink3⁻¹
  const T2_inv =
      new THREE.Matrix4().makeTranslation(0, -18.6, -4.36835);  // TLink2⁻¹
  const T1_inv =
      new THREE.Matrix4().makeTranslation(10.88, -8.4, 0.030502);  // TLink1⁻¹

  // === STEP 3: Kalikan mundur
  const M = new THREE.Matrix4().copy(T_ee);
  M.premultiply(T5_inv)
      .premultiply(T4_inv)
      .premultiply(T3_inv)
      .premultiply(T2_inv)
      .premultiply(T1_inv);

  // === STEP 4: Ambil rotasi dari hasil matrix
  const rotOnly = new THREE.Matrix4().extractRotation(M);
  const euler = new THREE.Euler().setFromRotationMatrix(
      rotOnly, 'ZYX');  // pastikan urutannya sesuai

  const theta1 = THREE.MathUtils.radToDeg(euler.y);  // rotasi Y (joint 1)
  const theta2 = THREE.MathUtils.radToDeg(euler.z);  // rotasi Z (joint 2)
  const theta3 = THREE.MathUtils.radToDeg(euler.x);  // rotasi Z (joint 3)
  const theta4 = theta4_deg;                         // langsung dari input

  return {theta1, theta2, theta3, theta4};
}