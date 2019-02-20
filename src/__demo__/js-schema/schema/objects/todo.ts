import {addTodo, toggleAll, toggle, destroy, setTitle, clearCompleted} from '../../../shared/data';

export default {
  name: 'Todo',
  fields: {
    id: 'id',
    title: 'string',
    completed: 'boolean',
  },
  mutations: {
    addTodo: {
      type: {id: 'id'},
      args: {title: 'string', completed: 'boolean'},
      resolve({title, completed}: {title: string, completed: boolean}, {user}: any) {
        return addTodo({title, completed}).then(id => ({id}));
      },
    },
    toggleAll: {
      args: {checked: 'boolean'},
      resolve({checked}: {checked: boolean}) {
        return toggleAll(checked);
      },
    },
    toggle: {
      args: {id: 'id', checked: 'boolean'},
      resolve({id, checked}: {id: string, checked: boolean}, {user}: any) {
        return toggle(id, checked);
      },
    },
    destroy: {
      args: {id: 'id'},
      resolve({id}: {id: string}, {user}: any) {
        return destroy(id);
      },
    },
    save: {
      args: {id: 'id', title: 'string'},
      resolve({id, title}: {id: string, title: string}, {user}: any) {
        return setTitle(id, title);
      },
    },
    clearCompleted: {
      resolve(_args: {}, {user}: any) {
        return clearCompleted();
      },
    },
  },
};
