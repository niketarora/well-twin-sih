import { create } from 'zustand';
import { WorkOrder, WorkOrderStatus } from '../types';
import { workOrderService } from '../services';

interface WorkOrderStoreState {
  workOrders: WorkOrder[];
  filterStatus: 'all' | WorkOrderStatus;
  isLoading: boolean;
  loadWorkOrders: () => Promise<void>;
  setFilterStatus: (status: 'all' | WorkOrderStatus) => void;
  createWorkOrder: (order: Omit<WorkOrder, 'id' | 'orderNumber' | 'createdAt'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: WorkOrderStatus) => Promise<void>;
}

export const useWorkOrderStore = create<WorkOrderStoreState>((set) => ({
  workOrders: [],
  filterStatus: 'all',
  isLoading: false,

  loadWorkOrders: async () => {
    set({ isLoading: true });
    try {
      const data = await workOrderService.getWorkOrders();
      set({ workOrders: data, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  setFilterStatus: (status) => set({ filterStatus: status }),

  createWorkOrder: async (order) => {
    const created = await workOrderService.createWorkOrder(order);
    set((state) => ({ workOrders: [created, ...state.workOrders] }));
  },

  updateOrderStatus: async (orderId, status) => {
    const updated = await workOrderService.updateWorkOrderStatus(orderId, status);
    set((state) => ({
      workOrders: state.workOrders.map((o) => (o.id === orderId ? updated : o)),
    }));
  },
}));
