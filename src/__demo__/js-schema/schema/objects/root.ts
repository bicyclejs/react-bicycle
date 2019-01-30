import {getTodo, getTodos} from '../../../shared/data';

export default {
  name: 'Root',
  fields: {
    todoById: {
      type: 'Todo',
      args: {id: 'string'},
      resolve(_root: any, {id}: {id: string}, {user}: any) {
        return getTodo(id);
      },
    },
    todos: {
      type: 'Todo[]',
      resolve(_root: any, _args: {}, {user}: any) {
        return getTodos();
      },
    },
  },
};
