// components/RobotArm.tsx
'use client'

import { useThree, Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { ReactNode, useEffect } from 'react';
import dynamic from 'next/dynamic';

const RobotModel = dynamic(() => import('./RobotMentor'), { ssr: false });

const RobotArm = ({ joint0, joint1, joint2, joint3, children }: { joint0: number; joint1: number; joint2: number; joint3: number; children?: ReactNode }) => {
    const { camera } = useThree();
    // const camera  = useThree((state) => state.camera);

    useEffect(() => {
        camera.position.set(0, 10, 70);
    }, []);

    return (
        <>
            <axesHelper args={[30]} />
            <Environment preset='studio' />
            <RobotModel joint0={joint0} joint1={joint1} joint2={joint2} joint3={joint3} />
            <OrbitControls target={[0, 15, 0]} />
            {/* Test FK */}
            {children}
        </>
    );
};

export default RobotArm;
