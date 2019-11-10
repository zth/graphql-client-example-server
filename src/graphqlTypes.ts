import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLID,
  GraphQLUnionType,
  GraphQLList
} from "graphql";

import { GraphQLDateTime } from "graphql-iso-date";

import {
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
  connectionDefinitions,
  connectionFromArray
} from "graphql-relay";

import { users, workingGroups, data } from "./db";
import { paginate } from "./utils";

// @ts-ignore
export let { nodeInterface, nodeField } = nodeDefinitions(
  (globalId: string) => {
    let { type, id } = fromGlobalId(globalId);
    // @ts-ignore
    let source = data[type];

    if (source) {
      return source.find(
        (item: { id: number }) => item.id === parseInt(id, 10)
      );
    }

    return null;
  },
  // @ts-ignore
  (obj: { type: string }) => {
    switch (obj.type) {
      case "User":
        return userType;
      case "WorkingGroup":
        return workingGroupType;
      case "SiteStatistics":
        return siteStatisticsType;
      case "Ticket":
        return ticketType;
      case "TodoItem":
        return todoItemType;
    }
  }
);

const paginationDefinitions = (objectType: GraphQLObjectType, name: string) =>
  new GraphQLObjectType({
    name,
    fields: () => ({
      total: { type: new GraphQLNonNull(GraphQLInt) },
      hasNextPage: { type: new GraphQLNonNull(GraphQLBoolean) },
      results: {
        type: new GraphQLNonNull(
          new GraphQLList(new GraphQLNonNull(objectType))
        )
      }
    })
  });

export let userType: GraphQLObjectType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: globalIdField(),
    dbId: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: obj => obj.id
    },
    avatarUrl: { type: GraphQLString },
    fullName: { type: new GraphQLNonNull(GraphQLString) }
  }),
  interfaces: [nodeInterface]
});

export let userConnection = connectionDefinitions({ nodeType: userType });

export let workingGroupType: GraphQLObjectType = new GraphQLObjectType({
  name: "WorkingGroup",
  fields: () => ({
    id: globalIdField(),
    dbId: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: obj => obj.id
    },
    name: { type: new GraphQLNonNull(GraphQLString) },
    membersConnection: {
      type: userConnection.connectionType,
      resolve(obj, args) {
        return connectionFromArray(
          obj.memberIds
            .map((id: number) => users.find(u => u.id === id))
            .filter(Boolean),
          args
        );
      }
    },
    members: {
      args: {
        limit: {
          type: new GraphQLNonNull(GraphQLInt)
        },
        offset: {
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      type: new GraphQLList(userType),
      resolve(obj, args) {
        return paginate(
          args.offset,
          args.limit,
          obj.memberIds
            .map((id: number) => users.find(u => u.id === id))
            .filter(Boolean)
        );
      }
    }
  }),
  interfaces: [nodeInterface]
});

export let assigneeUnionType = new GraphQLUnionType({
  name: "AssigneeType",
  types: [userType, workingGroupType],
  resolveType(value) {
    if (value.type === "User") {
      return userType;
    } else if (value.type === "WorkingGroup") {
      return workingGroupType;
    }
  }
});

export let siteStatisticsType: GraphQLObjectType = new GraphQLObjectType({
  name: "SiteStatistics",
  fields: () => ({
    id: globalIdField(),
    weeklySales: { type: new GraphQLNonNull(GraphQLFloat) },
    weeklyOrders: { type: new GraphQLNonNull(GraphQLInt) },
    currentVisitorsOnline: { type: new GraphQLNonNull(GraphQLInt) }
  }),
  interfaces: [nodeInterface]
});

export let ticketStatusEnum = new GraphQLEnumType({
  name: "TicketStatus",
  values: {
    Done: { value: "Done" },
    Progress: { value: "Progress" },
    OnHold: { value: "OnHold" },
    Rejected: { value: "Rejected" }
  }
});

export let ticketType: GraphQLObjectType = new GraphQLObjectType({
  name: "Ticket",
  fields: () => ({
    id: globalIdField(),
    dbId: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: obj => obj.id
    },
    assignee: {
      type: assigneeUnionType,
      resolve: obj => {
        if (obj.assignee == null) {
          return null;
        }

        switch (obj.assignee.type) {
          case "User":
            return users.find(u => u.id === obj.assignee.id);
          case "WorkingGroup":
            return workingGroups.find(wg => wg.id === obj.assignee.id);
          default:
            return null;
        }
      }
    },
    status: { type: new GraphQLNonNull(ticketStatusEnum) },
    subject: { type: new GraphQLNonNull(GraphQLString) },
    lastUpdated: {
      type: GraphQLDateTime,
      resolve: obj => (obj.lastUpdated ? new Date(obj.lastUpdated) : null)
    },
    trackingId: { type: new GraphQLNonNull(GraphQLString) }
  }),
  interfaces: [nodeInterface]
});

export let ticketConnection = connectionDefinitions({ nodeType: ticketType });

export let ticketsPaginatedType: GraphQLObjectType = paginationDefinitions(
  ticketType,
  "TicketsPaginated"
);

export let todoItemType: GraphQLObjectType = new GraphQLObjectType({
  name: "TodoItem",
  fields: () => ({
    id: globalIdField(),
    dbId: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: obj => obj.id
    },
    completed: { type: GraphQLBoolean },
    text: { type: new GraphQLNonNull(GraphQLString) }
  }),
  interfaces: [nodeInterface]
});

export let todoConnection = connectionDefinitions({ nodeType: todoItemType });

export let todosPaginatedType: GraphQLObjectType = paginationDefinitions(
  todoItemType,
  "TodosPaginated"
);
