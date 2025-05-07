import { ReactNode, useState } from "react";
import { Canvas } from "@react-three/fiber"
import RobotArm from "./RobotArm"

const SimulationWindow = (

    {
        joint0,
        joint1,
        joint2,
        joint3,
        children,
        fkJoint,
        fK
    }: {
        joint0: number;
        joint1: number;
        joint2: number;
        joint3: number;
        children?: ReactNode;
        fkJoint?: {
            joint1: number[];
            joint2: number[];
            joint3: number[];
        }
        fK?: {
            x: number,
            y: number,
            z: number
        }
    }) => {
    const [cameraView, setCameraView] = useState<'top' | 'side' | 'front'>('front');
    const [lockView, setLockView] = useState(false);
    return (
        <section className="lg:w-1/2 lg:h-full h-1/2 rounded flex flex-col gap-3">
            <div className="h-1/2">
                <Canvas className='bg-black rounded-xl h-[50vh]'>
                    <RobotArm
                        joint0={joint0}
                        joint1={joint1}
                        joint2={joint2}
                        joint3={joint3}
                        cameraView={cameraView}
                        isViewLocked={lockView}
                    />
                    {
                        (fK) ?
                            // <mesh position={[fkJoint.joint1[0], fkJoint.joint1[1], fkJoint.joint1[2]]}>
                            <mesh position={[fK.x, fK.y, fK.z]}>
                                <sphereGeometry args={[5, 16, 16]} />
                                <meshStandardMaterial color={'blue'} />
                            </mesh> :
                            <></>
                    }
                </Canvas>
            </div>
            <section className='flex flex-col px-2'>
                <div className='flex justify-end items-center gap-3'>
                    <div className={`flex gap-3 ${(lockView) ? 'invisible' : 'visible'}`}>
                        <button className='border border-black rounded px-2 py-1' onClick={() => { setCameraView('top') }}>Top</button>
                        <button className='border border-black rounded px-2 py-1' onClick={() => { setCameraView('side') }}>Side</button>
                        <button className='border border-black rounded px-2 py-1' onClick={() => { setCameraView('front') }}>Front</button>
                    </div>
                    <label htmlFor="lockview" className="px-2 py-1 border border-black rounded cursor-pointer">
                        <input type='checkbox' id='lockview' name='lockview' checked={lockView} onChange={() => setLockView((prev) => !prev)} />
                        <p className="inline-block select-none">
                            &nbsp;Lock View
                        </p>
                    </label>
                </div>
            </section>
            {children}
        </section>
    )
}

export default SimulationWindow