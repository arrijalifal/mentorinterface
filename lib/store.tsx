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
    isConnected?: boolean;
    setUrl: (newUrl: string) => void;
    setPositions?: (newPositions: number[][]) => void;
}

const useStore = create<StoreState>((set) => ({
    espUrl: "",
    positions: [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
    isConnected: false,
    setUrl: (newUrl) => set({ espUrl: newUrl }),
    setPositions: (newPositions) => set({ positions: newPositions }),
}));

interface UseWebSocketProps {
    ws: WebSocket | null;
    isConnected: boolean;
    setWS: (newWS: WebSocket) => void;
    setIsConnected?: (newState: boolean) => void;
}

export const useWebSocket = create<UseWebSocketProps>((set) => ({
    ws: null,
    isConnected: false,
    setWS: (newWS) => set({ws: newWS}),
    setIsConnected: (newState) => set({isConnected: newState})
}))

export default useStore;