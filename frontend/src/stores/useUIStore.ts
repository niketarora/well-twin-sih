import { create } from 'zustand';

interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  selectedWellId: string;
  setSelectedWellId: (wellId: string) => void;
  timeRange: '24h' | '7d' | '30d' | 'cycle';
  setTimeRange: (range: '24h' | '7d' | '30d' | 'cycle') => void;
  createWorkOrderModalOpen: boolean;
  setCreateWorkOrderModalOpen: (open: boolean) => void;
  selectedAlertIdForDetail: string | null;
  setSelectedAlertIdForDetail: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  selectedWellId: 'well-bw-017',
  setSelectedWellId: (wellId) => set({ selectedWellId: wellId }),
  timeRange: 'cycle',
  setTimeRange: (range) => set({ timeRange: range }),
  createWorkOrderModalOpen: false,
  setCreateWorkOrderModalOpen: (open) => set({ createWorkOrderModalOpen: open }),
  selectedAlertIdForDetail: null,
  setSelectedAlertIdForDetail: (id) => set({ selectedAlertIdForDetail: id }),
}));
