'use client'

import { useGLTF } from "@react-three/drei";
import { forwardRef, JSX } from "react";
import * as THREE from 'three';

const Base = forwardRef<THREE.Object3D, JSX.IntrinsicElements['group']>((props, ref) => {
    const { scene } = useGLTF('/models/base.glb');

    return <primitive object={scene} ref={ref} {...props}>
    </primitive>
});

Base.displayName = 'Base';

export default Base;