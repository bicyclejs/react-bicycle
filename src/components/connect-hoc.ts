import * as React from 'react';
import * as PropTypes from 'prop-types';
import notEqual from 'bicycle/utils/not-equal';
import Query from 'bicycle/types/Query';
import {BaseRootQuery} from 'bicycle/typed-helpers/query';
import BicycleClient, {QueryCacheResult, Subscription} from 'bicycle/client';
import ErrorResult from 'bicycle/types/ErrorResult';
import clientShape from '../client-shape';
import Component, {getDisplayName} from '../component-class';

const hoistStatics = require('hoist-non-react-statics');

export type GetQuery<Props, QueryResult> = (props: Props) => BaseRootQuery<QueryResult> | Query;
export type GetEventHandlers<Props, EventHandlers> = (client: any, props: Props) => EventHandlers;
export interface Options<Props> {
  renderLoading?: boolean | Component<Props>;
  renderErrors?: boolean | Component<Props>;
}

export interface ConnectResultProps<QueryResult> {
  result: QueryResult,
  loaded: boolean,
  errors: ReadonlyArray<string>,
  errorDetails: ReadonlyArray<ErrorResult>,
  isLoaded(path: string): boolean;
  isLoaded(value: any, path: string): boolean;
  WrappedComponent: any,
  previousElement: React.ReactNode;
}
export type ConnectProps<QueryResult, EventHandlers = {}> = ConnectResultProps<QueryResult> & EventHandlers;
const EMPTY_OBJECT = {};

function queryCache<Result>(client: BicycleClient<any>, query: Query | BaseRootQuery<Result>): QueryCacheResult<Result> {
  if (query instanceof BaseRootQuery) {
    return client.queryCache(query);
  } else {
    return client.queryCache(query);
  }
}
function subscribe<Result>(
  client: BicycleClient<any>,
  query: Query | BaseRootQuery<Result>,
  onUpdate: (result: Result, loaded: boolean, errors: ReadonlyArray<string>, errorDetails: ReadonlyArray<ErrorResult>) => any,
): Subscription {
  if (query instanceof BaseRootQuery) {
    return client.subscribe(query, onUpdate);
  } else {
    return client.subscribe(query, onUpdate);
  }
}

// only a query + optional options
function connect<OriginalProps extends {}, QueryResult>(
  WrappedComponent: Component<OriginalProps & ConnectResultProps<QueryResult>>,
  getQuery: GetQuery<OriginalProps, QueryResult>,
  getEventHandlers?: void,
  options?: Options<OriginalProps & ConnectResultProps<QueryResult>>,
): React.ComponentClass<OriginalProps>;
// only event handlers + optional options
function connect<OriginalProps extends {}, InjectedEventHandlers>(
  WrappedComponent: Component<OriginalProps>,
  getQuery: void,
  getEventHandlers: GetEventHandlers<OriginalProps, InjectedEventHandlers>,
  options?: Options<OriginalProps & InjectedEventHandlers>,
): React.ComponentClass<OriginalProps>;
// both event handlers and query result
function connect<OriginalProps extends {}, QueryResult, InjectedEventHandlers>(
  WrappedComponent: Component<OriginalProps & InjectedEventHandlers & ConnectResultProps<QueryResult>>,
  getQuery: GetQuery<OriginalProps, QueryResult>,
  getEventHandlers: GetEventHandlers<OriginalProps, InjectedEventHandlers>,
  options?: Options<OriginalProps & InjectedEventHandlers & ConnectResultProps<QueryResult>>,
): React.ComponentClass<OriginalProps>;

