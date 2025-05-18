'use client';

import { useGLTF } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import useStore, { JointPositionProps } from '@/lib/store';

export default function RobotMentor({ joint0, joint1, joint2, joint3, isGradual }: { joint0: number; joint1: number; joint2: number; joint3: number; isGradual?: boolean; }) {
    const [posData, setPosData] = useState<number[][]>([]);
    const glb = useGLTF('/models/robotmentor.glb');
    const { setPositions } = useStore();
    const groupRef = useRef<THREE.Group>(null);

    // Refs untuk setiap joint
    const joint0Ref = useRef<THREE.Object3D>(null);
    const joint1Ref = useRef<THREE.Object3D>(null);
    const joint2Ref = useRef<THREE.Object3D>(null);
    const gripperRef = useRef<THREE.Object3D>(null);

    // State untuk rotasi gradual
    // const [currentJoint0, setCurrentJoint0] = useState(0);
    // const [currentJoint1, setCurrentJoint1] = useState(0);
    // const [currentJoint2, setCurrentJoint2] = useState(0);
    // const [currentJoint3, setCurrentJoint3] = useState(0);

    // const SPEED = 125; // 4 angka per detik
    // const STEP = 1;

    function degToRad(deg: number) {
        return deg * (Math.PI / 180);
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

    // Update gradual untuk setiap joint
    // useEffect(() => {
    //     if (!isGradual) return;
    //     const interval = setInterval(() => {
    //         setCurrentJoint0((prev) => {
    //             if (prev < joint0) return Math.min(prev + 1, joint0);
    //             if (prev > joint0) return Math.max(prev - 1, joint0);
    //             return prev;
    //         });
    //     }, SPEED);

    //     return () => clearInterval(interval);
    // }, [joint0, isGradual]);

    // useEffect(() => {
    //     if (!isGradual) return;
    //     const interval = setInterval(() => {
    //         setCurrentJoint1((prev) => {
    //             if (prev < joint1) return Math.min(prev + 1, joint1);
    //             if (prev > joint1) return Math.max(prev - 1, joint1);
    //             return prev;
    //         });
    //     }, SPEED);

    //     return () => clearInterval(interval);
    // }, [joint1, isGradual]);

    // useEffect(() => {
    //     if (!isGradual) return;
    //     const interval = setInterval(() => {
    //         setCurrentJoint2((prev) => {
    //             if (prev < joint2) return Math.min(prev + 1, joint2);
    //             if (prev > joint2) return Math.max(prev - 1, joint2);
    //             return prev;
    //         });
    //     }, SPEED);

    //     return () => clearInterval(interval);
    // }, [joint2, isGradual]);

    // useEffect(() => {
    //     if (!isGradual) return;
    //     const interval = setInterval(() => {
    //         setCurrentJoint3((prev) => {
    //             if (prev < joint3) return Math.min(prev + 1, joint3);
    //             if (prev > joint3) return Math.max(prev - 1, joint3);
    //             return prev;
    //         });
    //     }, SPEED);

    //     return () => clearInterval(interval);
    // }, [joint3, isGradual]);

    // Apply perubahan rotasi pada objek
    useEffect(() => {
        if (joint0Ref.current) joint0Ref.current.rotation.y = degToRad(currentJoint0);
        if (joint1Ref.current) joint1Ref.current.rotation.z = degToRad(currentJoint1);
        if (joint2Ref.current) joint2Ref.current.rotation.z = degToRad(currentJoint2);
        if (gripperRef.current) gripperRef.current.rotation.z = degToRad(currentJoint3);

        groupRef.current?.updateMatrixWorld(true);

        const posList = [];
        const pos = new THREE.Vector3();

        joint0Ref.current?.getWorldPosition(pos);
        posList.push(pos.toArray());
        joint1Ref.current?.getWorldPosition(pos);
        posList.push(pos.toArray());
        joint2Ref.current?.getWorldPosition(pos);
        posList.push(pos.toArray());
        gripperRef.current?.getWorldPosition(pos);
        posList.push(pos.toArray());

        setPosData(posList);
        setPositions!(posList);

    }, [currentJoint0, currentJoint1, currentJoint2, currentJoint3, setPositions]);

    return (
        <group ref={groupRef}>
            <axesHelper args={[30]} />
            <gridHelper args={[200, 20]} />
        </group>
    );
}
