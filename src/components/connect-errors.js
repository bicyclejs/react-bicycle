import {Component, createElement, PropTypes} from 'react';
import hoistStatics from 'hoist-non-react-statics';
import notEqual from 'bicycle/utils/not-equal';
import clientShape from '../client-shape';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const EMPTY_OBJECT = {};
function noop() {}
export default function connectErrors(options = EMPTY_OBJECT) {
  return WrappedComponent => {
    let key = 0;
    class Connect extends Component {
      constructor(props, context) {
        super(props, context);
        this._onNetworkError = options.ignoreNetworkErrors ? noop : this._onNetworkError.bind(this);
        this._onMutationError = options.ignoreMutationErrors ? noop : this._onMutationError.bind(this);
        this._dismissNetworkError = this._dismissNetworkError.bind(this);
        this._dismissMutationError = this._dismissMutationError.bind(this);
        this._client = props.client || context.bicycleClient;

        if (!this._client) {
          throw new Error(
            `Could not find "client" in either the context or ` +
            `props of "${this.constructor.displayName}". ` +
            `Either wrap the root component in a <Provider>, ` +
            `or explicitly pass "client" as a prop to "${this.constructor.displayName}".`
          );
        }
        this.state = {networkErrors: [], mutationErrors: []};
      }
      componentDidMount() {
        this._networkErrorsSubscription = this._client.subscribeToNetworkErrors(this._onNetworkError);
        this._mutationErrorsSubscription = this._client.subscribeToMutationErrors(this._onMutationError);
      }
      componentWillUnmount() {
        this._networkErrorsSubscription.unsubscribe();
        this._mutationErrorsSubscription.unsubscribe();
      }
      _onNetworkError(err) {
        err.key = 'network_error_key_' + (key++);
        this.setState({networkErrors: this.state.networkErrors.concat([err])});
      }
      _onMutationError(err) {
        err.key = 'mutation_error_key_' + (key++);
        this.setState({mutationErrors: this.state.mutationErrors.concat([err])});
      }
      _dismissNetworkError({key}) {
        this.setState({
          networkErrors: this.state.networkErrors.filter(err => err.key !== key),
        });
      }
      _dismissMutationError({key}) {
        this.setState({
          mutationErrors: this.state.mutationErrors.filter(err => err.key !== key),
        });
      }
      render() {
        return this._previousElement = createElement(WrappedComponent, {
          ...this.props,
          networkErrors: this.state.networkErrors,
          mutationErrors: this.state.mutationErrors,
          onDismissNetworkError: this._dismissNetworkError,
          onDismissMutationError: this._dismissMutationError,
        });
      }
    }

    Connect.displayName = `ConnectErrors(${getDisplayName(WrappedComponent)})`;
    Connect.WrappedComponent = WrappedComponent;
    Connect.contextTypes = {
      bicycleClient: clientShape,
    };
    Connect.propTypes = {
      client: clientShape,
    };
    return hoistStatics(Connect, WrappedComponent);
  };
}
