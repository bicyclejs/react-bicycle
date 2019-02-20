import BaseObject from 'bicycle/BaseObject';
import {Todo} from './Todo';
import {getTodos, getTodo} from '../../shared/data';

export class Root extends BaseObject<{}> {
  $auth = {
    public: ['todos', 'todoById'],
  };

  async todos(): Promise<Todo[]> {
    return (await getTodos()).map((t: any) => new Todo(t));
  }

  async todoById({id}: {id: string}): Promise<Todo> {
    return new Todo(await getTodo(id));
  }
}
