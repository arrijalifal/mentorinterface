'use client';

import { useGLTF } from '@react-three/drei';
import { useEffect, useRef, /*useState*/ } from 'react';
import * as THREE from 'three';
// import useStore, { JointPositionProps } from '@/lib/store';

export default function RobotMentor({ joint0, joint1, joint2, joint3, joint4 }: { joint0: number; joint1: number; joint2: number; joint3: number, joint4?: number }) {
    // const [posData, setPosData] = useState<number[][]>([]);
    const glb = useGLTF('/models/robotmentor.glb');
    
    // const { setPositions } = useStore();
    const groupRef = useRef<THREE.Group>(null);
    
    const joint0Ref = useRef<THREE.Object3D>(null);
    const joint1Ref = useRef<THREE.Object3D>(null);
    const joint2Ref = useRef<THREE.Object3D>(null);
    const gripperRef = useRef<THREE.Object3D>(null);
    const rollGripper = useRef<THREE.Object3D>(null);
    
    
    
    
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
            if (obj.name === 'base_gripper') rollGripper.current = obj;
        });
        
        if (groupRef.current) {
            groupRef.current.clear();
            groupRef.current.add(clonedScene);
        }
    }, [glb]);
    
    // Optional: rotasi otomatis untuk verifikasi (bisa dihapus nanti)
    useEffect(() => {

        // const posList = [];
        joint0Ref.current!.rotation.y = degToRad(-joint0);
        joint1Ref.current!.rotation.z = degToRad(joint1);
        joint2Ref.current!.rotation.z = degToRad(joint2);
        gripperRef.current!.rotation.z = degToRad(joint3);
        if (joint4) rollGripper.current!.rotation.y = degToRad(joint4);
        // groupRef.current?.updateMatrixWorld(true);

        // const pos = new THREE.Vector3();

        // joint0Ref.current?.getWorldPosition(pos);
        // posList.push(pos.toArray())
        // joint1Ref.current?.getWorldPosition(pos);
        // posList.push(pos.toArray());
        // joint2Ref.current?.getWorldPosition(pos);
        // posList.push(pos.toArray());
        // gripperRef.current?.getWorldPosition(pos);
        // posList.push(pos.toArray());
        // console.log(posList);

        // setPosData(posList);
        // setPositions!(posList);

    }, [joint0, joint1, joint2, joint3/*, setPositions*/]);

    useEffect(() => { 
    });

    return (
        <group ref={groupRef}>
            <axesHelper args={[30]} />
            <gridHelper args={[200, 20]} />
        </group>
    );
}
