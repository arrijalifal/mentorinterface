'use client'

import { useGLTF } from "@react-three/drei";
import { forwardRef, JSX } from "react";
import * as THREE from 'three';

// export default function Link3({ ...props }) {
//     const { scene } = useGLTF('/models/link3.glb');

//     return <primitive object={scene} {...props}>
//     </primitive>
// }

const Link3 = forwardRef<THREE.Object3D, JSX.IntrinsicElements['group']>((props, ref) => {
    const { scene } = useGLTF('/models/link3.glb');

    return <primitive object={scene} ref={ref} {...props} />
});

Link3.displayName = 'Link3';

export default Link3;