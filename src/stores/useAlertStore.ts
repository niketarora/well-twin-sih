import { create } from 'zustand';
import { Alert } from '../types';
import { alertService } from '../services';

interface AlertStoreState {
  alerts: Alert[];
  filterSeverity: 'all' | 'critical' | 'warning' | 'info';
  filterStatus: 'all' | 'active' | 'acknowledged' | 'resolved';
  isLoading: boolean;
  loadAlerts: () => Promise<void>;
  setFilterSeverity: (sev: 'all' | 'critical' | 'warning' | 'info') => void;
  setFilterStatus: (status: 'all' | 'active' | 'acknowledged' | 'resolved') => void;
  acknowledgeAlert: (alertId: string) => Promise<void>;
  resolveAlert: (alertId: string) => Promise<void>;
}

export const useAlertStore = create<AlertStoreState>((set) => ({
  alerts: [],
  filterSeverity: 'all',
  filterStatus: 'active',
  isLoading: false,

  loadAlerts: async () => {
    set({ isLoading: true });
    try {
      const data = await alertService.getAlerts();
      set({ alerts: data, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  setFilterSeverity: (sev) => set({ filterSeverity: sev }),
  setFilterStatus: (status) => set({ filterStatus: status }),

  acknowledgeAlert: async (alertId: string) => {
    const updated = await alertService.acknowledgeAlert(alertId);
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === alertId ? updated : a)),
    }));
  },

  resolveAlert: async (alertId: string) => {
    const updated = await alertService.resolveAlert(alertId);
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === alertId ? updated : a)),
    }));
  },
}));
