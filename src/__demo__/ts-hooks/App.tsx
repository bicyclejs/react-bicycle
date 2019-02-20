import * as React from 'react';
import {useQuery, useClient} from '../../';
import TodoItem, {TodoQuery as TodoItemQuery} from './TodoItem';
import FilterState from '../shared/FilterState';
import AppChrome from '../shared/components/AppChrome';
import TodoList from '../shared/components/TodoList';
import * as q from '../ts-schema/query';
import useFilterState from '../shared/components/useFilterState';

const TodoQuery = q.Todo.id.merge(TodoItemQuery);
const AppQuery = q.Root.todos(TodoQuery);

const ErrorDemonstraction = () => {
  const result = useQuery({
    todos: {id: true, ttle: true, completad: true},
  } as any);
  if (result.errored) {
    return result.render();
  }
  return null;
};

export default function TodoApp() {
  const [editing, setEditing] = React.useState<string | null>(null);
  const nowShowing = useFilterState();
  const client = useClient();
  const qu = useQuery(AppQuery);
  if (qu.loading) {
    return qu.render();
  }
  if (qu.errored) {
    return qu.render();
  }
  const {todos} = qu.result;

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
        editing={editing === todo.id}
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
        onEdit={() => setEditing(todo.id)}
        onSave={title => {
          client.update(q.Todo.save({id: todo.id, title}));
          setEditing(null);
        }}
        onCancel={() => setEditing(null)}
      />
    );
  });

  const activeCount = todos.reduce(
    (accum, todo) => (todo.completed ? accum : accum + 1),
    0,
  );

  const completedCount = todos.length - activeCount;

  return (
    <AppChrome
      errors={[]}
      onAddTodo={title =>
        client.update(q.Todo.addTodo({title, completed: false}))
      }
    >
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
}
