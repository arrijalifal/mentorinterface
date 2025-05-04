// pages/index.js
'use client'
import { useState, useEffect } from 'react';
import RobotArm from '@/components/RobotArm';
import { Canvas } from '@react-three/fiber';
import Button from '@/components/Button';
import inverseKinematics from '@/lib/inverseKinematics';
import JointController from '@/components/JointController';
import forwardKinematicsDH from '@/lib/forwardKinematicsDH';

const Home = () => {
    const [joint0, setJoint0] = useState(0);
    const [joint1, setJoint1] = useState(0);
    const [joint2, setJoint2] = useState(0);
    const [joint3, setJoint3] = useState(0);
    // const [joint4, setJoint4] = useState(0);
    const [inversValue, setInversValue] = useState({ x: 0, y: 0, z: 0 });
    const [fK, setFK] = useState({ x: 0, y: 0, z: 0 });

    // --Perhitungan FK tanpa melihat DH Parameter--
    // useEffect(() => {
    //     const getFK = forwardKinematics(joint0, joint1, joint2, joint3);
    //     setFK(getFK);
    // }, [joint0, joint1, joint2, joint3]);

    useEffect(() => {
        const getFK = forwardKinematicsDH([joint0, joint1, joint2, joint3]);
        setFK(getFK);
    }, [joint0, joint1, joint2, joint3]);

    const [mode, setMode] = useState('forward');

    function handleInverseKinematics() {
        const result = inverseKinematics(inversValue.x, inversValue.y, inversValue.z);
        setJoint0(result.joint0);
        setJoint1(result.joint1);
        setJoint2(result.joint2);
        setJoint3(result.joint3);
        // setJoint4(result.joint4);
    }

    return (
        <div className='w-full h-full lg:flex' id='cihuyy'>
            <section className="lg:w-1/2 h-1/2 bg-black rounded">
                <Canvas className=''>
                    <RobotArm joint0={joint0} joint1={joint1} joint2={joint2} joint3={joint3} />
                    {/* Test FK */}
                    <mesh position={[fK.x * 100, fK.y * 100, fK.z * 100]}>
                        <sphereGeometry args={[5, 16, 16]} />
                        <meshStandardMaterial color="blue" />
                    </mesh>
                </Canvas>
                <div className='mt-1 flex justify-around'>
                    <button className='border border-black rounded px-2'>Front</button>
                    <button className='border border-black rounded px-2'>Side</button>
                    <button className='border border-black rounded px-2'>Back</button>
                    <button className='border border-black rounded px-2'>Reset</button>
                    <label htmlFor="orbitview">
                        <input type='checkbox' id='orbitview' name='orbitview' />
                        &nbsp;Free Move
                    </label>
                </div>
            </section>
            <section className='flex flex-col w-full p-4'>
                <h1 className='text-center text-2xl font-semibold'>Manual Control</h1>
                <div className='mt-8 px-12'>
                    <div className="flex gap-3">
                        <Button onClick={() => setMode('forward')} active={(mode === 'forward')}>Forward Kinematics</Button>
                        <Button onClick={() => setMode('inverse')} active={(mode === 'inverse')} >Inverse Kinematics</Button>
                    </div>
                    {
                        (mode === 'forward') ? <div className='mt-12 flex flex-col gap-3'>
                            <JointController
                                jointName='Joint 0'
                                min={-105}
                                max={105}
                                value={joint0}
                                onChange={setJoint0}
                            />
                            <JointController
                                jointName='Joint 1'
                                min={-90}
                                max={90}
                                value={joint1}
                                onChange={setJoint1}
                            />
                            <JointController
                                jointName='Joint 2'
                                min={-115}
                                max={115}
                                value={joint2}
                                onChange={setJoint2}
                            />
                            <JointController
                                jointName='Joint 3'
                                min={-70}
                                max={70}
                                value={joint3}
                                onChange={setJoint3}
                            />
                            {/* <JointController
                                jointName='Joint 4'
                                min={-115}
                                max={115}
                                value={joint4}
                                onChange={setJoint4}
                            /> */}
                            <div>
                                <p>Posisi End Effector</p>
                                <p>x: {fK.x * 100}<br />y: {fK.y * 100}<br />z: {fK.z * 100}</p>
                            </div>
                        </div> : <div className="flex flex-col gap-5">
                            <label htmlFor="x_pos" className='mt-10'>X Position <br />
                                <input
                                    type="text"
                                    className="border w-full"
                                    name="x_pos"
                                    id="x_pos"
                                    value={(inversValue.x)}
                                    onChange={(e) => { setInversValue({ ...inversValue, x: Number(e.target.value) }) }} />
                            </label>
                            <label htmlFor="y_pos">Y Position <br />
                                <input
                                    type="text"
                                    className="border w-full"
                                    name="y_pos"
                                    id="y_pos"
                                    value={(inversValue.y)}
                                    onChange={(e) => { setInversValue({ ...inversValue, y: Number(e.target.value) }) }} />
                            </label>
                            <label htmlFor="z_pos">Z Position <br />
                                <input
                                    type="text"
                                    className="border w-full"
                                    name="z_pos"
                                    id="z_pos"
                                    value={(inversValue.z)}
                                    onChange={(e) => { setInversValue({ ...inversValue, z: Number(e.target.value) }) }} />
                            </label>
                            <div>
                                <button
                                    className='border px-8 py-2 border-gray-400'
                                    onClick={handleInverseKinematics}
                                >Set
                                </button>
                            </div>
                        </div>
                    }
                </div>
            </section>
        </div>
    );
};

export default Home;
