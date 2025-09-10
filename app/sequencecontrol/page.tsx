// pages/index.js
'use client'
import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from '@/components/Scene';
import { forwardKinematics, getPositionFromMatrix } from '@/lib/forwardKinematicsPitchOnly';
import { useWebSocket } from '@/lib/store';
import SliderJoint from '@/components/SliderJoint';
import Button from '@/components/Button';
import { DownloadSequence } from '@/components';
import { useRouter } from 'next/navigation';
import inverseKinematicsFromMatrix from '@/lib/inverseFromMatrix';
import e from 'cors';

const Home = () => {
    const [joint0, setJoint0] = useState(0);
    const [joint1, setJoint1] = useState(0);
    const [joint2, setJoint2] = useState(0);
    const [joint3, setJoint3] = useState(0);
    const [joint34, setJoint34] = useState(0);
    const [joint4, setJoint4] = useState(0);
    const [joint5, setJoint5] = useState(0);
    const [socket, setSocket] = useState<WebSocket>();
    const [inversValue, setInversValue] = useState({ x: 0, y: 0, z: 0 });
    const { ws, setWS, feedbackJoint } = useWebSocket();

    const [lockView, setLockView] = useState(false);
    const [mode, setMode] = useState('forward');
    const [tempXYZ, setTempXYZ] = useState({ x: '0', y: '0', z: '0' });
    const [programList, setProgramList] = useState<ProgramList[]>();
    const [editMode, setEditMode] = useState(false);
    const [editIndex, setEditIndex] = useState(-1);
    const [liveView, setLiveView] = useState(false);

    // variabel untuk running sequence
    const [currentRunningIndex, setCurrentRunningIndex] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);

    const [fileName, setFileName] = useState<string>(Date.now().toString());
    const [individualMotors, setIndividualMotors] = useState(false);

    const router = useRouter();
    // Handle untuk reload ato pindah navigasi
    useEffect(() => {
        if (!programList?.length) return;
        function handleBeforeUnload(e: BeforeUnloadEvent) {
            e.preventDefault();
        }
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, [programList?.length, router]);

    type ProgramList = {
        joint0: number;
        joint1: number;
        joint2: number;
        joint3: number;
        joint4: number;
        joint5: number;
    }

    // useEffect untuk cek koneksi websocket
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
        if (ws && ws.readyState === WebSocket.OPEN && isRunning) {
            ws.send(`j ${joint0} ${joint1} ${joint2} ${joint3} ${joint4} ${joint5}`);
        } else {
            console.log("Can't send message to websocket");
        }
        // console.log(programList);
        console.log(feedbackJoint);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [joint0, joint1, joint2, joint3, joint4, joint5, socket, ws, programList, isRunning, liveView]);

    // useEffect untuk atur sequence program
    function handleStopSequence() {
        setIsRunning(false);
        setCurrentRunningIndex(-1);
        return;
    }

    useEffect(() => {
        if (!isRunning || !programList?.length) return;

        // if (currentRunningIndex >= programList.length) {
        //     handleStopSequence();
        // }

        const currentStep = programList[currentRunningIndex];

        console.log('CurrentRunningIndex=', currentRunningIndex);

        setJoint0(currentStep.joint0);
        setJoint1(currentStep.joint1);
        setJoint2(currentStep.joint2);
        setJoint3(currentStep.joint3);
        setJoint4(currentStep.joint4);
        setJoint5(currentStep.joint5);

        const offset = [
            1.5,
            1.5,
            1.5,
            1.5,
            5,
            1.5
        ];
        if (feedbackJoint)
            console.log("cek offset=",
                Math.abs(feedbackJoint[0] - currentStep.joint0),
                Math.abs(feedbackJoint[1] - currentStep.joint1),
                Math.abs(feedbackJoint[2] - currentStep.joint2),
                Math.abs(feedbackJoint[3] - currentStep.joint3),
                Math.abs(feedbackJoint[4] - currentStep.joint4),
                Math.abs(feedbackJoint[5] - currentStep.joint5),
            )

        if (feedbackJoint &&
            Math.abs(feedbackJoint[0] - currentStep.joint0) < offset[0] &&
            Math.abs(feedbackJoint[1] - currentStep.joint1) < offset[1] &&
            Math.abs(feedbackJoint[2] - currentStep.joint2) < offset[2] &&
            Math.abs(feedbackJoint[3] - currentStep.joint3) < offset[3] &&
            Math.abs(feedbackJoint[4] - currentStep.joint4) < offset[4] &&
            Math.abs(feedbackJoint[5] - currentStep.joint5) < offset[5]) {
            setTimeout(() => {
                setCurrentRunningIndex((prev) => (currentRunningIndex < programList.length - 1) ? prev + 1 : 0);
            }, 300); // delay pendek biar smooth
        }
        // else {
        //     setTimeout(() => {
        //         setCurrentRunningIndex((prev) => (currentRunningIndex < programList.length) ? prev + 1 : 0);
        //     }, 1000);
        // }


        //         Math.abs(feedbackJoint[0] - currentStep.joint0) < offset[0] &&
        //         Math.abs(feedbackJoint[1] - currentStep.joint1) < offset[1] &&
        //         Math.abs(feedbackJoint[2] - currentStep.joint2) < offset[2] &&
        //         Math.abs(feedbackJoint[3] - currentStep.joint3) < offset[3] &&
        //         Math.abs(feedbackJoint[4] - currentStep.joint4) < offset[4] &&
        //         Math.abs(feedbackJoint[5] - currentStep.joint5) < offset[5]) {
        //     // robot sudah dekat target, lanjut step
        //     setTimeout(() => {
        //         setCurrentRunningIndex((prev) => (currentRunningIndex < programList.length - 1) ? prev + 1 : 0);
        //     }, 300); // delay pendek biar smooth
        // }
        // else {
        //     setTimeout(() => {
        //         setCurrentRunningIndex((prev) => (currentRunningIndex < programList.length - 1) ? prev + 1 : 0);
        //     }, 1000);
        // }


        // return () => clearTimeout(timeout);
    }, [isRunning, currentRunningIndex, programList, feedbackJoint, liveView]);


    return (
        <div className='w-full h-full flex' id='manualcontrolpage'>
            {/* Panel Tampilan Simulasi */}
            <section className='w-1/2' id='threedsection'>
                {/* Tampilan Simulasi 3 Dimensi */}
                <section className='w-full h-1/2 overflow-y-auto relative'>
                    <Canvas camera={{ position: [-50, 50, 50] }}>
                        <Scene th1={joint0} th2={joint1} th3={joint2} th4={joint3} point={{ x: 0, y: 0, z: 0 }} isInverse={false} />
                    </Canvas>
                    <section className='w-full flex justify-end items-center gap-3 absolute bottom-0'>
                        <div className={`flex gap-3 ${(lockView) ? 'invisible' : 'visible'}`}>
                            <button className='border border-black rounded px-2 py-1' onClick={() => { }}>Top</button>
                            <button className='border border-black rounded px-2 py-1' onClick={() => { }}>Side</button>
                            <button className='border border-black rounded px-2 py-1' onClick={() => { }}>Front</button>
                        </div>
                        <label htmlFor="lockview" className="px-2 py-1 border border-black rounded cursor-pointer">
                            <input type='checkbox' id='lockview' name='lockview' checked={lockView} onChange={() => setLockView((prev) => !prev)} />
                            <p className="inline-block select-none">
                                &nbsp;Lock View
                            </p>
                        </label>
                    </section>
                </section>
                {/* Pengaturan Kamera Simulasi 3 Dimensi */}
                <section className="w-full h-1/2 overflow-y-auto">
                    <h3 className='text-center'>Program List</h3>
                    <div className='my-3 px-2 flex justify-between items-center'>
                        <div id='buttonhandlefilesequence'>
                            {
                                (programList?.length) ?
                                    <DownloadSequence filename={fileName} data={programList!} />
                                    :
                                    <label htmlFor='file' className='buttonstyle cursor-pointer'>
                                        <input
                                            id='file'
                                            type="file"
                                            accept='.json,application/json'
                                            className='hidden'
                                            onChange={(event) => {
                                                const file = event.target.files![0];
                                                if (!file) return;

                                                const reader = new FileReader();
                                                reader.onload = () => {
                                                    const text = reader.result!.toString();
                                                    try {
                                                        const json = JSON.parse(text);
                                                        console.log('Hasil JSON:', json);
                                                        setFileName(file.name.split('.')[0]);
                                                        setProgramList(json);
                                                    }
                                                    catch {
                                                        console.log('tidak dapat membaca json');
                                                    }
                                                };
                                                reader.readAsText(file);
                                            }}
                                        />
                                        Upload File
                                    </label>
                            }
                            <button
                                className={`buttonstyle ${(programList?.length) ? 'inline-block ml-3' : 'hidden'}`}
                                onClick={() => {
                                    if (!window.confirm('Program sequence belum disimpan. Lanjutkan?')) return;
                                    setProgramList([]);
                                    setFileName('sequenceprogram');
                                }}
                            >Clear Sequence
                            </button>
                        </div>
                        <div className='flex items-center gap-3'>
                            <label htmlFor="liveView" className='w-fit'>
                                <input
                                    type="checkbox"
                                    name="liveView"
                                    id="liveView"
                                    checked={liveView}
                                    onChange={() => setLiveView((prev) => !prev)}
                                />
                                <p className='inline ml-2 select-none'>Live View</p>
                            </label>
                            <button
                                type="button"
                                className={`buttonstyle ${(currentRunningIndex >= 0) ? 'invisible' : 'visible'}`}
                                onClick={() => {
                                    if (!programList?.length) return;
                                    setCurrentRunningIndex(0);
                                    setIsRunning(true);
                                }}
                            >Start Sequence</button>
                            <button
                                type="button"
                                className={`buttonstyle ${(currentRunningIndex >= 0) ? 'inline-block' : 'hidden'}`}
                                onClick={() => setIsRunning((prev) => !prev)}
                            >{(isRunning) ? 'Pause' : 'Play'}
                            </button>
                            <button
                                type="button"
                                className='buttonstyle'
                                onClick={handleStopSequence}
                            >Stop</button>
                        </div>
                    </div>
                    {
                        (programList) &&
                        programList.map((data, index) => (
                            <div
                                key={index}
                                className={`px-3 py-3 border cursor-pointer select-none ${(index == currentRunningIndex) ? 'bg-green-300' : (index === editIndex) ? 'bg-gray-200' : ''} flex justify-between items-center`}
                                onClick={() => {
                                    setEditMode(true);
                                    setEditIndex(index);
                                    setJoint0(data.joint0);
                                    setJoint1(data.joint1);
                                    setJoint2(data.joint2);
                                    setJoint3(data.joint3);
                                    setJoint4(data.joint4);
                                    setJoint5(data.joint5);
                                }}
                            >
                                <p className='inline-block ml-3'><strong>{index + 1}&nbsp;</strong>0: {data.joint0}, 1: {data.joint1}, 2: {data.joint2}, 3: {data.joint3}, 4: {data.joint4}, 5: {data.joint5}</p>
                                <button
                                    className={`buttonstyle ${(index === editIndex) ? '' : 'hidden'} bg-red-400`}
                                    onClick={() => {
                                        setEditMode(false);
                                        setEditIndex(-1);
                                        setProgramList(prev => prev?.filter((_, i) => i != index));
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    }
                </section>
            </section>
            {/* Panel Kontrol Joint */}
            <section className='w-1/2 pt-5 px-5' id='controlsection'>
                <h1 className='text-center text-2xl font-semibold'>Sequence Control</h1>
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
                                    min={-22}
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
                                <div>
                                    {
                                        (editMode) ?
                                            <div className='flex gap-3'>
                                                {
                                                    (programList) &&
                                                    <button
                                                        className='buttonstyle'
                                                        onClick={() => {
                                                            const newData = [...programList];
                                                            newData[editIndex] = { joint0, joint1, joint2, joint3, joint4, joint5 };
                                                            setProgramList(newData);
                                                            setEditMode(false);
                                                            setEditIndex(-1);
                                                        }}
                                                    >Apply</button>
                                                }
                                                <button
                                                    className='buttonstyle'
                                                    onClick={() => {
                                                        setEditMode(false);
                                                        setEditIndex(-1);
                                                    }}
                                                >Cancel</button>
                                            </div>
                                            :
                                            <button
                                                className='buttonstyle'
                                                onClick={() => { setProgramList((programList) ? [...programList, { joint0, joint1, joint2, joint3, joint4, joint5 }] : [{ joint0: joint0, joint1: joint1, joint2: joint2, joint3: joint3, joint4, joint5 }]) }}
                                            >&lt;&lt; Add Sequence</button>
                                    }
                                </div>
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
                                                setInversValue({ x: Number(tempXYZ.x), y: Number(tempXYZ.y), z: Number(tempXYZ.z) });
                                                const getJoints = inverseKinematicsFromMatrix(inversValue.x, inversValue.y, inversValue.z, joint3);
                                                console.log('inverse joints = ', getJoints);
                                                setJoint0(getJoints.theta1);
                                                setJoint1(getJoints.theta2);
                                                setJoint2(getJoints.theta3);
                                                setJoint3(getJoints.theta4);
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
