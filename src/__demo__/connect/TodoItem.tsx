import * as React from 'react';
import Todo from '../shared/Todo';
import TodoItemBase from '../shared/components/TodoItemBase';

export interface Props {
  todo: Todo;
  editing: boolean;
  onSave: (value: string) => void;
  onCancel: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  onToggle: () => void;
}
export default function TodoItem(props: Props) {
  return (
    <TodoItemBase
      title={props.todo.title}
      completed={props.todo.completed}
      editing={props.editing}
      onSave={props.onSave}
      onCancel={props.onCancel}
      onDestroy={props.onDestroy}
      onEdit={props.onEdit}
      onToggle={props.onToggle}
    />
  );
}
