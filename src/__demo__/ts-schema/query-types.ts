// generated by ts-bicycle
// do not edit by hand

import {
  BaseRootQuery,
  addField,
  stringify,
  merge,
  BaseQuery,
  Mutation,
} from 'bicycle/typed-helpers/query';
import {RootCache, GetOptimisticValue} from './optimistic';

export class RootQuery<TResult = {}> extends BaseRootQuery<TResult> {
  // fields
  todos<TTodo>(Todo: TodoQuery<TTodo>): RootQuery<TResult & {todos: TTodo[]}> {
    return new RootQuery(addField(this._query, 'todos', (Todo as any)._query));
  }
  todoById<TTodo>(
    args: {id: string},
    Todo: TodoQuery<TTodo>,
  ): RootQuery<TResult & {todoById: TTodo}> {
    return new RootQuery(
      addField(
        this._query,
        args === undefined ? 'todoById' : 'todoById(' + stringify(args) + ')',
        (Todo as any)._query,
      ),
    );
  }

  merge<TOther>(other: RootQuery<TOther>): RootQuery<TResult & TOther> {
    return new RootQuery(merge(this._query, other._query));
  }

  // mutations
}
export class TodoQuery<TResult = {}> extends BaseQuery<TResult> {
  // fields
  get id(): TodoQuery<TResult & {id: string}> {
    return new TodoQuery(addField(this._query, 'id', true));
  }
  get title(): TodoQuery<TResult & {title: string}> {
    return new TodoQuery(addField(this._query, 'title', true));
  }
  get completed(): TodoQuery<TResult & {completed: boolean}> {
    return new TodoQuery(addField(this._query, 'completed', true));
  }

  merge<TOther>(other: TodoQuery<TOther>): TodoQuery<TResult & TOther> {
    return new TodoQuery(merge(this._query, other._query));
  }

  // mutations
  addTodo(
    args: {completed: boolean; title: string},
    optimisticUpdate?: (
      mutation: {
        objectName: 'Todo';
        methodName: 'addTodo';
        args: {completed: boolean; title: string};
      },
      cache: RootCache,
      getOptimisticValue: GetOptimisticValue,
    ) => any,
  ): Mutation<{id: string}> {
    return new Mutation('Todo.addTodo', args, optimisticUpdate as any);
  }
  clearCompleted(
    args: {},
    optimisticUpdate?: (
      mutation: {objectName: 'Todo'; methodName: 'clearCompleted'; args: {}},
      cache: RootCache,
      getOptimisticValue: GetOptimisticValue,
    ) => any,
  ): Mutation<void> {
    return new Mutation('Todo.clearCompleted', args, optimisticUpdate as any);
  }
  destroy(
    args: {id: string},
    optimisticUpdate?: (
      mutation: {objectName: 'Todo'; methodName: 'destroy'; args: {id: string}},
      cache: RootCache,
      getOptimisticValue: GetOptimisticValue,
    ) => any,
  ): Mutation<void> {
    return new Mutation('Todo.destroy', args, optimisticUpdate as any);
  }
  save(
    args: {id: string; title: string},
    optimisticUpdate?: (
      mutation: {
        objectName: 'Todo';
        methodName: 'save';
        args: {id: string; title: string};
      },
      cache: RootCache,
      getOptimisticValue: GetOptimisticValue,
    ) => any,
  ): Mutation<void> {
    return new Mutation('Todo.save', args, optimisticUpdate as any);
  }
  toggle(
    args: {checked: boolean; id: string},
    optimisticUpdate?: (
      mutation: {
        objectName: 'Todo';
        methodName: 'toggle';
        args: {checked: boolean; id: string};
      },
      cache: RootCache,
      getOptimisticValue: GetOptimisticValue,
    ) => any,
  ): Mutation<void> {
    return new Mutation('Todo.toggle', args, optimisticUpdate as any);
  }
  toggleAll(
    args: {checked: boolean},
    optimisticUpdate?: (
      mutation: {
        objectName: 'Todo';
        methodName: 'toggleAll';
        args: {checked: boolean};
      },
      cache: RootCache,
      getOptimisticValue: GetOptimisticValue,
    ) => any,
  ): Mutation<void> {
    return new Mutation('Todo.toggleAll', args, optimisticUpdate as any);
  }
}
