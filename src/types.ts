export type SiteStatistics = {
  type: 'SiteStatistics';
  id: number;
  weeklySales: number;
  weeklyOrders: number;
  currentVisitorsOnline: number;
};

export type User = {
  type: 'User';
  id: number;
  avatarUrl: string | null;
  fullName: string;
};

export type WorkingGroup = {
  type: 'WorkingGroup';
  id: number;
  name: string;
  memberIds: number[];
};

type AssigneeUnion =
  | { type: 'User'; id: number }
  | { type: 'WorkingGroup'; id: number };

export type TicketStatus = 'Done' | 'Progress' | 'OnHold' | 'Rejected';

export type Ticket = {
  type: 'Ticket';
  id: number;
  assignee: AssigneeUnion | null;
  subject: string;
  status: TicketStatus;
  lastUpdated: string;
  trackingId: string;
};

export type TodoItem = {
  type: 'TodoItem';
  id: number;
  text: string;
  completed: boolean;
};

export type PaginatedList<T> = {
  total: number;
  hasNextPage: boolean;
  results: T[];
};

export type TodoUpdateInputType = {
  id: string;
  text: string;
  completed: boolean;
};
