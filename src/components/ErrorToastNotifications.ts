import * as React from 'react';
import connectErrors, {InjectedProps} from './connect-errors';

function createErrorBox(error: Error, onDismiss: (error: Error) => any) {
  const div = document.createElement('div');
  div.setAttribute(
    'style',
    [
      'white-space: pre-wrap;',
      'font-family: monospace;',
      'font-size: 18px;',
      'padding: 9px;',
      'margin: 9px;',
      'background: #900000;',
      'color: white;',
      'z-index: 99999;',
    ].join(''),
  );
  const msg = document.createElement('div');
  msg.textContent = error.message + '';
  div.appendChild(msg);
  const devWarning = document.createElement('div');
  devWarning.textContent = '(this error is only shown in development)';
  div.appendChild(devWarning);
  const dismissButton = document.createElement('button');
  dismissButton.setAttribute(
    'style',
    [
      'margin: 9px 0 0 0;',
      'padding: 9px;',
      'border: 0;',
      'background: #ffffff;',
      'font-size: 100%;',
      'vertical-align: baseline;',
      'font-family: inherit;',
      'font-weight: inherit;',
      'color: black;',
    ].join(''),
  );
  dismissButton.textContent = 'Dismiss';
  dismissButton.addEventListener('click', onDismiss.bind(null, error), false);
  div.appendChild(dismissButton);
  return div;
}

export interface Props {}
export class ErrorToastNotificationsView extends React.Component<
  Props & InjectedProps
> {
  _errorContainer: HTMLDivElement | undefined;
  componentDidMount() {
    this._renderErrors(this.props);
  }
  componentWillReceiveProps(newProps: Props & InjectedProps) {
    if (
      newProps.networkErrors !== this.props.networkErrors ||
      newProps.mutationErrors !== this.props.mutationErrors
    ) {
      this._renderErrors(newProps);
    }
  }
  _renderErrors(props: Props & InjectedProps) {
    if (this._errorContainer) {
      document.body.removeChild(this._errorContainer);
      this._errorContainer = undefined;
    }
    if (props.networkErrors.length || props.mutationErrors.length) {
      const errorContainer = (this._errorContainer = document.createElement(
        'div',
      ));

      errorContainer.setAttribute(
        'style',
        [
          'position: fixed;',
          'top: 0;',
          'left: 0;',
          'right: 0;',
          'bottom: 0;',
          'background: rgba(0, 0, 0, 0.8);',
          'z-index: 99999;',
        ].join(''),
      );
      props.networkErrors.forEach(err =>
        errorContainer.appendChild(
          createErrorBox(err, props.onDismissNetworkError),
        ),
      );
      props.mutationErrors.forEach(err =>
        errorContainer.appendChild(
          createErrorBox(err, props.onDismissMutationError),
        ),
      );
      document.body.appendChild(this._errorContainer);
    }
  }
  render() {
    return React.Children.only(this.props.children);
  }
}

export const ErrorToastNotifications = connectErrors()(
  ErrorToastNotificationsView,
);

export default ErrorToastNotifications;
