import * as React from 'react';
import BicycleClient from 'bicycle/client';
import {connect, ConnectProps} from '../../';
import TodoItem from './TodoItem';
import FilterState from '../shared/FilterState';
import Todo from '../shared/Todo';
import AppChrome from '../shared/components/AppChrome';
import FilterStateRenderProp from '../shared/components/FilterStateRenderProp';
import TodoList from '../shared/components/TodoList';

const ErrorDemonstraction = () => <div>This is never rendered</div>;

const ErrorDemonstractionContainer = connect(
  ErrorDemonstraction,
  () => ({todos: {id: true, ttle: true, completad: true}}),
);

interface EventHandlers {
  addTodo(title: string): void;
  toggleAll(checked: boolean): void;
  toggle(todo: {id: string; completed: boolean}): void;
  destroy(todo: {id: string}): void;
  save(todo: {id: string}, title: string): void;
  clearCompleted(): void;
  fakeMutation(): void;
}
interface State {
  editing: null | string;
}
class TodoApp extends React.Component<
  ConnectProps<{todos: Array<Todo>}, EventHandlers>,
  State
> {
  state = {
    editing: null,
  };

  private readonly _toggleAll = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = event.target.checked;
    this.props.toggleAll(checked);
  };

  private readonly _toggle = (todoToToggle: Todo) => {
    this.props.toggle(todoToToggle);
  };

  private readonly _destroy = (todo: Todo) => {
    this.props.destroy(todo);
  };

  private readonly _edit = (todo: Todo) => {
    this.setState({editing: todo.id});
  };

  private readonly _save = (todoToSave: Todo, text: string) => {
    this.props.save(todoToSave, text);
    this.setState({editing: null});
  };

  private readonly _cancel = () => {
    this.setState({editing: null});
  };

  private readonly _clearCompleted = () => {
    this.props.clearCompleted();
  };

  private readonly _fakeMutation = () => {
    this.props.fakeMutation();
  };

  render() {
    return (
      <AppChrome
        errors={this.props.errors}
        onAddTodo={value => this.props.addTodo(value)}
      >
        <FilterStateRenderProp>{this._renderContent}</FilterStateRenderProp>
        <button
          onClick={this._fakeMutation}
          style={{padding: 20, display: 'block'}}
        >
          Run non existent mutation
        </button>
        <ErrorDemonstractionContainer />
      </AppChrome>
    );
  }

  _renderContent = (nowShowing: FilterState) => {
    const todos = this.props.result.todos;

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
          onToggle={() => this._toggle(todo)}
          onDestroy={() => this._destroy}
          onEdit={() => this._edit(todo)}
          onSave={value => this._save(todo, value)}
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
        onToggleAll={this._toggleAll}
        onClearCompleted={this._clearCompleted}
      >
        {todoItems}
      </TodoList>
    );
  };
}

const TodoAppContainer = connect<{}, {todos: Array<Todo>}, EventHandlers>(
  TodoApp,
  () => ({todos: {id: true, title: true, completed: true}}),
  (client: BicycleClient) => ({
    addTodo(title: string) {
      client.update('Todo.addTodo', {title, completed: false});
    },
    toggleAll(checked: boolean) {
      client.update('Todo.toggleAll', {checked});
    },
    toggle(todo: {id: string; completed: boolean}) {
      client.update(
        'Todo.toggle',
        {id: todo.id, checked: !todo.completed},
        (_mutation, cache) => {
          cache.getObject('Todo', todo.id).set('completed', !todo.completed);
        },
      );
    },
    destroy(todo: {id: string}) {
      client.update('Todo.destroy', {id: todo.id});
    },
    save(todo: {id: string}, title: string) {
      client.update('Todo.save', {id: todo.id, title});
    },
    clearCompleted() {
      client.update('Todo.clearCompleted', {});
    },
    fakeMutation() {
      client.update('Todo.addTodo', {tatle: 'whatever', completed: false});
    },
  }),
);

export default TodoAppContainer;
