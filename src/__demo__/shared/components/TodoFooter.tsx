import * as React from 'react';
import {pluralize, classNames} from '../utils';
import FilterState from '../FilterState';
import useFilterState from './useFilterState';

export interface Props {
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}
export default function TodoFooter(props: Props) {
  const nowShowing = useFilterState();
  const activeTodoWord = pluralize(props.activeCount, 'item');
  let clearButton = null;

  if (props.completedCount > 0) {
    clearButton = (
      <button
        className="clear-completed"
        type="button"
        onClick={props.onClearCompleted}
      >
        Clear completed
      </button>
    );
  }

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{props.activeCount}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={classNames({
              selected: nowShowing === FilterState.ALL_TODOS,
            })}
          >
            All
          </a>
        </li>{' '}
        <li>
          <a
            href="#/active"
            className={classNames({
              selected: nowShowing === FilterState.ACTIVE_TODOS,
            })}
          >
            Active
          </a>
        </li>{' '}
        <li>
          <a
            href="#/completed"
            className={classNames({
              selected: nowShowing === FilterState.COMPLETED_TODOS,
            })}
          >
            Completed
          </a>
        </li>
      </ul>
      {clearButton}
    </footer>
  );
}
