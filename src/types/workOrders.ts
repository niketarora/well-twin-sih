export type WorkOrderPriority = 'P1 - Immediate' | 'P2 - Scheduled' | 'P3 - Routine';
export type WorkOrderStatus = 'Open' | 'In Progress' | 'Under Review' | 'Completed' | 'Deferred';

export interface WorkOrder {
  id: string;
  orderNumber: string;
  title: string;
  description: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  assignedTo: string;
  subsystem: string;
  relatedAlertId?: string;
  relatedRecommendationId?: string;
  createdAt: string;
  dueDate: string;
  completedAt?: string;
  notes: string[];
}
