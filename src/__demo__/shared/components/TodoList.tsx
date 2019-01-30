import * as React from 'react';
import TodoFooter from './TodoFooter';
import TestID from '../TestID';

interface Props {
  activeCount: number;
  completedCount: number;
  children: React.ReactNode;
  onClearCompleted: () => void;
  onToggleAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function TodoList(props: Props) {
  if (props.activeCount === 0 && props.completedCount === 0) {
    return null;
  }
  return (
    <React.Fragment>
      <section className="main">
        <input
          className="toggle-all"
          type="checkbox"
          onChange={props.onToggleAll}
          checked={props.activeCount === 0}
        />
        <ul className="todo-list" data-testid={TestID.TodoList}>
          {props.children}
        </ul>
      </section>
      <TodoFooter
        activeCount={props.activeCount}
        completedCount={props.completedCount}
        onClearCompleted={props.onClearCompleted}
      />
    </React.Fragment>
  );
}
