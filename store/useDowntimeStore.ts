import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const TENANT_ID = "tenant-limelight-intern-001"; // <--- HARD REQUIREMENT

export const REASON_TREE = [
  { code: "NO-ORDER", label: "No Order", children: [{ code: "PLANNED", label: "Planned" }, { code: "UNPLANNED", label: "Unplanned" }] },
  { code: "POWER", label: "Power", children: [{ code: "GRID", label: "Grid" }, { code: "INTERNAL", label: "Internal" }] },
  { code: "CHANGEOVER", label: "Changeover", children: [{ code: "TOOLING", label: "Tooling" }, { code: "PRODUCT", label: "Product" }] }
];

export interface AppEvent {
  id: string;
  tenantId: string; 
  machineId: string;
  type: 'DOWNTIME' | 'MAINTENANCE';
  timestamp: string;
  isSynced: boolean;
  reasonCategory?: string;
  reasonCode?: string;
  photoUri?: string;
  maintenanceTask?: string;
  maintenanceNotes?: string;
}

interface DowntimeStore {
  events: AppEvent[];
  addEvent: (event: Omit<AppEvent, 'id' | 'isSynced' | 'tenantId'>) => void;
  markAsSynced: (id: string) => void;
  getPendingCount: () => number;
}

export const useDowntimeStore = create<DowntimeStore>()(
  persist(
    (set, get) => ({
      events: [],
      addEvent: (newEvent) => {
        const fullEvent: AppEvent = {
          ...newEvent,
          id: Math.random().toString(36).substr(2, 9),
          tenantId: TENANT_ID,
          isSynced: false,
        };
        set((state) => ({ events: [fullEvent, ...state.events] }));
        console.log("📝 [Store] Event Saved:", fullEvent);
      },
      markAsSynced: (id) => {
        set((state) => ({
          events: state.events.map((e) => e.id === id ? { ...e, isSynced: true } : e)
        }));
      },
      getPendingCount: () => get().events.filter(e => !e.isSynced).length
    }),
    {
      name: 'factory-events-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);