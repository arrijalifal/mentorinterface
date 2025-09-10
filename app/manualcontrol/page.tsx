// pages/index.js
'use client'
import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from '@/components/Scene';
import { forwardKinematics, getPositionFromMatrix } from '@/lib/forwardKinematicsPitchOnly';
import { useWebSocket } from '@/lib/store';
import SliderJoint from '@/components/SliderJoint';
import Button from '@/components/Button';
import sudutAntaraTigaTitik from '@/lib/sudutAntara3Titik';
import titikPotongLingkaran from '@/lib/titikPotongLingkaran';
import { radianttodegree } from '@/lib/degrad';

const Home = () => {
    const [joint0, setJoint0] = useState(0);
    const [joint1, setJoint1] = useState(0);
    const [joint2, setJoint2] = useState(0);
    const [joint3, setJoint3] = useState(0);
    const [joint34, setJoint34] = useState(0);
    const [joint4, setJoint4] = useState(0);
    const [joint5, setJoint5] = useState(0);
    const [socket, setSocket] = useState<WebSocket>();
    // const [inverseValue, setInverseValue] = useState({ x: -42.154, y: 18.6, z: 0.292 });
    const [inverseValue, setInverseValue] = useState({ x: 21, y: 20, z: 20 });
    const { ws } = useWebSocket();
    const [individualMotors, setIndividualMotors] = useState(false);

    const [lockView, setLockView] = useState(false);
    const [mode, setMode] = useState('forward');
    // const [tempXYZ, setTempXYZ] = useState({ x: '-42.154', y: '18.6', z: '0.292' });
    const [tempXYZ, setTempXYZ] = useState({ x: '21', y: '20', z: '20' });

    useEffect(() => {
        if (!ws) return;
        ws.onopen = () => {
            console.log("Terhubung ke WebSocket");
            setSocket(ws);
        };

        ws.onclose = () => {
            console.log("Terputus dari WebSocket");
        }

        ws.onerror = (error) => {
            console.log("Websocket Error: ", error);
        }

        // return () => {
        //     if (ws) ws.close();
        // }
    }, [ws]);

    // Pengiriman data tiap joint melalui endpoint
    useEffect(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(`j ${joint0} ${joint1} ${joint2} ${joint3} ${joint4} ${joint5}`);
        } else {
            console.log("Can't send message to websocket");
        }
        console.log(inverseValue)
    }, [joint0, joint1, joint2, joint3, joint4, joint5, socket, ws, inverseValue]);

    return (
        <div className='w-full h-full flex' id='manualcontrolpage'>
            {/* Panel Tampilan Simulasi */}
            <section className='w-1/2' id='threedsection'>
                {/* Tampilan Simulasi 3 Dimensi */}
                <section className='w-full h-1/2 overflow-y-auto relative'>
                    <Canvas camera={{ position: [-50, 50, 50] }}>
                        <Scene th1={joint0} th2={joint1} th3={joint2} th4={joint3} point={inverseValue} isInverse={(mode === 'inverse')} />
                    </Canvas>
                    <section className='w-full flex justify-end items-center gap-3 absolute bottom-0'>
                        {/* <div className={`flex gap-3 ${(lockView) ? 'invisible' : 'visible'}`}>
                            <button className='border border-black rounded px-2 py-1' onClick={() => { }}>Top</button>
                            <button className='border border-black rounded px-2 py-1' onClick={() => { }}>Side</button>
                            <button className='border border-black rounded px-2 py-1' onClick={() => { }}>Front</button>
                        </div> */}
                        {/* <label htmlFor="lockview" className="px-2 py-1 border border-black rounded cursor-pointer">
                            <input type='checkbox' id='lockview' name='lockview' checked={lockView} onChange={() => setLockView((prev) => !prev)} />
                            <p className="inline-block select-none">
                                &nbsp;Lock View
                            </p>
                        </label> */}
                    </section>
                </section>
                {/* Pengaturan Kamera Simulasi 3 Dimensi */}
                <section className="w-full h-1/2 overflow-y-auto">
                    {/* Kosong */}
                </section>
            </section>
            {/* Panel Kontrol Joint */}
            <section className='w-1/2 p-5' id='controlsection'>
                <h1 className='text-center text-2xl font-semibold'>Manual Control</h1>
                <div id='movementselection' className='flex gap-3'>
                    <Button onClick={() => setMode('forward')} active={(mode === 'forward')}>Forward Kinematics</Button>
                    <Button onClick={() => setMode('inverse')} active={(mode === 'inverse')} >Inverse Kinematics</Button>
                </div>
                <div id='sliderandpointcontrol' className='mt-10'>
                    <button
                        className='border border-black rounded px-2 py-1'
                        onClick={() => {
                            setJoint0(0);
                            setJoint1(0);
                            setJoint2(0);
                            setJoint3(0);
                            setJoint34(0);
                            setJoint4(0);
                            setJoint5(0);
                        }}
                    >
                        Reset All Joints</button>
                    {
                        (mode === 'forward') ?
                            <div id='sliders' className='flex flex-col gap-3'>
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
                                    min={-150}
                                    max={180}
                                    value={joint1}
                                    onChange={setJoint1}
                                    onReset={() => { setJoint1(0) }}
                                />
                                <SliderJoint
                                    jointName='Joint 2'
                                    min={-150}
                                    max={150}
                                    value={joint2}
                                    onChange={setJoint2}
                                    onReset={() => { setJoint2(0) }}
                                />
                                <label htmlFor="individual" className='w-fit'>
                                    <input
                                        type="checkbox"
                                        name="individual"
                                        id="individual"
                                        checked={individualMotors}
                                        onChange={() => setIndividualMotors((prev) => !prev)}
                                    />
                                    <p className='inline ml-2 select-none'>Individual Motors</p>
                                </label>
                                {
                                    (individualMotors) ?
                                        <>
                                            <SliderJoint
                                                jointName='Joint 3'
                                                min={-180}
                                                max={180}
                                                value={joint3}
                                                onChange={setJoint3}
                                                onReset={() => {
                                                    setJoint3(0);
                                                }}
                                            />
                                            <SliderJoint
                                                jointName='Joint 4'
                                                min={-180}
                                                max={180}
                                                value={joint4}
                                                onChange={setJoint4}
                                                onReset={() => {
                                                    setJoint4(0);
                                                }}
                                            />
                                        </>
                                        :
                                        <SliderJoint
                                            jointName='Pitch'
                                            min={-180}
                                            max={180}
                                            value={joint34}
                                            onChange={(val) => {
                                                setJoint34(val);
                                                setJoint3(val);
                                                setJoint4(val);
                                            }}
                                            onReset={() => {
                                                setJoint3(0);
                                                setJoint34(0);
                                                setJoint4(0);
                                            }}
                                        />
                                }
                                <SliderJoint
                                    jointName='Gripper'
                                    min={-180}
                                    max={180}
                                    value={joint5}
                                    onChange={setJoint5}
                                    onReset={() => {
                                        setJoint5(0);
                                    }}
                                />
                            </div>
                            :
                            <div id='points' className="flex flex-col gap-5">
                                <label htmlFor="x_pos">X Position <br />
                                    <input
                                        type="text"
                                        className="border w-full"
                                        name="x_pos"
                                        id="x_pos"
                                        value={tempXYZ.x}
                                        onChange={(e) => { setTempXYZ({ ...tempXYZ, x: e.target.value }) }} />
                                </label>
                                <label htmlFor="y_pos">Y Position <br />
                                    <input
                                        type="text"
                                        className="border w-full"
                                        name="y_pos"
                                        id="y_pos"
                                        value={(tempXYZ.y)}
                                        onChange={(e) => { setTempXYZ({ ...tempXYZ, y: e.target.value }) }} />
                                </label>
                                <label htmlFor="z_pos">Z Position <br />
                                    <input
                                        type="text"
                                        className="border w-full"
                                        name="z_pos"
                                        id="z_pos"
                                        value={(tempXYZ.z)}
                                        onChange={(e) => { setTempXYZ({ ...tempXYZ, z: e.target.value }) }} />
                                </label>
                                <div>
                                    <button
                                        className='border px-8 py-2 border-gray-400'
                                        onClick={() => {
                                            if (isNaN(Number(tempXYZ.x)) || isNaN(Number(tempXYZ.y)) || isNaN(Number(tempXYZ.z))) {
                                                alert("Input must be a number!");
                                            } else {
                                                setInverseValue({ x: Number(tempXYZ.x), y: Number(tempXYZ.y), z: Number(tempXYZ.z) });
                                                // const { x, y, z } = inverseValue;
                                                // const atan2 = Math.atan2(z, x); // Perhitungan rotasi untuk joint 1
                                                // const D = -Math.sqrt((x) ** 2 + z ** 2);
                                                // const rotasiY = 180 - radianttodegree(atan2);
                                                // const L1 = 18.6;
                                                // const L2 = 17.398;
                                                // const L3 = 15.1391;
                                                // const L4 = 10.6172;
                                                // const tipot = titikPotongLingkaran(xa, ya, L3, x, y, L4);
                                                // const xyHigh = (!tipot) ? null : tipot.reduce((prev, curr) => (curr[1] > prev[1]) ? curr : prev);
                                                // const sudut3 = sudutAntaraTigaTitik(xa, ya, 0, L1, xyHigh[0], xyHigh[1]);
                                                // const sudut2 = sudutAntaraTigaTitik(0, L1, 0, 0, xa, ya);
                                            }
                                        }}
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
