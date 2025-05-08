// pages/index.js
'use client'
import { useState, useEffect } from 'react';
import RobotArm from '@/components/RobotArm';
import { Canvas } from '@react-three/fiber';
import Button from '@/components/Button';
import inverseKinematics from '@/lib/inverseKinematics';
import SliderJoint from '@/components/SliderJoint';
import forwardKinematicsDH from '@/lib/forwardKinematicsDH';
import SimulationWindow from '@/components/SimulationWindow';

const Home = () => {
    const [joint0, setJoint0] = useState(0);
    const [joint1, setJoint1] = useState(0);
    const [joint2, setJoint2] = useState(0);
    const [joint3, setJoint3] = useState(0);
    // const [joint4, setJoint4] = useState(0);
    const [inversValue, setInversValue] = useState({ x: 0, y: 0, z: 0 });
    const [fK, setFK] = useState({ x: 0, y: 0, z: 0 });

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
        <div className='w-full h-full lg:flex lg:flex-row flex flex-col overflow-hidden' id='cihuyy'>
            <SimulationWindow
                joint0={joint0}
                joint1={joint1}
                joint2={joint2}
                joint3={joint3}
            >
                <div></div>
            </SimulationWindow>
            <section className='flex-1 flex flex-col w-full p-4 mt-5'>
                <h1 className='text-center text-2xl font-semibold'>Manual Control</h1>
                <div className='mt-8 px-12'>
                    <div className="flex gap-3">
                        <Button onClick={() => setMode('forward')} active={(mode === 'forward')}>Forward Kinematics</Button>
                        <Button onClick={() => setMode('inverse')} active={(mode === 'inverse')} >Inverse Kinematics</Button>
                    </div>
                    {
                        (mode === 'forward') ?
                            <div className='mt-12 flex flex-col gap-3'>
                                <div>
                                    <button
                                        className='border border-black rounded px-2 py-1'
                                        onClick={() => {
                                            setJoint0(0);
                                            setJoint1(0);
                                            setJoint2(0);
                                            setJoint3(0);
                                        }}
                                    >
                                        Reset All Joints</button>
                                </div>
                                <SliderJoint
                                    jointName='Joint 0'
                                    min={-105}
                                    max={105}
                                    value={joint0}
                                    onChange={setJoint0}
                                    onReset={() => { setJoint0(0) }}
                                />
                                <SliderJoint
                                    jointName='Joint 1'
                                    min={-90}
                                    max={90}
                                    value={joint1}
                                    onChange={setJoint1}
                                    onReset={() => { setJoint1(0) }}
                                />
                                <SliderJoint
                                    jointName='Joint 2'
                                    min={-115}
                                    max={115}
                                    value={joint2}
                                    onChange={setJoint2}
                                    onReset={() => { setJoint2(0) }}
                                />
                                <SliderJoint
                                    jointName='Joint 3'
                                    min={-70}
                                    max={70}
                                    value={joint3}
                                    onChange={setJoint3}
                                    onReset={() => { setJoint3(0) }}
                                />
                                <div>
                                    <p>Posisi End Effector</p>
                                    <p>x: {fK.x * 100}<br />y: {fK.y * 100}<br />z: {fK.z * 100}</p>
                                </div>
                            </div> :
                            <div className="flex flex-col gap-5">
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
