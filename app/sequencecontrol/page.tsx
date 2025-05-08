// pages/index.js
'use client'
import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import inverseKinematics from '@/lib/inverseKinematics';
import SliderJoint from '@/components/SliderJoint';
// import forwardKinematicsDH from '@/lib/forwardKinematicsDH';
import { forwardKinematics, getPositionFromMatrix } from '@/lib/forwardKinematicsPitchOnly';
import FK from '@/lib/forwardKinematics';
import SimulationWindow from '@/components/SimulationWindow';

type ProgramList = {
    joint0: number;
    joint1: number;
    joint2: number;
    joint3: number;
}

const dummyProgramList: ProgramList[] = [
    {
        joint0: 45,
        joint1: 60,
        joint2: 35,
        joint3: 25,
    },
    {
        joint0: 35,
        joint1: 70,
        joint2: -12,
        joint3: 48,
    },
    {
        joint0: -30,
        joint1: 25,
        joint2: -28,
        joint3: -54,
    },
    {
        joint0: -30,
        joint1: 25,
        joint2: -28,
        joint3: -54,
    },
    {
        joint0: -30,
        joint1: 25,
        joint2: -28,
        joint3: -54,
    },
]

const Home = () => {
    const [joint0, setJoint0] = useState(0);
    const [joint1, setJoint1] = useState(0);
    const [joint2, setJoint2] = useState(0);
    const [joint3, setJoint3] = useState(0);
    const [inversValue, setInversValue] = useState({ x: 0, y: 0, z: 0 });
    const [fkJoint, setFkJoint] = useState({ joint1: [0, 0, 0], joint2: [0, 0, 0], joint3: [0, 0, 0] })
    const [fK, setFK] = useState({ x: 0, y: 0, z: 0 });
    const [programList, setProgramList] = useState<ProgramList[]>();
    const [editMode, setEditMode] = useState(false);
    const [editIndex, setEditIndex] = useState(-1);
    // const [editData, setEditData] = useState({ index: 0, joints: [0, 0, 0, 0]})

    useEffect(() => {
        const T = forwardKinematics(joint0, joint1, joint2, joint3);
        const pos = getPositionFromMatrix(T);
        console.log(pos);
        // const getFK = forwardKinematicsDH([joint0, joint1, joint2, joint3]);
        // setFK(getFK);
        setFK(pos);
        const jointPositions = FK(16, 15, 12, joint0, joint1, joint2, joint3);
        setFkJoint(jointPositions);
        // console.log(jointPositions);
    }, [joint0, joint1, joint2, joint3]);

    const [mode, setMode] = useState('forward');

    function handleInverseKinematics() {
        const result = inverseKinematics(inversValue.x, inversValue.y, inversValue.z);
        setJoint0(result.joint0);
        setJoint1(result.joint1);
        setJoint2(result.joint2);
        setJoint3(result.joint3);
    }



    return (
        <div className='w-full h-full lg:flex lg:flex-row overflow-hidden' id='cihuyy'>
            <SimulationWindow
                joint0={joint0}
                joint1={joint1}
                joint2={joint2}
                joint3={joint3}
                // fkJoint={fkJoint}
                fK={fK}
            >
                <section className='h-[22rem] flex flex-col px-2 border border-black'>
                    <h3 className='text-center'>Program List</h3>
                    <div className='my-3 flex justify-between items-center'>
                        <button
                            className='buttonstyle'
                            onClick={() => { setProgramList([]) }}
                        >Clear Sequence</button>
                        <div className='flex gap-3'>
                            <button type="button" className='buttonstyle'>Play Sequence</button>
                            <button type="button" className='buttonstyle'>Pause</button>
                            <button type="button" className='buttonstyle'>Stop</button>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2 overflow-y-auto pb-3'>
                        {
                            (programList) &&
                            programList.map((data, index) => (
                                <div
                                    key={index}
                                    className={`px-3 py-1 border cursor-pointer ${(index === editIndex)? 'bg-gray-200' : ''}`}
                                    onClick={() => {
                                        setEditMode(true);
                                        setEditIndex(index);
                                        setJoint0(data.joint0);
                                        setJoint1(data.joint1);
                                        setJoint2(data.joint2);
                                        setJoint3(data.joint3);
                                    }}
                                >
                                    <strong>{index + 1}</strong><p className='inline-block ml-3'>0: {data.joint0}, 1: {data.joint1}, 2: {data.joint2}, 3: {data.joint3}</p>
                                </div>
                            ))
                        }
                    </div>
                </section>
            </SimulationWindow>
            <section className='lg:w-1/2 h-full flex flex-col w-full p-4 mt-5 overflow-y-auto'>
                <h1 className='text-center text-2xl font-semibold'>Sequence Control</h1>
                <div className='mt-8 px-12'>
                    <div className="flex gap-3">
                        <Button onClick={() => setMode('forward')} active={(mode === 'forward')}>Forward Kinematics</Button>
                        <Button onClick={() => setMode('inverse')} active={(mode === 'inverse')} >Inverse Kinematics</Button>
                    </div>
                    {
                        (mode === 'forward') ?
                            <div className='mt-12 flex flex-col gap-3'>
                                <div>
                                    {
                                        (!editMode)?
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
                                            : <h3>Edit Data</h3>
                                    }
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
                                    min={-180}
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
                                    {
                                        (editMode) ?
                                            <div className='flex gap-3'>
                                                {
                                                    (programList) &&
                                                    <button
                                                        className='buttonstyle'
                                                        onClick={() => {
                                                            const newData = [...programList];
                                                            newData[editIndex] = { joint0, joint1, joint2, joint3 };
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
                                                onClick={() => { setProgramList((programList) ? [...programList, { joint0: joint0, joint1: joint1, joint2: joint2, joint3: joint3 }] : [{ joint0: joint0, joint1: joint1, joint2: joint2, joint3: joint3 }]) }}
                                            >&lt;&lt; Add Sequence</button>
                                    }
                                </div>
                                <div>
                                    <p>Posisi End Effector Perhitungan</p>
                                    <p>x: {fK.x}<br />y: {fK.y}<br />z: {fK.z}</p>
                                </div>
                                {/* <div>
                                    <p>Posisi Tiap Joint</p>
                                    <p>Joint 1 = x : {fkJoint.joint1[0]}, y : {fkJoint.joint1[1]}, z : {fkJoint.joint1[2]}</p>
                                    <p>Joint 2 = x : {fkJoint.joint2[0]}, y : {fkJoint.joint2[1]}, z : {fkJoint.joint2[2]}</p>
                                    <p>Joint 3 = x : {fkJoint.joint3[0]}, y : {fkJoint.joint3[1]}, z : {fkJoint.joint3[2]}</p>
                                </div> */}
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
