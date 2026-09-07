import { WorkOrder, WorkOrderStatus } from '../types';
import { mockWorkOrders } from '../mock';

export interface IWorkOrderService {
  getWorkOrders(): Promise<WorkOrder[]>;
  createWorkOrder(order: Omit<WorkOrder, 'id' | 'orderNumber' | 'createdAt'>): Promise<WorkOrder>;
  updateWorkOrderStatus(orderId: string, status: WorkOrderStatus): Promise<WorkOrder>;
}

export class MockWorkOrderService implements IWorkOrderService {
  private orders: WorkOrder[] = [...mockWorkOrders];

  async getWorkOrders(): Promise<WorkOrder[]> {
    return Promise.resolve([...this.orders]);
  }

  async createWorkOrder(order: Omit<WorkOrder, 'id' | 'orderNumber' | 'createdAt'>): Promise<WorkOrder> {
    const newId = `wo-${Date.now()}`;
    const newNumber = `WO-BW17-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: WorkOrder = {
      ...order,
      id: newId,
      orderNumber: newNumber,
      createdAt: 'Just now',
    };
    this.orders.unshift(newOrder);
    return Promise.resolve({ ...newOrder });
  }

  async updateWorkOrderStatus(orderId: string, status: WorkOrderStatus): Promise<WorkOrder> {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) throw new Error(`Work order ${orderId} not found`);
    order.status = status;
    if (status === 'Completed') {
      order.completedAt = 'Just now';
    }
    return Promise.resolve({ ...order });
  }
}

export const workOrderService: IWorkOrderService = new MockWorkOrderService();
