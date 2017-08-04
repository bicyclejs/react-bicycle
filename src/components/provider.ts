import * as React from 'react';
import * as PropTypes from 'prop-types';
import BicycleClient from 'bicycle/client';
import ErrorResult from 'bicycle/types/ErrorResult';
import clientShape from '../client-shape';

// prevent this code loading in production
let DefaultErrorRenderer: any;
if (process.env.NODE_ENV !== 'production') {
  DefaultErrorRenderer = require('./default-error-renderer').default;
}
const errorStyle = {
  whiteSpace: 'pre-wrap',
  fontFamily: 'monospace',
  fontSize: '18px',
  padding: '9px',
  background: '#900000',
  color: 'white',
};

let didWarnAboutReceivingClient = false;
function warnAboutReceivingClient() {
  if (didWarnAboutReceivingClient) {
    return;
  }

  didWarnAboutReceivingClient = true;
  console.error( // eslint-disable-line no-console
    '<Provider> does not support changing `client`, `renderLoading` or `renderErrors` on the fly.'
  );
}

export interface RenderProps {
  result: any,
  loaded: boolean,
  errors: ReadonlyArray<string>,
  errorDetails: ReadonlyArray<ErrorResult>,
  isLoaded(path: string): boolean;
  isLoaded(value: any, path: string): boolean;
  WrappedComponent: any,
  previousElement: React.ReactNode;
}
export type Component<Props> = React.ComponentClass<Props> | React.StatelessComponent<Props>;

export interface Props {
  client: BicycleClient<any>;
  disableErrorReporter?: boolean;
  renderLoading?: Component<RenderProps>;
  renderErrors?: Component<RenderProps>;
}

const defaultLoadingElement = React.createElement('div', {}, 'Loading...');
export default class Provider extends React.Component<Props> {
  client: BicycleClient<any>;
  renderLoading?: Component<RenderProps>;
  renderErrors?: Component<RenderProps>;
  static propTypes = {
    client: clientShape.isRequired,
    disableErrorReporter: PropTypes.bool,
    renderLoading: PropTypes.oneOfType([
      PropTypes.any, // Component
      PropTypes.bool,
    ]),
    renderErrors: PropTypes.oneOfType([
      PropTypes.any, // Component
      PropTypes.bool,
    ]),
    children: PropTypes.element.isRequired,
  };
  static defaultProps = {
    renderLoading: (props: RenderProps) => defaultLoadingElement,
    renderErrors: (props: RenderProps) => React.createElement('div', {}, props.errors.map((err, i) => {
      return React.createElement('div', {key: i, style: errorStyle}, err + '');
    })),
  };
  static childContextTypes = {
    bicycleClient: clientShape.isRequired,
    bicycleRenderLoading: PropTypes.oneOfType([
      PropTypes.any, // Component
      PropTypes.bool,
    ]).isRequired,
    bicycleRenderErrors: PropTypes.oneOfType([
      PropTypes.any, // Component
      PropTypes.bool,
    ]).isRequired,
  };
  getChildContext() {
    return {
      bicycleClient: this.client,
      bicycleRenderLoading: this.renderLoading,
      bicycleRenderErrors: this.renderErrors,
    };
  }

  constructor(props: Props, context: any) {
    super(props, context);
    this.client = props.client;
    this.renderLoading = props.renderLoading;
    this.renderErrors = props.renderErrors;
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      this.client !== nextProps.client ||
      this.renderLoading !== nextProps.renderLoading ||
      this.renderErrors !== nextProps.renderErrors
    ) {
      warnAboutReceivingClient();
    }
  }

  render() {
    if (process.env.NODE_ENV !== 'production' && !this.props.disableErrorReporter) {
      return React.createElement(
        DefaultErrorRenderer,
        {},
        this.props.children,
      );
    }
    return React.Children.only(this.props.children);
  }
}
