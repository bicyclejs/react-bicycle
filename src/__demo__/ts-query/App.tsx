import * as React from 'react';
import BicycleClient from 'bicycle/client';
import {query} from '../../';
import TodoItem, {TodoQuery as TodoItemQuery} from './TodoItem';
import FilterState from '../shared/FilterState';
import AppChrome from '../shared/components/AppChrome';
import FilterStateRenderProp from '../shared/components/FilterStateRenderProp';
import TodoList from '../shared/components/TodoList';
import * as q from '../ts-schema/query';

const TodoQuery = q.Todo.id.merge(TodoItemQuery);
const AppQuery = q.Root.todos(TodoQuery);

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

  private readonly _edit = (todo: typeof TodoQuery.$type) => {
    this.setState({editing: todo.id});
  };

  private readonly _cancel = () => {
    this.setState({editing: null});
  };

  render() {
    return query(AppQuery, (result, client, status) => {
      return (
        <AppChrome
          errors={status.errors}
          onAddTodo={title =>
            client.update(q.Todo.addTodo({title, completed: false}))
          }
        >
          <FilterStateRenderProp>
            {ns => this._renderContent(ns, result, client)}
          </FilterStateRenderProp>
          <button
            onClick={() =>
              client.update(
                q.Todo.addTodo({
                  tatle: 'whatever',
                  completed: false,
                } as any),
              )
            }
            style={{padding: 20, display: 'block'}}
          >
            Run non existent mutation
          </button>
          <ErrorDemonstraction />
        </AppChrome>
      );
    });
  }

  _renderContent = (
    nowShowing: FilterState,
    result: typeof AppQuery.$type,
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
              q.Todo.toggle(
                {id: todo.id, checked: !todo.completed},
                (_mutation, cache) => {
                  cache
                    .getObject('Todo', todo.id)
                    .set('completed', !todo.completed);
                },
              ),
            )
          }
          onDestroy={() => client.update(q.Todo.destroy({id: todo.id}))}
          onEdit={() => this._edit(todo)}
          onSave={title => {
            client.update(q.Todo.save({id: todo.id, title}));
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
          client.update(q.Todo.toggleAll({checked: e.target.checked}))
        }
        onClearCompleted={() => client.update(q.Todo.clearCompleted({}))}
      >
        {todoItems}
      </TodoList>
    );
  };
}
