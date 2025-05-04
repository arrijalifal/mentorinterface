'use client';

import { useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function RobotMentor({ joint0, joint1, joint2, joint3}: { joint0: number; joint1: number; joint2: number; joint3: number}) {
    const glb = useGLTF('/models/robotmentor.glb');
    const groupRef = useRef<THREE.Group>(null);

    const joint0Ref = useRef<THREE.Object3D>(null);
    const joint1Ref = useRef<THREE.Object3D>(null);
    const joint2Ref = useRef<THREE.Object3D>(null);
    const gripperRef = useRef<THREE.Object3D>(null);

    function degToRad(deg: number) {
        return deg * (Math.PI / 180);
    }

    function dhMatrix(theta: number, d: number, a: number, alpha: number): THREE.Matrix4 {
        const ct = Math.cos(theta);
        const st = Math.sin(theta);
        const ca = Math.cos(alpha);
        const sa = Math.sin(alpha);

        const mat = new THREE.Matrix4();
        mat.set(
            ct, -st * ca, st * sa, a * ct,
            st, ct * ca, -ct * sa, a * st,
            0, sa, ca, d,
            0, 0, 0, 1
        );
        return mat;
    }

    useEffect(() => {
        const clonedScene = glb.scene.clone(true);
        clonedScene.traverse((obj) => {
            if (obj.name) console.log('✅', obj.name);
            if (obj.name === 'arm_0') joint0Ref.current = obj;
            if (obj.name === 'joint_0') joint1Ref.current = obj;
            if (obj.name === 'joint_1') joint2Ref.current = obj;
            if (obj.name === 'gripper_joint') gripperRef.current = obj;
        });

        if (groupRef.current) {
            groupRef.current.clear();
            groupRef.current.add(clonedScene);
        }
    }, [glb]);

    // Optional: rotasi otomatis untuk verifikasi (bisa dihapus nanti)
    useEffect(() => {
        joint0Ref.current!.rotation.y = degToRad(joint0);
        joint1Ref.current!.rotation.z = degToRad(joint1);
        joint2Ref.current!.rotation.z = degToRad(joint2);
        gripperRef.current!.rotation.z = degToRad(joint3);
    }, [joint0, joint1, joint2, joint3]);

    return (
        <group ref={groupRef}>
            <axesHelper args={[30]} />
            <gridHelper args={[200, 20]} />
        </group>
    );
}
