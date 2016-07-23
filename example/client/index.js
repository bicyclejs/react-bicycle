import React from 'react';
import ReactDOM from 'react-dom';
import BicycleClient from 'bicycle/client';
import {Provider, connect} from '../../src';
import TodoFooter from './todo-footer';
import TodoItem from './todo-item';
import {ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS} from './constants.js';

const ENTER_KEY = 13;

const ErrorDemonstraction = React.createClass({
  render() {
    return <div>This is never rendered</div>;
  },
});

const ErrorDemonstractionContainer = connect(
  () => ({todos: {id: true, ttle: true, completad: true}}),
)(ErrorDemonstraction);

const TodoApp = React.createClass({
  getInitialState() {
    return {
      editing: null,
      newTodo: '',
    };
  },

  handleChange(event) {
    this.setState({newTodo: event.target.value});
  },

  handleNewTodoKeyDown(event) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const val = this.state.newTodo.trim();

    if (val) {
      this.props.addTodo(val);
      this.setState({newTodo: ''});
    }
  },

  toggleAll(event) {
    const checked = event.target.checked;
    this.props.toggleAll(checked);
  },

  toggle(todoToToggle) {
    this.props.toggle(todoToToggle);
  },

  destroy(todo) {
    this.props.destroy(todo);
  },

  edit(todo) {
    this.setState({editing: todo.id});
  },

  save(todoToSave, text) {
    this.props.save(todoToSave, text);
    this.setState({editing: null});
  },

  cancel() {
    this.setState({editing: null});
  },

  clearCompleted() {
    this.props.clearCompleted();
  },

  _fakeMutation() {
    this.props.fakeMutation();
  },

  render() {
    let content = null;
    try {
      content = this._renderContent();
    } catch (ex) {
      content = <div>Could not render todo items: {ex.message}</div>;
    }

    return (
      <div>
        <header className="header">
          <h1>todos</h1>
          {this.props.errors.map((error, i) => {
            return <div key={i} style={{background: 'red', color: 'white', padding: 50, fontSize: 20}}>{error}</div>;
          })}
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            value={this.state.newTodo}
            onKeyDown={this.handleNewTodoKeyDown}
            onChange={this.handleChange}
            autoFocus={true}
          />
        </header>
        {content}
        <button onClick={this._fakeMutation} style={{padding: 20, display: 'block'}}>
          Run non existent mutation
        </button>
        <ErrorDemonstractionContainer />
      </div>
    );
  },
  _renderContent() {
    let nowShowing;
    switch (location.hash) {
      case '#/completed':
        nowShowing = COMPLETED_TODOS;
        break;
      case '#/active':
        nowShowing = ACTIVE_TODOS;
        break;
      default:
        nowShowing = ALL_TODOS;
        break;
    }
    let footer;
    let main;
    const todos = this.props.todos;

    const shownTodos = todos.filter((todo) => {
      switch (nowShowing) {
        case ACTIVE_TODOS:
          return !todo.completed;
        case COMPLETED_TODOS:
          return todo.completed;
        default:
          return true;
      }
    }, this);

    const todoItems = shownTodos.map(function (todo) {
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={this.toggle.bind(this, todo)}
          onDestroy={this.destroy.bind(this, todo)}
          onEdit={this.edit.bind(this, todo)}
          editing={this.state.editing === todo.id}
          onSave={this.save.bind(this, todo)}
          onCancel={this.cancel}
        />
      );
    }, this);

    const activeTodoCount = todos.reduce((accum, todo) => {
      return todo.completed ? accum : accum + 1;
    }, 0);

    const completedCount = todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer =
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={nowShowing}
          onClearCompleted={this.clearCompleted}
        />;
    }

    if (todos.length) {
      main = (
        <section className="main">
          <input
            className="toggle-all"
            type="checkbox"
            onChange={this.toggleAll}
            checked={activeTodoCount === 0}
          />
          <ul className="todo-list">
            {todoItems}
          </ul>
        </section>
      );
    }
    return (
      <div>
        {main}
        {footer}
      </div>
    );
  },
});

const TodoAppContainer = connect(
  () => ({todos: {id: true, title: true, completed: true}}),
  (client) => ({
    addTodo(title) {
      client.update('Todo.addTodo', {title, completed: false});
    },
    toggleAll(checked) {
      client.update('Todo.toggleAll', {checked});
    },
    toggle(todo) {
      client.update('Todo.toggle', {id: todo.id, checked: !todo.completed});
    },
    destroy(todo) {
      client.update('Todo.destroy', {id: todo.id});
    },
    save(todo, title) {
      client.update('Todo.destroy', {id: todo.id, title});
    },
    clearCompleted() {
      client.update('Todo.clearCompleted', {});
    },
    fakeMutation() {
      client.update('Todo.addTodo', {tatle: 'whatever', completed: false});
    },
  })
)(TodoApp);

const client = new BicycleClient();
ReactDOM.render(
  <Provider client={client}><TodoAppContainer /></Provider>,
  document.getElementsByClassName('todoapp')[0]
);