function connect<OriginalProps extends {}, QueryResult, InjectedEventHandlers>(
  WrappedComponent: Component<OriginalProps & InjectedEventHandlers & ConnectResultProps<QueryResult>>,
  getQuery?: GetQuery<OriginalProps, QueryResult> | void,
  getEventHandlers?: GetEventHandlers<OriginalProps, InjectedEventHandlers> | void,
  options: Options<OriginalProps & InjectedEventHandlers & ConnectResultProps<QueryResult>> = EMPTY_OBJECT,
): React.ComponentClass<OriginalProps> {
  class Connect extends React.Component<OriginalProps, QueryCacheResult<QueryResult>> {
    static displayName = `Connect(${getDisplayName(WrappedComponent)})`;
    static WrappedComponent = WrappedComponent;
    static contextTypes = {
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
    private _client: BicycleClient<any>;
    private _query: BaseRootQuery<QueryResult> | Query | undefined;
    private _subscription: Subscription | undefined;
    private _previousElement: React.ReactNode | undefined;
    private _renderLoading: true | Component<OriginalProps & InjectedEventHandlers & ConnectResultProps<QueryResult>>;
    private _renderErrors: true | Component<OriginalProps & InjectedEventHandlers & ConnectResultProps<QueryResult>>;
    constructor(props: OriginalProps, context: any) {
      super(props, context);
      this._client = context.bicycleClient;
      this._renderLoading = options.renderLoading || context.bicycleRenderLoading || true;
      this._renderErrors = options.renderErrors || context.bicycleRenderErrors || true;

      if (!this._client) {
        throw new Error(
          `Could not find "client" in either the context or ` +
          `props of "${Connect.displayName}". ` +
          `Either wrap the root component in a <Provider>, ` +
          `or explicitly pass "client" as a prop to "${Connect.displayName}".`
        );
      }

      this._query = (getQuery ? getQuery(props) : undefined) || undefined;

      const {result, loaded, errors, errorDetails} = this._query ? queryCache(this._client, this._query) : {result: (undefined as any), loaded: true, errors: [], errorDetails: []};
      this.state = {result, loaded, errors, errorDetails};
    }
    componentDidMount() {
      if (this._query) {
        this._subscription = subscribe(this._client, this._query, this._onUpdate);
      }
    }
    componentWillReceiveProps(nextProps: OriginalProps) {
      const newQuery = (getQuery ? getQuery(nextProps) : undefined) || undefined;
      if (!newQuery) {
        if (this._subscription) {
          this._subscription.unsubscribe();
        }
      } else if (
        !this._query ||
        notEqual(
          this._query instanceof BaseRootQuery ? this._query._query : this._query,
          newQuery instanceof BaseRootQuery ? newQuery._query : newQuery,
        )
      ) {
        if (this._subscription) {
          this._subscription.unsubscribe();
        }
        this._query = newQuery;
        if (this._query) {
          this._subscription = subscribe(this._client, this._query, this._onUpdate);
        }
      }
    }
    componentWillUnmount() {
      if (this._subscription) {
        this._subscription.unsubscribe();
      }
    }
    _onUpdate = (result: QueryResult, loaded: boolean, errors: ReadonlyArray<string>, errorDetails: ReadonlyArray<ErrorResult>) => {
      this.setState({result, loaded, errors, errorDetails});
    }
    _isLoaded = (value: any, path?: string) => {
      if (typeof path === 'undefined') {
        [value, path] = [this.state.result, value];
      }
      for (const key of (path as any).split('.')) {
        if (value === undefined) {
          return false;
        } else {
          value = value[key];
        }
      }
      return value !== undefined;
    };
    render() {
      let ComponentToRender = WrappedComponent;
      if (typeof this._renderErrors !== 'boolean' && this.state.errors.length) {
        ComponentToRender = this._renderErrors;
      } else if (typeof this._renderLoading !== 'boolean' && !this.state.loaded) {
        ComponentToRender = this._renderLoading;
      }
      const eventHandlers = getEventHandlers ? getEventHandlers(this._client, this.props) : EMPTY_OBJECT;
      const previousElement = this._previousElement;
      return this._previousElement = React.createElement((ComponentToRender as any), {
        ...(this.props as any),
        ...((this.state.result || {}) as any),
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
  return hoistStatics(Connect, WrappedComponent);
}

export default connect;
