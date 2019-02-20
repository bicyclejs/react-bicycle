import * as React from 'react';
import {ENTER_KEY, ESCAPE_KEY} from '../constants';
import TestID from '../TestID';

export interface Props {
  onAddTodo: (value: string) => void;
}
export interface State {
  value: string;
}
export default class NewTodo extends React.Component<Props, State> {
  state = {
    value: '',
  };

  private readonly _handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    this.setState({value: event.target.value});
  };

  private readonly _handleNewTodoKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode === ENTER_KEY) {
      event.preventDefault();

      const val = this.state.value.trim();

      if (val) {
        this.props.onAddTodo(val);
        this.setState({value: ''});
      }
    }
    if (event.keyCode === ESCAPE_KEY) {
      event.preventDefault();
      this.setState({value: ''});
    }
  };
  render() {
    return (
      <input
        data-testid={TestID.NewTodoInput}
        className="new-todo"
        placeholder="What needs to be done?"
        value={this.state.value}
        onKeyDown={this._handleNewTodoKeyDown}
        onChange={this._handleChange}
        autoFocus={true}
      />
    );
  }
}
