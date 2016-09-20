import {Component, createElement} from 'react';
import hoistStatics from 'hoist-non-react-statics';
import clientShape from '../client-shape';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
function noop() {}
export default function connectErrors(options = EMPTY_OBJECT) {
  return WrappedComponent => {
    let key = 0;
    class Connect extends Component {
      constructor(props, context) {
        super(props, context);
        this._onNetworkError = options.ignoreNetworkErrors ? noop : this._onNetworkError.bind(this);
        this._onMutationError = options.ignoreMutationErrors ? noop : this._onMutationError.bind(this);
        this._onQueueRequest = this._onQueueRequest.bind(this);
        this._onSuccessfulResponse = this._onSuccessfulResponse.bind(this);
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
        this.state = {networkErrors: [], mutationErrors: [], requestInFlight: false};
      }
      componentDidMount() {
        this._networkErrorsSubscription = this._client.subscribeToNetworkErrors(this._onNetworkError);
        this._mutationErrorsSubscription = this._client.subscribeToMutationErrors(this._onMutationError);
        if (this._client.subscribeToQueueRequest && this._client.subscribeToSuccessfulResponse) {
          this._queueRequestSubscription = this._client.subscribeToQueueRequest(this._onQueueRequest);
          this._successfulResponseSubscription = this._client.subscribeToSuccessfulResponse(this._onSuccessfulResponse);
        }
      }
      componentWillUnmount() {
        this._networkErrorsSubscription.unsubscribe();
        this._mutationErrorsSubscription.unsubscribe();
        if (this._queueRequestSubscription) {
          this._queueRequestSubscription.unsubscribe();
        }
        if (this._successfulResponseSubscription) {
          this._successfulResponseSubscription.unsubscribe();
        }
      }
      _onNetworkError(err) {
        err.key = 'network_error_key_' + (key++);
        this.setState({networkErrors: this.state.networkErrors.concat([err])});
      }
      _onMutationError(err) {
        err.key = 'mutation_error_key_' + (key++);
        this.setState({mutationErrors: this.state.mutationErrors.concat([err])});
      }
      _onQueueRequest() {
        this.setState({requestInFlight: true});
      }
      _onSuccessfulResponse(pendingMutations) {
        this.setState({
          networkErrors: EMPTY_ARRAY,
          requestInFlight: pendingMutations !== 0,
        });
      }
      _dismissNetworkError({key}) {
        const networkErrors = this.state.networkErrors.filter(err => err.key !== key);
        this.setState({
          networkErrors: networkErrors.length ? networkErrors : EMPTY_ARRAY,
        });
      }
      _dismissMutationError({key}) {
        const mutationErrors = this.state.mutationErrors.filter(err => err.key !== key);
        this.setState({
          mutationErrors: mutationErrors.length ? mutationErrors : EMPTY_ARRAY,
        });
      }
      render() {
        return this._previousElement = createElement(WrappedComponent, {
          ...this.props,
          networkErrors: this.state.networkErrors,
          mutationErrors: this.state.mutationErrors,
          requestInFlight: this.state.requestInFlight,
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
