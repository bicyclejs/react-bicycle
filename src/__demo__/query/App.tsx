import * as React from 'react';
import BicycleClient from 'bicycle/client';
import {query} from '../../';
import TodoItem from './TodoItem';
import FilterState from '../shared/FilterState';
import Todo from '../shared/Todo';
import AppChrome from '../shared/components/AppChrome';
import FilterStateRenderProp from '../shared/components/FilterStateRenderProp';
import TodoList from '../shared/components/TodoList';

const ErrorDemonstraction = () =>
  query({todos: {id: true, ttle: true, completad: true}} as any, () => (
    <div>This is never rendered</div>
  ));

interface State {
  editing: null | string;
}
export default class TodoApp extends React.Component<{}, State> {
  state = {
    editing: null,
  };

  private readonly _edit = (todo: Todo) => {
    this.setState({editing: todo.id});
  };

  private readonly _cancel = () => {
    this.setState({editing: null});
  };

  render() {
    return query(
      {todos: {id: true, title: true, completed: true}} as any,
      (result: any, client, status) => {
        return (
          <AppChrome
            errors={status.errors}
            onAddTodo={title =>
              client.update('Todo.addTodo', {title, completed: false})
            }
          >
            <FilterStateRenderProp>
              {ns => this._renderContent(ns, result, client)}
            </FilterStateRenderProp>
            <button
              onClick={() =>
                client.update('Todo.addTodo', {
                  tatle: 'whatever',
                  completed: false,
                })
              }
              style={{padding: 20, display: 'block'}}
            >
              Run non existent mutation
            </button>
            <ErrorDemonstraction />
          </AppChrome>
        );
      },
    );
  }

  _renderContent = (
    nowShowing: FilterState,
    result: {todos: Todo[]},
    client: BicycleClient,
  ) => {
    const todos = result.todos;

    const shownTodos = todos.filter(todo => {
      switch (nowShowing) {
        case FilterState.ACTIVE_TODOS:
          return !todo.completed;
        case FilterState.COMPLETED_TODOS:
          return todo.completed;
        default:
          return true;
      }
    });

    const todoItems = shownTodos.map(todo => {
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          editing={this.state.editing === todo.id}
          onToggle={() =>
            client.update(
              'Todo.toggle',
              {id: todo.id, checked: !todo.completed},
              (_mutation, cache) => {
                cache
                  .getObject('Todo', todo.id)
                  .set('completed', !todo.completed);
              },
            )
          }
          onDestroy={() => client.update('Todo.destroy', {id: todo.id})}
          onEdit={() => this._edit(todo)}
          onSave={title => {
            client.update('Todo.save', {id: todo.id, title});
            this.setState({editing: null});
          }}
          onCancel={this._cancel}
        />
      );
    });

    const activeCount = todos.reduce(
      (accum, todo) => (todo.completed ? accum : accum + 1),
      0,
    );

    const completedCount = todos.length - activeCount;

    return (
      <TodoList
        activeCount={activeCount}
        completedCount={completedCount}
        onToggleAll={e =>
          client.update('Todo.toggleAll', {checked: e.target.checked})
        }
        onClearCompleted={() => client.update('Todo.clearCompleted', {})}
      >
        {todoItems}
      </TodoList>
    );
  };
}
