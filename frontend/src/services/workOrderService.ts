import { WorkOrder, WorkOrderStatus, WorkOrderPriority } from '../types';
import { mockWorkOrders } from '../mock';
import { apiFetch } from './apiClient';

export interface IWorkOrderService {
  getWorkOrders(): Promise<WorkOrder[]>;
  createWorkOrder(order: Omit<WorkOrder, 'id' | 'orderNumber' | 'createdAt'>): Promise<WorkOrder>;
  updateWorkOrderStatus(orderId: string, status: WorkOrderStatus): Promise<WorkOrder>;
}

export class HybridWorkOrderService implements IWorkOrderService {
  private fallbackOrders: WorkOrder[] = [...mockWorkOrders];

  async getWorkOrders(): Promise<WorkOrder[]> {
    try {
      const data = await apiFetch<any[]>('/work-orders');
      return data.map((wo, idx) => {
        const fallback = this.fallbackOrders[idx] || this.fallbackOrders[0];
        return {
          ...fallback,
          id: wo.id,
          orderNumber: wo.order_number,
          title: wo.title,
          description: wo.notes || fallback.description,
          priority: (wo.priority === 'High' ? 'P1 - Immediate' : wo.priority === 'Medium' ? 'P2 - Scheduled' : 'P3 - Routine') as WorkOrderPriority,
          status: (wo.status === 'Completed' ? 'Completed' : wo.status === 'In Progress' ? 'In Progress' : 'Open') as WorkOrderStatus,
          assignedTo: wo.assigned_to,
          subsystem: wo.category || fallback.subsystem,
          createdAt: new Date(wo.created_at).toLocaleDateString(),
          dueDate: wo.due_date ? new Date(wo.due_date).toLocaleDateString() : fallback.dueDate,
          notes: wo.notes ? [wo.notes] : fallback.notes,
          relatedAlertId: wo.related_alert_id,
          relatedRecommendationId: wo.related_recommendation_id,
        };
      });
    } catch {
      return [...this.fallbackOrders];
    }
  }

  async createWorkOrder(order: Omit<WorkOrder, 'id' | 'orderNumber' | 'createdAt'>): Promise<WorkOrder> {
    try {
      const created = await apiFetch<any>('/work-orders', {
        method: 'POST',
        body: JSON.stringify({
          well_id: 'well-bw-017',
          title: order.title,
          category: order.subsystem || 'Artificial Lift',
          priority: order.priority.includes('Immediate') ? 'High' : 'Medium',
          assigned_to: order.assignedTo,
          notes: order.description,
          related_alert_id: order.relatedAlertId,
          related_recommendation_id: order.relatedRecommendationId,
        })
      });
      return {
        ...order,
        id: created.id,
        orderNumber: created.order_number,
        createdAt: 'Just now',
      };
    } catch {
      const newId = `wo-${Date.now()}`;
      const newNumber = `WO-BW17-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: WorkOrder = {
        ...order,
        id: newId,
        orderNumber: newNumber,
        createdAt: 'Just now',
      };
      this.fallbackOrders.unshift(newOrder);
      return { ...newOrder };
    }
  }

  async updateWorkOrderStatus(orderId: string, status: WorkOrderStatus): Promise<WorkOrder> {
    try {
      const updated = await apiFetch<any>(`/work-orders/${orderId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      const order = this.fallbackOrders.find(o => o.id === orderId) || this.fallbackOrders[0];
      return {
        ...order,
        id: updated.id,
        status,
        completedAt: status === 'Completed' ? 'Just now' : undefined,
      };
    } catch {
      const order = this.fallbackOrders.find(o => o.id === orderId);
      if (!order) throw new Error(`Work order ${orderId} not found`);
      order.status = status;
      if (status === 'Completed') {
        order.completedAt = 'Just now';
      }
      return { ...order };
    }
  }
}

export const workOrderService: IWorkOrderService = new HybridWorkOrderService();
