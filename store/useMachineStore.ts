import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const SEED_MACHINES = [
  { id: "M-101", name: "Cutter 1", type: "cutter", status: "RUN" },
  { id: "M-102", name: "Roller A", type: "roller", status: "IDLE" },
  { id: "M-103", name: "Packing West", type: "packer", status: "OFF" }
];

interface Machine {
  id: string;
  name: string;
  type: string;
  status: string; // "RUN" | "IDLE" | "OFF"
}

interface MachineStore {
  machines: Machine[];
  initializeMachines: () => void;
}

export const useMachineStore = create<MachineStore>()(
  persist(
    (set, get) => ({
      machines: [],
      
      initializeMachines: () => {
        if (get().machines.length === 0) {
          set({ machines: SEED_MACHINES });
        }
      }
    }),
    {
      name: 'machine-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);