import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLIncludeDirective,
  GraphQLSkipDirective,
  GraphQLDeferDirective,
  GraphQLStreamDirective
} from 'graphql';

import { connectionArgs, fromGlobalId } from 'graphql-relay';

import { siteStatistics, tickets, todoItems, users } from './db';

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
      resolve(root, args) {
        return tickets.filterConnection(
          ticket => (args.status ? ticket.status === args.status : true),
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
      async resolve(_, args, __) {
        const offset = parseInt(args.offset, 10);
        const limit = parseInt(args.limit, 10);
        return tickets.filterPaginated(
          ticket => (args.status ? ticket.status === args.status : true),
          offset,
          limit
        );
      }
    },
    todosConnection: {
      type: new GraphQLNonNull(todoConnection.connectionType),
      args: connectionArgs,
      resolve(root, args, obj) {
        return todoItems.allConnection(args);
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
      async resolve(_, args, __) {
        const offset = parseInt(args.offset, 10);
        const limit = parseInt(args.limit, 10);
        return todoItems.allPaginated(offset, limit);
      }
    },
    allTodos: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(todoItemType))
      ),
      resolve() {
        return todoItems.all();
      }
    }
  })
});

export let schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
  subscription: subscriptionType,
  directives: [
    GraphQLIncludeDirective,
    GraphQLSkipDirective,
    GraphQLDeferDirective,
    GraphQLStreamDirective
  ]
});
