import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLDeferDirective
} from 'graphql';

import {
  connectionArgs,
  connectionFromArray,
  fromGlobalId
} from 'graphql-relay';

import { siteStatistics, tickets, todoItems, users } from './db';
import { paginate } from './utils';

import {
  siteStatisticsType,
  ticketStatusEnum,
  ticketConnection,
  todoConnection,
  nodeField,
  userType,
  ticketsPaginatedType,
  todosPaginatedType,
  todoItemType
} from './graphqlTypes';

import { mutationType } from './mutations';
import { subscriptionType } from './subscriptions';
import { PaginatedList, Ticket, TodoItem } from './types';

let queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    userById: {
      type: userType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(root, args) {
        let { id } = fromGlobalId(args.id);
        return users.find(u => u.id === parseInt(id, 10));
      }
    },
    siteStatistics: {
      type: new GraphQLNonNull(siteStatisticsType),
      resolve: () => siteStatistics
    },
    ticketsConnection: {
      type: new GraphQLNonNull(ticketConnection.connectionType),
      args: { status: { type: ticketStatusEnum }, ...connectionArgs },
      async resolve(root, args) {
        return connectionFromArray(
          await tickets.filter(ticket =>
            args.status ? ticket.status === args.status : true
          ),
          args
        );
      }
    },
    tickets: {
      type: new GraphQLNonNull(ticketsPaginatedType),
      args: {
        status: { type: ticketStatusEnum },
        limit: {
          type: new GraphQLNonNull(GraphQLInt)
        },
        offset: {
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      async resolve(_, args, __): Promise<PaginatedList<Ticket>> {
        const ticketsByStatus = tickets.filter(ticket =>
          args.status ? ticket.status === args.status : true
        );

        const offset = parseInt(args.offset, 10);
        const limit = parseInt(args.limit, 10);

        return paginate(offset, limit, await ticketsByStatus);
      }
    },
    todosConnection: {
      type: new GraphQLNonNull(todoConnection.connectionType),
      args: connectionArgs,
      async resolve(root, args, obj) {
        return connectionFromArray(await todoItems.all(), args);
      }
    },
    todos: {
      type: new GraphQLNonNull(todosPaginatedType),
      args: {
        limit: {
          type: new GraphQLNonNull(GraphQLInt)
        },
        offset: {
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      async resolve(_, args, __): Promise<PaginatedList<TodoItem>> {
        const offset = parseInt(args.offset, 10);
        const limit = parseInt(args.limit, 10);

        return paginate(offset, limit, await todoItems.all());
      }
    },
    allTodos: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(todoItemType))
      ),
      async resolve(): Promise<TodoItem[]> {
        return await todoItems.all();
      }
    }
  })
});

export let schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
  subscription: subscriptionType,
  directives: [GraphQLDeferDirective]
});
