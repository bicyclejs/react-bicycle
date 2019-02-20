// generated by ts-bicycle
// do not edit by hand

import {GetOptimisticValue} from 'bicycle/client/optimistic';

export {GetOptimisticValue};

export interface RootOptimisticUpdaters {}
export interface RootCache {
  get(name: 'todos'): void | TodoCache[];
  get(name: 'todoById', args: {id: string}): void | TodoCache;
  set(name: 'todos', value: TodoCache[]): this;
  set(name: 'todoById', args: {id: string}, value: TodoCache): this;
  getObject(typeName: 'Todo', id: string): TodoCache;
}
export interface TodoOptimisticUpdaters {
  addTodo?: (
    mutation: {
      objectName: 'Todo';
      methodName: 'addTodo';
      args: {completed: boolean; title: string};
    },
    cache: RootCache,
    getOptimisticValue: GetOptimisticValue,
  ) => any;
  clearCompleted?: (
    mutation: {objectName: 'Todo'; methodName: 'clearCompleted'; args: {}},
    cache: RootCache,
    getOptimisticValue: GetOptimisticValue,
  ) => any;
  destroy?: (
    mutation: {objectName: 'Todo'; methodName: 'destroy'; args: {id: string}},
    cache: RootCache,
    getOptimisticValue: GetOptimisticValue,
  ) => any;
  save?: (
    mutation: {
      objectName: 'Todo';
      methodName: 'save';
      args: {id: string; title: string};
    },
    cache: RootCache,
    getOptimisticValue: GetOptimisticValue,
  ) => any;
  toggle?: (
    mutation: {
      objectName: 'Todo';
      methodName: 'toggle';
      args: {checked: boolean; id: string};
    },
    cache: RootCache,
    getOptimisticValue: GetOptimisticValue,
  ) => any;
  toggleAll?: (
    mutation: {
      objectName: 'Todo';
      methodName: 'toggleAll';
      args: {checked: boolean};
    },
    cache: RootCache,
    getOptimisticValue: GetOptimisticValue,
  ) => any;
}
export interface TodoCache {
  get(name: 'id'): void | string;
  get(name: 'title'): void | string;
  get(name: 'completed'): void | boolean;
  set(name: 'id', value: string): this;
  set(name: 'title', value: string): this;
  set(name: 'completed', value: boolean): this;
}
export default interface OptimisticUpdaters {
  Root?: RootOptimisticUpdaters;
  Todo?: TodoOptimisticUpdaters;
}
