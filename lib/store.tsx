import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    websocketURL: string;
    isConnected?: boolean;
    setWebsocketURL: (newUrl: string) => void;
}

const useStore = create<StoreState>(
    (set) => ({
    websocketURL: "ws://localhost:5000",
        // websocketURL: "https://13ebe7e99943.ngrok-free.app",
    isConnected: false,
    setWebsocketURL: (newUrl) => set({ websocketURL: newUrl }),
    })
);

interface UseWebSocketProps {
    ws: WebSocket | null;
    isConnected: boolean;
    feedbackJoint?: Array<number>;
    setWS: (newWS: WebSocket) => void;
    setIsConnected?: (newState: boolean) => void;
    setFeedbackJoint?: (newFeedback: Array<number>) => void;
}

export const useWebSocket = create<UseWebSocketProps>((set) => ({
    ws: null,
    isConnected: false,
    setWS: (newWS) => set({ ws: newWS }),
    setIsConnected: (newState) => set({ isConnected: newState }),
    setFeedbackJoint: (newFeedback) => set({ feedbackJoint: newFeedback })
}))

export default useStore;