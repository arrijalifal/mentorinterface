import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default function ThreeScene({ x, y, z }: { x: number, y: number, z: number }) {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const [currentRotation, setCurrentRotation] = useState({ x: 0, y: 0, z: 0 });

    useEffect(() => {
        // Inisialisasi scene, camera, dan renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });

        // Tambahkan renderer ke div
        mountRef.current?.appendChild(renderer.domElement);

        // Membuat grup untuk robot
        const robotGroup = new THREE.Group();

        // Membuat kubus sebagai lengan
        const geometry = new THREE.BoxGeometry(0.2, 1, 0.2);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

        // Lengan pertama
        const arm1 = new THREE.Mesh(geometry, material);
        arm1.position.set(0, 0.5, 0); // Posisi lengan pertama
        robotGroup.add(arm1);

        // Lengan kedua
        const arm2 = new THREE.Mesh(geometry, material);
        arm2.position.set(0.5, 0.5, 0); // Posisi lengan kedua
        robotGroup.add(arm2);

        // Lengan ketiga
        const arm3 = new THREE.Mesh(geometry, material);
        arm3.position.set(-0.5, 0.5, 0); // Posisi lengan ketiga
        robotGroup.add(arm3);

        // Menambahkan grup robot ke scene
        scene.add(robotGroup);

        camera.position.set(3, 3, 4);

        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        camera.aspect = (window.innerWidth / 3) / (window.innerHeight / 2);
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth / 3, window.innerHeight / 2);

        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth / 3, window.innerHeight / 2);
        });

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // Loop rendering
        const animate = function () {
            controls.update();

            // Interpolasi rotasi
            setCurrentRotation(prev => {
                const newRotation = {
                    x: x,
                    y: y,
                    z: z,
                };
                robotGroup.rotation.set(newRotation.x, newRotation.y, newRotation.z);
                return newRotation;
            });

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
            mountRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, [x, y, z]);

    return <div ref={mountRef} />;
}
