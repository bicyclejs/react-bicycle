import * as React from 'react';
import {classNames} from '../utils';
import { ESCAPE_KEY, ENTER_KEY } from '../constants';

export interface Props {
  title: string;
  completed: boolean;
  editing: boolean;
  onSave: (value: string) => void;
  onCancel: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  onToggle: () => void;
}
export interface State {
  editText: string;
}
export default class TodoItemBase extends React.Component<Props, State> {
  state = {editText: this.props.title};
  private readonly _editField = React.createRef<HTMLInputElement>();

  private readonly handleSubmit = () => {
    const val = this.state.editText.trim();
    if (val) {
      this.props.onSave(val);
      this.setState({editText: val});
    } else {
      this.props.onDestroy();
    }
  };

  private readonly _handleEdit = () =>{
    this.props.onEdit();
    this.setState({editText: this.props.title});
  };

  private readonly _handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.which === ESCAPE_KEY) {
      this.setState({editText: this.props.title});
      this.props.onCancel();
    } else if (event.which === ENTER_KEY) {
      this.handleSubmit();
    }
  };

  private readonly _handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props.editing) {
      this.setState({editText: event.target.value});
    }
  };

  /**
   * This is a completely optional performance enhancement that you can
   * implement on any React component. If you were to delete this method
   * the app would still work correctly (and still be very performant!), we
   * just use it as an example of how little code it takes to get an order
   * of magnitude performance improvement.
   */
  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      nextProps.title !== this.props.title ||
      nextProps.completed !== this.props.completed ||
      nextProps.editing !== this.props.editing ||
      nextState.editText !== this.state.editText
    );
  }

  /**
   * Safely manipulate the DOM after updating the state when invoking
   * `this.props.onEdit()` in the `handleEdit` method above.
   * For more info refer to notes at https://facebook.github.io/react/docs/component-api.html#setstate
   * and https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
   */
  componentDidUpdate(prevProps: Props) {
    if (!prevProps.editing && this.props.editing) {
      const input = this._editField.current;
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }
  }

  render() {
    return (
      <li className={classNames({
        completed: this.props.completed,
        editing: this.props.editing,
      })}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={this.props.completed}
            onChange={this.props.onToggle}
          />
          <label onDoubleClick={this._handleEdit}>
            {this.props.title}
          </label>
          <button className="destroy" onClick={this.props.onDestroy} />
        </div>
        <input
          ref={this._editField}
          className="edit"
          value={this.state.editText}
          onBlur={this.handleSubmit}
          onChange={this._handleChange}
          onKeyDown={this._handleKeyDown}
        />
      </li>
    );
  }
}
