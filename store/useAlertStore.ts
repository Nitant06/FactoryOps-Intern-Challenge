import { create } from 'zustand';

export interface AlertMessage {
  id: string;
  machineName: string;
  message: string;
  severity: 'high' | 'medium';
  timestamp: string;
}

interface AlertStore {
  alerts: AlertMessage[];
  addAlert: (alert: AlertMessage) => void;
  acknowledgeAlert: (id: string) => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  
  addAlert: (alert) => set((state) => ({ 
    alerts: [alert, ...state.alerts] 
  })),

  acknowledgeAlert: (id) => set((state) => ({
    alerts: state.alerts.filter((a) => a.id !== id)
  })),
}));