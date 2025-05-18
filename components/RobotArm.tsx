// components/RobotArm.tsx
'use client'

import { useThree } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { ReactNode, useEffect } from 'react';
import dynamic from 'next/dynamic';

const RobotModel = dynamic(() => import('./RobotMentor.tsx'), { ssr: false });

const RobotArm = (
    {
        joint0,
        joint1,
        joint2,
        joint3,
        cameraView,
        isViewLocked,
        children
    }: {
        joint0: number;
        joint1: number;
        joint2: number;
        joint3: number;
        cameraView?: 'top' | 'side' | 'front' | 'reset';
        isViewLocked?: boolean;
        isGradual?: boolean;
        children?: ReactNode
    }) => {
    const { camera } = useThree();

    useEffect(() => {
        let x, y, z;
        switch (cameraView) {
            case 'top':
                x = 0;
                y = 90;
                z = 0;
                break;
            case 'side':
                x = 90;
                y = 10;
                z = 0;
                break;
            case 'front':
                x = 0;
                y = 10;
                z = 90;
                break;
            default:
                x = 30;
                y = 20;
                z = 90;
        }
        // reset
        // camera.position.set(30, 20, 90);
        // front
        // camera.position.set(0, 10, 90);
        // side
        // camera.position.set(90, 10, 0);
        // top
        // camera.position.set(0, 90, 0);
        camera.position.set(x, y, z);
    }, [cameraView, camera.position]);

    return (
        <>
            <axesHelper args={[30]} />
            <Environment preset='studio' />
            <RobotModel joint0={joint0} joint1={joint1} joint2={joint2} joint3={joint3}/>
            {
                (!isViewLocked) ? <OrbitControls target={[0, 15, 0]} /> : <></>
            }
            {children}
        </>
    );
};

export default RobotArm;
