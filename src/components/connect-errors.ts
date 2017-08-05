import * as React from 'react';
import BicycleClient, {Subscription} from 'bicycle/client';
import clientShape from '../client-shape';
import Component, {getDisplayName} from '../component-class';
const hoistStatics = require('hoist-non-react-statics');

const EMPTY_OBJECT = {};
const EMPTY_ARRAY: ReadonlyArray<any> = [];

export interface Options {
  ignoreNetworkErrors?: boolean;
  ignoreMutationErrors?: boolean;
}

declare global {
  interface Error {
    key?: string;
  }
}

interface State {
  networkErrors: ReadonlyArray<Error>,
  mutationErrors: ReadonlyArray<Error>,
  requestInFlight: boolean,
}
export interface InjectedProps {
  networkErrors: ReadonlyArray<Error>,
  mutationErrors: ReadonlyArray<Error>,
  requestInFlight: boolean,
  onDismissNetworkError: (err: Error) => any,
  onDismissMutationError: (err: Error) => any,
}
export default function connectErrors(options: Options = EMPTY_OBJECT) {
  return <OriginalProps extends {}>(WrappedComponent: Component<InjectedProps & OriginalProps>): React.ComponentClass<OriginalProps> => {
    let key = 0;
    class Connect extends React.Component<OriginalProps, State> {
      static displayName = `ConnectErrors(${getDisplayName(WrappedComponent)})`;
      static WrappedComponent = WrappedComponent;
      static contextTypes = {
        bicycleClient: clientShape,
      };
      _client: BicycleClient<any>;
      _networkErrorsSubscription: Subscription | void;
      _mutationErrorsSubscription: Subscription | void;
      _queueRequestSubscription: Subscription | void;
      _successfulResponseSubscription: Subscription | void;
      constructor(props: any, context: any) {
        super(props, context);
        this._client = props.client || context.bicycleClient;

        if (!this._client) {
          throw new Error(
            `Could not find "client" in either the context or ` +
            `props of "${Connect.displayName}". ` +
            `Either wrap the root component in a <Provider>, ` +
            `or explicitly pass "client" as a prop to "${Connect.displayName}".`
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
        if (this._networkErrorsSubscription) {
          this._networkErrorsSubscription.unsubscribe();
        }
        if (this._mutationErrorsSubscription) {
          this._mutationErrorsSubscription.unsubscribe();
        }
        if (this._queueRequestSubscription) {
          this._queueRequestSubscription.unsubscribe();
        }
        if (this._successfulResponseSubscription) {
          this._successfulResponseSubscription.unsubscribe();
        }
      }
      _onNetworkError = (err: Error) => {
        if (options.ignoreNetworkErrors) {
          return;
        }
        err.key = 'network_error_key_' + (key++);
        this.setState({networkErrors: this.state.networkErrors.concat([err])});
      }
      _onMutationError = (err: Error) => {
        if (options.ignoreMutationErrors) {
          return;
        }
        err.key = 'mutation_error_key_' + (key++);
        this.setState({mutationErrors: this.state.mutationErrors.concat([err])});
      }
      _onQueueRequest = () => {
        this.setState({requestInFlight: true});
      }
      _onSuccessfulResponse = (pendingMutations: number) => {
        this.setState({
          networkErrors: EMPTY_ARRAY,
          requestInFlight: pendingMutations !== 0,
        });
      }
      _dismissNetworkError = ({key}: {key: string}) => {
        const networkErrors = this.state.networkErrors.filter(err => err.key !== key);
        this.setState({
          networkErrors: networkErrors.length ? networkErrors : EMPTY_ARRAY,
        });
      }
      _dismissMutationError = ({key}: {key: string}) => {
        const mutationErrors = this.state.mutationErrors.filter(err => err.key !== key);
        this.setState({
          mutationErrors: mutationErrors.length ? mutationErrors : EMPTY_ARRAY,
        });
      }
      render() {
        return React.createElement((WrappedComponent as React.ComponentClass<OriginalProps & InjectedProps>), {
          ...(this.props as any),
          networkErrors: this.state.networkErrors,
          mutationErrors: this.state.mutationErrors,
          requestInFlight: this.state.requestInFlight,
          onDismissNetworkError: this._dismissNetworkError,
          onDismissMutationError: this._dismissMutationError,
        });
      }
    }

    return hoistStatics(Connect, WrappedComponent);
  };
}
