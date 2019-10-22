import { User, SiteStatistics, Ticket, TodoItem, WorkingGroup } from "./types";

export let users: User[] = [
  {
    type: "User",
    id: 1,
    fullName: "David Grey",
    avatarUrl: "assets/images/faces/face1.jpg"
  },
  {
    type: "User",
    id: 2,
    fullName: "Stella Johnson",
    avatarUrl: "assets/images/faces/face2.jpg"
  },
  {
    type: "User",
    id: 3,
    fullName: "Marina Michel",
    avatarUrl: "assets/images/faces/face3.jpg"
  },
  {
    type: "User",
    id: 4,
    fullName: "John Doe",
    avatarUrl: "assets/images/faces/face4.jpg"
  }
];

export let workingGroups: WorkingGroup[] = [
  {
    type: "WorkingGroup",
    id: 1,
    name: "Customer Support #1",
    memberIds: [1, 2]
  },
  {
    type: "WorkingGroup",
    id: 2,
    name: "Customer Support #2",
    memberIds: [3]
  }
];

export let siteStatistics: SiteStatistics = {
  type: "SiteStatistics",
  id: 1,
  weeklySales: 15000.0,
  weeklyOrders: 234,
  currentVisitorsOnline: 1523
};

export let tickets: Ticket[] = [
  {
    type: "Ticket",
    id: 1,
    assignee: { type: "User", id: 1 },
    subject: "Funds not received",
    status: "Done",
    lastUpdated: new Date(2019, 9, 10).toJSON(),
    trackingId: "WD-12345"
  },
  {
    type: "Ticket",
    id: 2,
    assignee: { type: "WorkingGroup", id: 1 },
    subject: "High loading time",
    status: "Progress",
    lastUpdated: new Date(2019, 9, 11).toJSON(),
    trackingId: "WD-12346"
  },
  {
    type: "Ticket",
    id: 3,
    assignee: null,
    subject: "Website down for one week",
    status: "OnHold",
    lastUpdated: new Date(2019, 9, 12).toJSON(),
    trackingId: "WD-12347"
  },
  {
    type: "Ticket",
    id: 4,
    assignee: { type: "User", id: 3 },
    subject: "Loosing control on server	",
    status: "Rejected",
    lastUpdated: new Date(2019, 9, 15).toJSON(),
    trackingId: "WD-12348"
  },
  {
    type: "Ticket",
    id: 5,
    assignee: { type: "User", id: 4 },
    subject: "Website slow",
    status: "OnHold",
    lastUpdated: new Date(2019, 9, 17).toJSON(),
    trackingId: "WD-12349"
  }
];

export let todoItems: TodoItem[] = [
  {
    type: "TodoItem",
    id: 1,
    text: "Do some cool stuff",
    completed: false
  },
  {
    type: "TodoItem",
    id: 2,
    text: "Clean the kitchen",
    completed: true
  },
  {
    type: "TodoItem",
    id: 3,
    text: "Get a dog",
    completed: false
  }
];

export let data = {
  SiteStatistics: [siteStatistics],
  User: users,
  Ticket: tickets,
  TodoItem: todoItems
};
