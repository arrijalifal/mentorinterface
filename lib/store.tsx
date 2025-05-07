import { create } from 'zustand';

interface Coordinate {
    x: number;
    y: number;
    z: number;
}

export interface JointPositionProps {
    joint0: Coordinate
    joint1: Coordinate
    joint2: Coordinate
    joint3: Coordinate
}
interface StoreState {
    espUrl: string;
    positions?: number[][];
    setUrl: (newUrl: string) => void;
    setPositions?: (newPositions: number[][]) => void;
}

const useStore = create<StoreState>((set) => ({
    espUrl: "",
    positions: [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
    setUrl: (newUrl) => set({ espUrl: newUrl }),
    setPositions: (newPositions) => set({positions: newPositions})
}));

export default useStore;