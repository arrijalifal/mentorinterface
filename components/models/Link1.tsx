'use client'

import { useGLTF } from "@react-three/drei";
import { forwardRef, JSX } from "react";
import * as THREE from 'three';

const Link1 = forwardRef<THREE.Object3D, JSX.IntrinsicElements['group']>((props, ref) => {
    const { scene } = useGLTF('/models/link1.glb');

    return <primitive object={scene} ref={ref} {...props}>
    </primitive>
});

Link1.displayName = 'Link1';

export default Link1;