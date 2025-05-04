import { create } from 'zustand';

interface StoreState {
    espUrl: string;
    setUrl: (newUrl: string) => void;
}

const useStore = create<StoreState>((set) => ({
    espUrl: "",
    setUrl: (newUrl) => set({espUrl: newUrl})
}));

export default useStore;