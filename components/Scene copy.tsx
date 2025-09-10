'use client'

import { Base, Gripper, Link1, Link2, Link3 } from "@/components";
import titikPotongLingkaran from "@/lib/titikPotongLingkaran";
import { Environment, Grid, OrbitControls, Text, Text3D } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
// import inverseKinematicsWithGripper from "@/lib/inverseKinematics";
import * as THREE from 'three';
import sudutAntaraTigaTitik from "@/lib/sudutAntara3Titik";
import { degreetoradiant, radianttodegree } from "@/lib/degrad";
// import { inverseKinematicsRobot } from "@/lib/IKRobot";
// import { inverseKinematicsFromMatrix } from "@/lib/inverseKinematics";

export default function Scene({ th1, th2, th3, th4, point, isInverse }: { th1: number; th2: number; th3: number; th4: number; point: { x: number, y: number, z: number }; isInverse: boolean | false }) {
    // Degree interpolation
    function printMatrix(label: string, m: THREE.Matrix4) {
        const e = m.elements;
        return console.log(`${label} = [
            [${e[0].toFixed(3)}, ${e[4].toFixed(3)}, ${e[8].toFixed(3)}, ${e[12].toFixed(3)}],
            [${e[1].toFixed(3)}, ${e[5].toFixed(3)}, ${e[9].toFixed(3)}, ${e[13].toFixed(3)}],
            [${e[2].toFixed(3)}, ${e[6].toFixed(3)}, ${e[10].toFixed(3)}, ${e[14].toFixed(3)}],
            [${e[3].toFixed(3)}, ${e[7].toFixed(3)}, ${e[11].toFixed(3)}, ${e[15].toFixed(3)}]
            ]`
        );
    }

    const baseRef = useRef<THREE.Object3D>(null);
    const link3Ref = useRef<THREE.Object3D>(null);
    const link2Ref = useRef<THREE.Object3D>(null);
    const link1Ref = useRef<THREE.Object3D>(null);
    const gripperRef = useRef<THREE.Object3D>(null);
    const fw = useRef<THREE.Object3D>(null);
    const tujuan = useRef<THREE.Object3D>(null); // Point tujuan ditinjau dari (x, y, 0)
    // const targetP = useRef<THREE.Object3D>(null) // Point tujuan ditinjau dari jarak end-effector ke joint terakhir

    // ATUR XYZ -> BEGIN INVERSE KINEMATICS

    // const x = (20);
    // const y = 25;
    // const z = (25);
    
    const L1 = 18.6;
    const L2 = 17.398;
    const L3 = 15.1391;
    const L4 = 10.6172;
    // PERHITUNGAN LAMA
    // const D = (x ** 2 + z ** 2 - (L1 ** 2) - (L2 ** 2)) / (2 * L1 * L2);
    // const tt2 = Math.acos(D)
    // const rotasi_t2 = THREE.MathUtils.radToDeg(tt2);
    // const tt1 = atan2 - Math.atan2(L2 * Math.sin(tt2), L1 + L2 * Math.cos(tt2));
    // const rotasi_t1 = 360 - THREE.MathUtils.radToDeg(tt1);


    // // PERHITUNGAN BARU
    const { x, y, z } = point;
    // const atan2 = Math.atan2(z, x); // Perhitungan rotasi untuk joint 1
    // // const D = -Math.sqrt((x) ** 2 + z ** 2);
    // const rotasiY = 180 - THREE.MathUtils.radToDeg(atan2);
    // const D = Math.sqrt((x) ** 2 + z ** 2);
    // // const xa = L3 + L4 * Math.cos((180 - th4) * Math.PI / 180);
    // // const ya = L4 * Math.sin((180 - th4) * Math.PI / 180);
    // const la = Math.sqrt((L3 ** 2) + (L4 ** 2) - 2 * L3 * L4 * Math.cos(degreetoradiant(th4)));
    // // const tipot = titikPotongLingkaran(0, L1, L2, D, y, la)?.reduce((prev, curr) => ((curr[1] > prev[1]) ? curr : prev));
    // // const tipot = titikPotongLingkaran(xa, ya, L3, x, y, L4);
    // // const tipot3 = titikPotongLingkaran(xa, ya, L3, xTarget, y, L4)?.reduce((prev, curr) => (curr[1] > prev[1]) ? curr : prev);
    // // const sudutxaya = sudutAntaraTigaTitik(xa, ya, tipot3[0], tipot3[1], x, y);
    // // const tipot2 = titikPotongLingkaran(0, L1, L2, xTarget, y, la)?.reduce((prev, curr) => (curr[1] > prev[1]) ? curr : prev);
    // // const suduttipot2 = sudutAntaraTigaTitik(tipot2[0], tipot2[1], 0, L1, xTarget, y);
    // // const sudut2 = (sudutxaya + suduttipot2);
    // // // const sudut1 = Math.acos((tipot2[1] - L1) / (Math.sqrt((tipot2[0] - 0) ** 2 + (tipot2[1] - L1) ** 2)))
    // // const sudut1 = Math.atan2(tipot2[0] - 0, tipot2[1] - L1);

    // Punya Moses
    const ox = 0;
    const oy = 1;
    const oz = 0;
    const tt1 = Math.atan2(z, x)

    const theta234 = Math.atan2(
        Math.cos(tt1) * ox + Math.sin(tt1) * oy,
        oz
    )

    const b1 = Math.cos(tt1) * x + Math.sin(tt1) * z - L4 * Math.cos(theta234)
    const b2 = -y + L1 - L4 * Math.sin(theta234)

    const numTheta3 = b1 ** 2 + b2 ** 2 - L2 ** 2 - L3 ** 2
    const denTheta3 = 2 * L2 * L3
    const acosArg = THREE.MathUtils.clamp(numTheta3 / denTheta3, -1, 1)
    const tt3 = Math.acos(acosArg)

    const atanNum = b2 * (L3 * Math.cos(tt3) + L2) - b1 * L3 * Math.sin(tt3)
    const atanDen = b1 * (L3 * Math.cos(tt3) + L2) + b2 * L3 * Math.sin(tt3)
    const tt2 = Math.atan2(atanNum, atanDen)

    const tt4 = theta234 - tt2 - tt3;



    const thetas = {
        theta1: -(180-radianttodegree(tt1)),
        theta2: -(radianttodegree(tt2)),
        theta3: -radianttodegree(tt3),
        theta4: -(radianttodegree(tt4))
    }
    const theta1 = (isInverse) ? thetas.theta1 : th1;
    const theta2 = (isInverse) ? thetas.theta2 : th2;
    const theta3 = (isInverse) ? thetas.theta3 : th3;
    const theta4 = (isInverse) ? thetas.theta4 : th4;

    // Ref untuk interpolasi semua theta
    const currentTheta1 = useRef(theta1);
    const currentTheta2 = useRef(theta2);
    const currentTheta3 = useRef(theta3);
    const currentTheta4 = useRef(theta4);

    useEffect(() => {
        const { x, y, z } = point;
        const atan2 = Math.atan2(z, x); // Perhitungan rotasi untuk joint 1
        // const D = -Math.sqrt((x) ** 2 + z ** 2);
        // const rotasiY = 180 - THREE.MathUtils.radToDeg(atan2);
        const D = Math.sqrt((x) ** 2 + z ** 2);
        // const xa = L3 + L4 * Math.cos((180 - th4) * Math.PI / 180);
        // const ya = L4 * Math.sin((180 - th4) * Math.PI / 180);
        const la = Math.sqrt((L3 ** 2) + (L4 ** 2) - 2 * L3 * L4 * Math.cos(degreetoradiant(th4)));
        const tipot = titikPotongLingkaran(0, L1, L2, D, y, la)?.reduce((prev, curr) => ((curr[1] > prev[1]) ? curr : prev));
        console.log("data=", tt1)
    }, [point, tt1, th4]);

    useFrame(() => {
        if (
            !baseRef.current ||
            !link1Ref.current ||
            !link2Ref.current ||
            !link3Ref.current ||
            !gripperRef.current ||
            !fw.current /*|| 
            !targetP.current*/
        ) return;

        // Interpolasi semua theta
        currentTheta1.current = THREE.MathUtils.lerp(currentTheta1.current, theta1, 0.1);
        currentTheta2.current = THREE.MathUtils.lerp(currentTheta2.current, theta2, 0.1);
        currentTheta3.current = THREE.MathUtils.lerp(currentTheta3.current, theta3, 0.1);
        currentTheta4.current = THREE.MathUtils.lerp(currentTheta4.current, theta4, 0.1);

        // Konversi ke radian
        const t1 = THREE.MathUtils.degToRad(currentTheta1.current);
        const t2 = THREE.MathUtils.degToRad(currentTheta2.current);
        const t3 = THREE.MathUtils.degToRad(currentTheta3.current);
        const t4 = THREE.MathUtils.degToRad(currentTheta4.current);

        // Matrix dasar dan translasi tiap link
        const identity = new THREE.Matrix4().identity();
        const TBase = new THREE.Matrix4().makeTranslation(10.88, -8.4, 0.030502);
        const MBase = new THREE.Matrix4().multiplyMatrices(identity, TBase);

        const TLink1 = new THREE.Matrix4().makeTranslation(-10.88, 8.4, -0.030502);
        // const TLink1 = identity;
        const RLink1 = new THREE.Matrix4().makeRotationY(-t1);
        // const MLink1 = new THREE.Matrix4().multiplyMatrices(identity, RLink1);
        const MLink1 = new THREE.Matrix4().multiplyMatrices(identity, TLink1).multiply(RLink1);

        const TLink2 = new THREE.Matrix4().makeTranslation(0, 18.6, 4.36835);
        const RLink2 = new THREE.Matrix4().makeRotationZ(-t2);
        const MLink2 = new THREE.Matrix4().multiplyMatrices(MLink1, TLink2).multiply(RLink2);

        const TLink3 = new THREE.Matrix4().makeTranslation(-17.398, 0, 0.56835);
        const RLink3 = new THREE.Matrix4().makeRotationZ(-t3);
        const MLink3 = new THREE.Matrix4().multiplyMatrices(MLink2, TLink3).multiply(RLink3);

        const TGripper = new THREE.Matrix4().makeTranslation(-15.1391, 0, -4.64517);
        const RGripper = new THREE.Matrix4().makeRotationZ(-t4);
        const MGripper = new THREE.Matrix4().multiplyMatrices(MLink3, TGripper).multiply(RGripper);

        const TEffector = new THREE.Matrix4().makeTranslation(-10.6172, 0, 0);
        const MEffector = new THREE.Matrix4().multiplyMatrices(MGripper, TEffector);
        
        
        // printMatrix('End Effector', MEffector);
        
        
        
        // Terapkan ke objek
        baseRef.current.matrixAutoUpdate = false;
        link1Ref.current.matrixAutoUpdate = false;
        link2Ref.current.matrixAutoUpdate = false;
        link3Ref.current.matrixAutoUpdate = false;
        gripperRef.current.matrixAutoUpdate = false;
        fw.current.matrixAutoUpdate = false;
        // targetP.current.matrixAutoUpdate = false;
        
        // baseRef.current.matrix.copy(MBase);
        baseRef.current.matrix.copy(identity);
        link1Ref.current.matrix.copy(MLink1);
        link2Ref.current.matrix.copy(MLink2);
        link3Ref.current.matrix.copy(MLink3);
        gripperRef.current.matrix.copy(MGripper);
        fw.current.matrix.copy(MEffector);
        const pos = new THREE.Vector3();
        fw.current.getWorldPosition(pos);

        const o = new THREE.Vector3();
        o.setFromMatrixColumn(fw.current.matrixWorld, 2);

        // console.log('Posisi:', pos);
        // console.log('Orientasi sumbu Z:', o);

        // Buat visualisasi posisi target di bidang Z=0
        // const TendEffectorZ0 = new THREE.Matrix4().makeTranslation(xTarget, y, 0);
        // const TendZ0Rot = new THREE.Matrix4().makeRotationZ(THREE.MathUtils.degToRad(-(180 - theta4)));
        // const MTarget = new THREE.Matrix4().multiplyMatrices(baseIdentity, TendEffectorZ0).multiply(TendZ0Rot);
        // const posisiTempEndEffector = new THREE.Matrix4().multiplyMatrices(MTarget, TEffector);

        // targetP.current.matrix.copy(posisiTempEndEffector);
    });


    return <>
        <Environment preset="city" />
        <OrbitControls />
        {/* <axesHelper args={[100]} /> */}
        <Grid args={[100, 100]} />

        <Base ref={baseRef} />
        <Link1 ref={link1Ref} />
        <Link2 ref={link2Ref} />
        <Link3 ref={link3Ref} />
        <Gripper ref={gripperRef} />

        {/* End-effector pada ujung robot */}
        <mesh ref={fw}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshBasicMaterial color={'blue'} />
        </mesh>

        {/* DEBUG Perhitungan */}
        {/* Target tujuan end-effector */}
        {/* <mesh position={[x, y, z]}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshBasicMaterial color={'green'} />
            <Text3D position={[0, 0, 2.5]} size={1} font={'./helvetiker_regular.typeface.json'}>
                ASLI<meshStandardMaterial color="black" />
            </Text3D>
        </mesh> */}
        {/* <mesh position={[D, y, 0]} ref={tujuan}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshBasicMaterial color={'yellow'} />
            <Text3D position={[0, 0, 2.5]} size={1} font={'./helvetiker_regular.typeface.json'}>
                Lokasi Tujuan<meshStandardMaterial color="black" />
            </Text3D>
        </mesh> */}

        {/* <mesh ref={targetP}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshBasicMaterial color={'red'} />
        </mesh> */}
    </>
}