import {Component, createElement} from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import notEqual from 'bicycle/utils/not-equal';
import clientShape from '../client-shape';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const EMPTY_OBJECT = {};
export default function (getQuery, getEventHandlers, options = EMPTY_OBJECT) {
  return WrappedComponent => {
    class Connect extends Component {
      constructor(props, context) {
        super(props, context);
        this._onUpdate = this._onUpdate.bind(this);
        this._client = props.client || context.bicycleClient;
        this._renderLoading = options.renderLoading || context.bicycleRenderLoading || true;
        this._renderErrors = options.renderErrors || context.bicycleRenderErrors || true;

        if (!this._client) {
          throw new Error(
            `Could not find "client" in either the context or ` +
            `props of "${this.constructor.displayName}". ` +
            `Either wrap the root component in a <Provider>, ` +
            `or explicitly pass "client" as a prop to "${this.constructor.displayName}".`
          );
        }

        this._query = getQuery ? getQuery(props) : EMPTY_OBJECT;
        if (this._query == null) {
          this._query = EMPTY_OBJECT;
        }
        const {result, loaded, errors, errorDetails} = this._client.queryCache(this._query);
        this.state = {result, loaded, errors, errorDetails};
        this._isLoaded = (value, path) => {
          if (typeof path === 'undefined') {
            [value, path] = [this.state.result, value];
          }
          for (const key of path.split('.')) {
            if (value === undefined) {
              return false;
            } else {
              value = value[key];
            }
          }
          return value !== undefined;
        };
      }
      componentDidMount() {
        this._subscription = this._client.subscribe(this._query, this._onUpdate);
      }
      componentWillReceiveProps(nextProps) {
        let newQuery = getQuery ? getQuery(nextProps) : EMPTY_OBJECT;
        if (newQuery == null) {
          newQuery = EMPTY_OBJECT;
        }
        if (notEqual(this._query, newQuery)) {
          this._subscription.unsubscribe();
          this._query = newQuery;
          this._subscription = this._client.subscribe(this._query, this._onUpdate);
        }
      }
      componentWillUnmount() {
        if (this._subscription) {
          this._subscription.unsubscribe();
        }
      }
      _onUpdate(result, loaded, errors, errorDetails) {
        this.setState({result, loaded, errors, errorDetails});
      }
      render() {
        const eventHandlers = getEventHandlers ? getEventHandlers(this._client, this.props) : EMPTY_OBJECT;
        let ComponentToRender = WrappedComponent;
        if (this._renderErrors !== true && this.state.errors.length) {
          ComponentToRender = this._renderErrors;
        } else if (this._renderLoading !== true && !this.state.loaded) {
          ComponentToRender = this._renderLoading;
        }
        const previousElement = this._previousElement;
        return this._previousElement = createElement(ComponentToRender, {
          ...this.props,
          ...this.state.result,
          ...eventHandlers,
          result: this.state.result,
          loaded: this.state.loaded,
          errors: this.state.errors,
          errorDetails: this.state.errorDetails,
          isLoaded: this._isLoaded,
          WrappedComponent,
          previousElement,
        });
      }
    }

    Connect.displayName = `Connect(${getDisplayName(WrappedComponent)})`;
    Connect.WrappedComponent = WrappedComponent;
    Connect.contextTypes = {
      bicycleClient: clientShape,
      bicycleRenderLoading: PropTypes.oneOfType([
        PropTypes.any, // Component
        PropTypes.bool,
      ]),
      bicycleRenderErrors: PropTypes.oneOfType([
        PropTypes.any, // Component
        PropTypes.bool,
      ]),
    };
    Connect.propTypes = {
      client: clientShape,
    };
    return hoistStatics(Connect, WrappedComponent);
  };
}
