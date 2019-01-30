import BaseObject from 'bicycle/BaseObject';
import {
  addTodo,
  toggleAll,
  toggle,
  destroy,
  clearCompleted,
  setTitle,
} from '../../shared/data';

export class Todo extends BaseObject<{
  id: string;
  title: string;
  completed: boolean;
}> {
  $auth = {
    public: ['id', 'title', 'completed'],
  };
  value(): string {
    return 'Hello World';
  }

  static $auth = {
    public: [
      'addTodo',
      'toggleAll',
      'toggle',
      'destroy',
      'save',
      'clearCompleted',
    ],
  };

  static async addTodo({
    title,
    completed,
  }: {
    title: string;
    completed: boolean;
  }): Promise<{id: string}> {
    return {id: await addTodo({title, completed})};
  }

  static async toggleAll({checked}: {checked: boolean}) {
    await toggleAll(checked);
  }

  static async toggle({id, checked}: {id: string; checked: boolean}) {
    await toggle(id, checked);
  }

  static async destroy({id}: {id: string}) {
    await destroy(id);
  }

  static async save({id, title}: {id: string; title: string}) {
    await setTitle(id, title);
  }

  static async clearCompleted(_args: {}) {
    await clearCompleted();
  }
}
