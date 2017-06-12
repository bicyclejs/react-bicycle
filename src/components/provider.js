import {Component, Children, createElement} from 'react';
import PropTypes from 'prop-types';
import clientShape from '../client-shape';

// prevent this code loading in production
let DefaultErrorRenderer;
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

export default class Provider extends Component {
  getChildContext() {
    return {
      bicycleClient: this.client,
      bicycleRenderLoading: this.renderLoading,
      bicycleRenderErrors: this.renderErrors,
    };
  }

  constructor(props, context) {
    super(props, context);
    this.client = props.client;
    this.renderLoading = props.renderLoading;
    this.renderErrors = props.renderErrors;
  }

  componentWillReceiveProps(nextProps) {
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
      return createElement(
        DefaultErrorRenderer,
        {},
        this.props.children,
      );
    }
    return Children.only(this.props.children);
  }
}

Provider.propTypes = {
  client: clientShape.isRequired,
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
const defaultLoadingElement = createElement('div', {}, 'Loading...');

Provider.defaultProps = {
  renderLoading: (props) => defaultLoadingElement,
  renderErrors: (props) => createElement('div', {}, props.errors.map((err, i) => {
    return createElement('div', {key: i, style: errorStyle}, err + '');
  })),
};
Provider.childContextTypes = {
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
