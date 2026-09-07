import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';

interface UIState {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
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

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('well_twin_theme') as ThemeMode | null;
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.classList.toggle('dark', saved === 'dark');
    return saved;
  }
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = systemPrefersDark ? 'dark' : 'light';
  document.documentElement.classList.toggle('dark', initial === 'dark');
  return initial;
};

export const useUIStore = create<UIState>((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('well_twin_theme', nextTheme);
        document.documentElement.classList.toggle('dark', nextTheme === 'dark');
      }
      return { theme: nextTheme };
    }),
  setTheme: (theme: ThemeMode) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('well_twin_theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    set({ theme });
  },
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
