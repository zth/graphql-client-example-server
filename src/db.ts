import { ConnectionArguments, connectionFromArray } from 'graphql-relay';
import { User, SiteStatistics, Ticket, TodoItem, WorkingGroup } from './types';

const wait = (time: number) =>
  new Promise(resolve => setTimeout(resolve, time));

class Database<T> {
  constructor(private raw: T[], private delay = 500) {}

  async push(item: T) {
    await wait(this.delay);
    this.raw.push(item);
  }

  async last(): Promise<T> {
    await wait(this.delay);
    return this.raw[this.raw.length - 1];
  }

  async find(condition: (item: T) => boolean): Promise<T | undefined> {
    await wait(this.delay);
    return this.raw.find(condition);
  }

  async findIndex(condition: (item: T) => boolean): Promise<number> {
    await wait(this.delay);
    return this.raw.findIndex(condition);
  }

  async *all(): AsyncIterator<T> {
    for (const item of this.raw) {
      yield item;
      await wait(this.delay);
    }
  }

  allPaginated(offset: number, limit: number) {
    const self = this;
    return {
      async *results() {
        for (const item of self.raw.slice(offset, offset + limit)) {
          yield item;
          await wait(self.delay);
        }
      },
      hasNextPage: offset + limit < this.raw.length,
      total: this.raw.length
    };
  }

  allConnection(args: ConnectionArguments) {
    const { edges, pageInfo } = connectionFromArray(this.raw, args);
    const self = this;
    return {
      async *edges() {
        for (const edge of edges) {
          yield edge;
          await wait(self.delay);
        }
      },
      pageInfo
    };
  }

  async *splice(start: number, deleteCount: number, ...items: T[]) {
    const spliced = this.raw.splice(start, deleteCount, ...items);
    for (const item of spliced) {
      yield item;
      await wait(this.delay);
    }
  }

  async *filter(condition: (item: T) => boolean): AsyncIterable<T> {
    const filtered = this.raw.filter(condition);
    for (const item of filtered) {
      yield item;
      await wait(this.delay);
    }
  }

  filterPaginated(
    condition: (item: T) => boolean,
    offset: number,
    limit: number
  ) {
    const filtered = this.raw.filter(condition);
    const self = this;
    return {
      async *results() {
        for (const item of filtered.slice(offset, offset + limit)) {
          yield item;
          await wait(self.delay);
        }
      },
      hasNextPage: offset + limit < filtered.length,
      total: filtered.length
    };
  }

  filterConnection(condition: (item: T) => boolean, args: ConnectionArguments) {
    const filtered = this.raw.filter(condition);
    const { edges, pageInfo } = connectionFromArray(filtered, args);
    const self = this;
    return {
      async *edges() {
        for (const edge of edges) {
          yield edge;
          await wait(self.delay);
        }
      },
      pageInfo
    };
  }
}

export let users: Database<User> = new Database([
  {
    type: 'User',
    id: 1,
    fullName: 'David Grey',
    avatarUrl: '/images/faces/face1.jpg'
  },
  {
    type: 'User',
    id: 2,
    fullName: 'Stella Johnson',
    avatarUrl: '/images/faces/face2.jpg'
  },
  {
    type: 'User',
    id: 3,
    fullName: 'Marina Michel',
    avatarUrl: '/images/faces/face3.jpg'
  },
  {
    type: 'User',
    id: 4,
    fullName: 'John Doe',
    avatarUrl: '/images/faces/face4.jpg'
  }
]);

export let workingGroups: Database<WorkingGroup> = new Database([
  {
    type: 'WorkingGroup',
    id: 1,
    name: 'Customer Support #1',
    memberIds: [1, 2]
  },
  {
    type: 'WorkingGroup',
    id: 2,
    name: 'Customer Support #2',
    memberIds: [3]
  }
]);

export let siteStatistics: SiteStatistics = {
  type: 'SiteStatistics',
  id: 1,
  weeklySales: 15000.0,
  weeklyOrders: 234,
  currentVisitorsOnline: 1523
};

export let tickets: Database<Ticket> = new Database([
  {
    type: 'Ticket',
    id: 1,
    assignee: { type: 'User', id: 1 },
    subject: 'Funds not received',
    status: 'Done',
    lastUpdated: new Date(2019, 9, 10).toJSON(),
    trackingId: 'WD-12345'
  },
  {
    type: 'Ticket',
    id: 2,
    assignee: { type: 'WorkingGroup', id: 1 },
    subject: 'High loading time',
    status: 'Progress',
    lastUpdated: new Date(2019, 9, 11).toJSON(),
    trackingId: 'WD-12346'
  },
  {
    type: 'Ticket',
    id: 3,
    assignee: null,
    subject: 'Website down for one week',
    status: 'OnHold',
    lastUpdated: new Date(2019, 9, 12).toJSON(),
    trackingId: 'WD-12347'
  },
  {
    type: 'Ticket',
    id: 4,
    assignee: { type: 'User', id: 3 },
    subject: 'Loosing control on server	',
    status: 'Rejected',
    lastUpdated: new Date(2019, 9, 15).toJSON(),
    trackingId: 'WD-12348'
  },
  {
    type: 'Ticket',
    id: 5,
    assignee: { type: 'User', id: 4 },
    subject: 'Website slow',
    status: 'OnHold',
    lastUpdated: new Date(2019, 9, 17).toJSON(),
    trackingId: 'WD-12349'
  }
]);

export let todoItems: Database<TodoItem> = new Database([
  {
    type: 'TodoItem',
    id: 1,
    text: 'Do some cool stuff',
    completed: false
  },
  {
    type: 'TodoItem',
    id: 2,
    text: 'Clean the kitchen',
    completed: true
  },
  {
    type: 'TodoItem',
    id: 3,
    text: 'Get a dog',
    completed: false
  }
]);

export let data = {
  SiteStatistics: [siteStatistics],
  User: users,
  Ticket: tickets,
  TodoItem: todoItems,
  WorkingGroup: workingGroups
};
