// this file is to simulate a database, its content probably isn't very interesting.

import {uuid} from './utils';

const LATENCY = 1000;

const DEFAULT = [
  {id: uuid(), title: 'Build Bicycle', completed: false},
  {id: uuid(), title: 'Create an example', completed: false},
];
let todos: typeof DEFAULT = JSON.parse(JSON.stringify(DEFAULT));

export function reset() {
  todos = JSON.parse(JSON.stringify(DEFAULT));
}

export async function addTodo(todo: any) {
  await new Promise(resolve => setTimeout(resolve, LATENCY));
  todo = {id: uuid(), title: todo.title, completed: todo.completed};
  todos.unshift(todo);
  return todo.id;
}

export async function toggleAll(checked: boolean) {
  await new Promise(resolve => setTimeout(resolve, LATENCY));
  todos.forEach(todo => {
    todo.completed = checked;
  });
}

export async function toggle(id: string, checked: boolean) {
  await new Promise(resolve => setTimeout(resolve, LATENCY));
  todos.filter(t => t.id === id).forEach(todo => (todo.completed = checked));
}

export async function destroy(id: string) {
  await new Promise(resolve => setTimeout(resolve, LATENCY));
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      todos.splice(i, 1);
    }
  }
}

export async function setTitle(id: string, title: string) {
  await new Promise(resolve => setTimeout(resolve, LATENCY));
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      todos[i].title = title;
    }
  }
}

export async function clearCompleted() {
  await new Promise(resolve => setTimeout(resolve, LATENCY));
  todos = todos.filter(t => !t.completed);
}

export async function getTodos() {
  await new Promise(resolve => setTimeout(resolve, LATENCY));
  return JSON.parse(JSON.stringify(todos));
}

export async function getTodo(id: string) {
  await new Promise(resolve => setTimeout(resolve, LATENCY));
  return JSON.parse(JSON.stringify(todos.filter(t => t.id === id)[0] || null));
}
