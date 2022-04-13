import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';
import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLFieldConfig
} from 'graphql';
import { todoItemType, todoConnection } from './graphqlTypes';
import { todoItems } from './db';
import { TodoItem, TodoUpdateInputType } from './types';

/** relay style mutations */
let addTodoItemMutation = mutationWithClientMutationId({
  name: 'AddTodoItem',
  inputFields: () => ({
    text: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }),
  outputFields: () => ({
    addedTodoItem: {
      type: todoItemType
    },
    addedTodoItemEdge: {
      type: todoConnection.edgeType
    }
  }),
  mutateAndGetPayload: ({ text }) => {
    return addTodo(text);
  }
});

let addTodo = async (text: string) => {
  let lastTodoItem = (await todoItems.all()).pop();
  let nextIndex = lastTodoItem ? lastTodoItem.id + 1 : 1;

  let newTodo: TodoItem = {
    id: nextIndex,
    type: 'TodoItem',
    text: text,
    completed: false
  };

  await todoItems.push(newTodo);
  return {
    addedTodoItem: newTodo,
    addedTodoItemEdge: {
      cursor: '',
      node: newTodo
    }
  };
};

let updateTodoItemMutation = mutationWithClientMutationId({
  name: 'UpdateTodoItem',
  inputFields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    text: {
      type: new GraphQLNonNull(GraphQLString)
    },
    completed: {
      type: new GraphQLNonNull(GraphQLBoolean)
    }
  }),
  outputFields: () => ({
    updatedTodoItem: {
      type: todoItemType
    }
  }),
  mutateAndGetPayload: ({ text, completed, id }) => {
    return updateTodo(id, text, completed);
  }
});

let updateTodo = async (id: string, text: string, completed: boolean) => {
  let { type, id: todoItemId } = fromGlobalId(id);
  let targetTodoItem = await todoItems.find(t => t.id === parseInt(todoItemId, 10));

  if (!targetTodoItem || type !== 'TodoItem') {
    return {
      updatedTodoItem: null
    };
  }

  targetTodoItem.text = text;
  targetTodoItem.completed = completed;

  return {
    updatedTodoItem: targetTodoItem
  };
};

let deleteTodoItemMutation = mutationWithClientMutationId({
  name: 'DeleteTodoItem',
  inputFields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  }),
  outputFields: () => ({
    deletedTodoItemId: {
      type: GraphQLID
    }
  }),
  mutateAndGetPayload: ({ id }) => {
    return deleteTodo(id);
  }
});

let deleteTodo = async (id: string) => {
  let { type, id: todoItemId } = fromGlobalId(id);
  let targetTodoItemIndex = await todoItems.findIndex(
    t => t.id === parseInt(todoItemId, 10)
  );

  if (targetTodoItemIndex === -1 || type !== 'TodoItem') {
    return {
      deleteTodoItemId: null
    };
  }

  await todoItems.splice(targetTodoItemIndex, 1);

  return {
    deletedTodoItemId: id
  };
};

/** apollo style */
let addTodoSimple: GraphQLFieldConfig<any, any, any> = {
  type: new GraphQLNonNull(todoItemType),
  args: {
    text: { type: new GraphQLNonNull(GraphQLString) }
  },
  async resolve(_, { text }) {
    return (await addTodo(text)).addedTodoItem;
  }
};

let updateTodoSimple: GraphQLFieldConfig<any, any, any> = {
  type: todoItemType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    text: { type: new GraphQLNonNull(GraphQLString) },
    completed: { type: GraphQLBoolean }
  },
  async resolve(_, { id, text, completed }: TodoUpdateInputType) {
    return (await updateTodo(id, text, completed)).updatedTodoItem;
  }
};

let deleteTodoSimple: GraphQLFieldConfig<any, any, any> = {
  type: new GraphQLObjectType({
    name: 'DeleteTodoSimple',
    fields: () => ({
      deletedTodoItemId: {
        type: new GraphQLNonNull(GraphQLID)
      }
    })
  }),
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) }
  },
  resolve(_, { id }) {
    return deleteTodo(id);
  }
};

export let mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addTodoItem: addTodoItemMutation,
    updateTodoItem: updateTodoItemMutation,
    deleteTodoItem: deleteTodoItemMutation,
    // apollo style
    addTodoSimple,
    updateTodoSimple,
    deleteTodoSimple
  })
});
