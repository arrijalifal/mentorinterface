// pages/index.js
'use client'
import { useState, useEffect, useMemo } from 'react';
import Button from '@/components/Button';
import inverseKinematics from '@/lib/inverseKinematics';
import SliderJoint from '@/components/SliderJoint';
import SimulationWindow from '@/components/SimulationWindow';
import { forwardKinematics, getPositionFromMatrix } from '@/lib/forwardKinematicsPitchOnly';
import axios from 'axios';
import useStore, { useWebSocket } from '@/lib/store';

const Home = () => {
    const [joint0, setJoint0] = useState(0);
    const [joint1, setJoint1] = useState(0);
    const [joint2, setJoint2] = useState(0);
    const [joint3, setJoint3] = useState(0);
    const [joint4, setJoint4] = useState(0);
    const [joint5, setJoint5] = useState(0);
    const [roll, setRoll] = useState(0);
    const [pitch, setPitch] = useState(0)
    const [gripperOrientation, setGripperOrientation] = useState(false);
    const [socket, setSocket] = useState<WebSocket>();
    // const [joint4, setJoint4] = useState(0);
    const [inversValue, setInversValue] = useState({ x: 0, y: 0, z: 0 });
    const [fK, setFK] = useState({ x: 0, y: 0, z: 0 });
    const { ws, setWS, setIsConnected } = useWebSocket();

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

        return () => {
            if (ws) ws.close();
        }
    }, [ws]);

    // Pengiriman data tiap joint melalui endpoint
    useEffect(() => {
        const T = forwardKinematics(joint0, joint1, joint2, joint3);
        const pos = getPositionFromMatrix(T);
        // console.log(pos);
        // sendData();
        setFK(pos);
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(`j ${joint0} ${joint1} ${joint2} ${joint3} ${joint4} ${joint5}`);
        } else {
            console.log("Can't send message to websocket");
        }
    }, [joint0, joint1, joint2, joint3, joint4, joint5, socket, ws]);

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
                                            setJoint4(0);
                                            setJoint5(0);
                                            setRoll(0);
                                            setPitch(0);
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
                                    max={100}
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
                                <button
                                    className={`border border-black rounded w-fit buttonstyle`}
                                    onClick={() => setGripperOrientation((p) => !p)}
                                >
                                    {(gripperOrientation) ? 'Individual Joint' : 'Orientation'}
                                </button>
                                {
                                    (gripperOrientation) ?
                                        <div>
                                            <label>
                                                Roll :
                                                <input
                                                    type="text"
                                                    name="" id=""
                                                    className="w-10 text-right"
                                                    value={roll}
                                                    onChange={(e) => {
                                                        const prevValue = roll;
                                                        if (e.target.value === "") setRoll(0);
                                                        else if (Number.isNaN(parseInt(e.target.value))) {
                                                            alert("INPUT MUST BE A NUMBER!");
                                                            setRoll(prevValue);
                                                        }
                                                        else setRoll(parseInt(e.target.value));
                                                    }}
                                                />°
                                                <button hidden={(roll === 0)} className="ml-3" onClick={() => {
                                                    setRoll(0);
                                                    setJoint3(0);
                                                    setJoint4(0);
                                                }}
                                                >↻
                                                </button>
                                                <br />
                                                <input
                                                    type="range"
                                                    min={-100}
                                                    max={100}
                                                    // step="0.01"
                                                    value={roll}
                                                    className='w-full'
                                                    onChange={(e) => {
                                                        console.log("nilai roll geser -" + e.target.value);
                                                        setRoll(parseInt(e.target.value));
                                                        // if (joint3 >= -70 && joint3 <= 70) setJoint3((p) => p + parseInt(e.target.value));
                                                        // if (joint4 >= -70 && joint4 <= 70) setJoint4((p) => p - parseInt(e.target.value));
                                                        setJoint3(parseInt(e.target.value));
                                                        setJoint4(-(parseInt(e.target.value)))
                                                    }}
                                                />
                                            </label>
                                            <label>
                                                Pitch :
                                                <input
                                                    type="text"
                                                    name="" id=""
                                                    className="w-10 text-right"
                                                    value={pitch}
                                                    onChange={(e) => {
                                                        const prevValue = pitch;
                                                        if (e.target.value === "") setPitch(0);
                                                        else if (Number.isNaN(parseInt(e.target.value))) {
                                                            alert("INPUT MUST BE A NUMBER!");
                                                            setPitch(prevValue);
                                                        }
                                                        else setPitch(parseInt(e.target.value));
                                                    }}
                                                />°
                                                <button hidden={(pitch === 0)} className="ml-3" onClick={() => {
                                                    setPitch(0);
                                                    setJoint3(0);
                                                    setJoint4(0);
                                                }}>↻
                                                </button>
                                                <br />
                                                <input
                                                    type="range"
                                                    min={-100}
                                                    max={100}
                                                    step="0.01"
                                                    value={pitch}
                                                    className='w-full'
                                                    onChange={(e) => {
                                                        setPitch(parseInt(e.target.value));
                                                        setJoint3((p) => (p < parseInt(e.target.value))?p + parseInt(e.target.value): p - parseInt(e.target.value));
                                                        setJoint4((p) => (p < parseInt(e.target.value))?p + parseInt(e.target.value): p - parseInt(e.target.value));
                                                    }}
                                                />
                                            </label>
                                        </div> :
                                        <>
                                            <SliderJoint
                                                jointName='Joint 3'
                                                min={-70}
                                                max={70}
                                                value={joint3}
                                                onChange={setJoint3}
                                                onReset={() => { setJoint3(0) }}
                                            />
                                            <SliderJoint
                                                jointName='Joint 4'
                                                min={-70}
                                                max={70}
                                                value={joint4}
                                                onChange={setJoint4}
                                                onReset={() => { setJoint4(0) }}
                                            />
                                        </>
                                }
                                <SliderJoint
                                    jointName='Joint 5'
                                    min={-70}
                                    max={70}
                                    value={joint5}
                                    onChange={setJoint5}
                                    onReset={() => { setJoint5(0) }}
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
