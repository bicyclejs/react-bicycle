import {Component, PropTypes, Children, createElement} from 'react';
import connectErrors from './connect-errors';

const errorStyle = {
  whiteSpace: 'pre-wrap',
  fontFamily: 'monospace',
  fontSize: '18px',
  padding: '9px',
  background: '#900000',
  color: 'white',
};

class ErrorBox extends Component {
  constructor(props) {
    super(props);
    this._onDismiss = this._onDismiss.bind(this);
  }
  _onDismiss() {
    this.props.onDismiss(this.props.error);
  }
  render() {
    return createElement(
      'div',
      {style: errorStyle},
      createElement('div', {}, this.props.error.message),
      createElement('div', {}, '(this error is only shown in development)'),
      createElement('button', {onClick: this._onDismiss}, 'Dismiss'),
    );
  }
}

class Errors extends Component {
  render() {
    if (this.props.networkErrors.length || this.props.mutationErrors.length) {
      return createElement(
        'div',
        {},
        this.props.networkErrors.map(
          err => createElement(ErrorBox, {key: err.key, error: err, onDismiss: this.props.onDismissNetworkError}),
        ),
        this.props.mutationErrors.map(
          err => createElement(ErrorBox, {key: err.key, error: err, onDismiss: this.props.onDismissMutationError}),
        ),
      );
    }
    return Children.only(this.props.children);
  }
}

export default connectErrors()(Errors);
