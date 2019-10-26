import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt,
  GraphQLID
} from "graphql";

import {
  connectionArgs,
  connectionFromArray,
  fromGlobalId
} from "graphql-relay";

import { siteStatistics, tickets, todoItems, users } from "./db";
import { paginate } from "./utils";

import {
  siteStatisticsType,
  ticketStatusEnum,
  ticketConnection,
  todoConnection,
  nodeField,
  todoItemType,
  ticketType,
  userType
} from "./graphqlTypes";

import { mutationType } from "./mutations";
import { subscriptionType } from "./subscriptions";

let queryType = new GraphQLObjectType({
  name: "Query",
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
        return connectionFromArray(
          tickets.filter(ticket =>
            args.status ? ticket.status === args.status : true
          ),
          args
        );
      }
    },
    tickets: {
      type: new GraphQLNonNull(new GraphQLList(ticketType)),
      args: {
        status: { type: ticketStatusEnum },
        limit: {
          type: new GraphQLNonNull(GraphQLInt)
        },
        offset: {
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      resolve(root, args, obj) {
        const ticketsByStatus = tickets.filter(ticket =>
          args.status ? ticket.status === args.status : true
        );

        let offset = parseInt(args.offset, 10);
        let limit = parseInt(args.limit, 10);

        return paginate(offset, limit, ticketsByStatus);
      }
    },
    todosConnection: {
      type: new GraphQLNonNull(todoConnection.connectionType),
      args: connectionArgs,
      resolve(root, args, obj) {
        return connectionFromArray(todoItems, args);
      }
    },
    todos: {
      type: new GraphQLNonNull(new GraphQLList(todoItemType)),
      args: {
        limit: {
          type: new GraphQLNonNull(GraphQLInt)
        },
        offset: {
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      resolve(root, args, obj) {
        let offset = parseInt(args.offset, 10);
        let limit = parseInt(args.limit, 10);

        return paginate(offset, limit, todoItems);
      }
    }
  })
});

export let schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
  subscription: subscriptionType
});
