import * as React from 'react';
import TodoItemBase from '../shared/components/TodoItemBase';
import * as q from '../ts-schema/query';

export const TodoQuery = q.Todo.title.completed;
export interface Props {
  todo: typeof TodoQuery.$type;
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
