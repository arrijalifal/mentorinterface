'use client'

import { useGLTF } from "@react-three/drei";
import { JSX } from "react";
import * as THREE from 'three';
import { forwardRef } from "react";


const Gripper = forwardRef<THREE.Object3D, JSX.IntrinsicElements['group']>((props, ref) => {
        const { scene } = useGLTF('/models/gripper.glb');

        return <primitive object={scene} ref={ref} {...props} />;
});

Gripper.displayName = 'Gripper';

export default Gripper;