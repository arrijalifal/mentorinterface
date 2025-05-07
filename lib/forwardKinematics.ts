export default function FK(l1: number, l2: number, l3: number, beta: number, theta1: number, theta2: number, gripper_pitch: number): { joint1: number[], joint2: number[], joint3: number[]} {
  // let g_x1, g_x2, g_x3, g_y1, g_y2, g_y3, g_z1, g_z2, g_z3;
  const g_x1 = l1 * Math.cos(theta1) * Math.cos(beta);
  const g_y1 = l1 * Math.cos(theta1) * Math.sin(beta);
  const g_z1 = l1 * Math.sin(theta1);

  const g_z2 = g_z1 + l2 * Math.sin(theta1 + theta2);
  const g_x2 = g_x1 + l2 * Math.cos(theta1 + theta2) * Math.cos(beta);
  const g_y2 = g_y1 + l2 * Math.cos(theta1 + theta2) * Math.sin(beta);

  const g_x3 = g_x2 + l3 * Math.cos(theta1 + theta2 + gripper_pitch) * Math.cos(beta);
  const g_y3 = g_y2 + l3 * Math.cos(theta1 + theta2 + gripper_pitch) * Math.sin(beta);
  const g_z3 = g_z2 + l3 * Math.sin(theta1 + theta2 + gripper_pitch);
  // console.log('FK on Joint1 ' + g_x1 + ' ' + g_y1 + ' ' + g_z1);
  // console.log('FK on Joint2 ' + g_x2 + ' ' + g_y2 + ' ' + g_z2);
  // console.log('FK on Joint3 ' + g_x3 + ' ' + g_y3 + ' ' + g_z3);
  return {
    joint1: [g_x1, g_y1, g_z1],
    joint2: [g_x2, g_y2, g_z2],
    joint3: [g_x3, g_y3, g_z3],
  }
}