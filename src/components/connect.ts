import * as React from "react";
import * as PropTypes from "prop-types";
import notEqual from "bicycle/utils/not-equal";
import Query from "bicycle/types/Query";
import { BaseRootQuery } from "bicycle/typed-helpers/query";
import BicycleClient, { QueryCacheResult, Subscription } from "bicycle/client";
import ErrorResult from "bicycle/types/ErrorResult";
import clientShape from "../client-shape";

export { PropTypes };

const errorStyle = {
  whiteSpace: "pre-wrap",
  fontFamily: "monospace",
  fontSize: "18px",
  padding: "9px",
  background: "#900000",
  color: "white"
};

function queryCache<Result>(
  client: BicycleClient<any>,
  query: Query | BaseRootQuery<Result>
): QueryCacheResult<Result> {
  if (query instanceof BaseRootQuery) {
    return client.queryCache(query);
  } else {
    return client.queryCache(query);
  }
}
function subscribe<Result>(
  client: BicycleClient<any>,
  query: Query | BaseRootQuery<Result>,
  onUpdate: (
    result: Result,
    loaded: boolean,
    errors: string[],
    errorDetails: ReadonlyArray<ErrorResult>
  ) => any
): Subscription {
  if (query instanceof BaseRootQuery) {
    return client.subscribe(query, onUpdate);
  } else {
    return client.subscribe(query, onUpdate);
  }
}

export interface Props<QueryResult> {
  query: BaseRootQuery<QueryResult>;
  children: (
    result: QueryResult,
    client: BicycleClient,
    status: {
      result: QueryResult;
      loaded: boolean;
      errors: ReadonlyArray<string>;
      errorDetails: ReadonlyArray<ErrorResult>;
      previousElement: React.ReactNode;
      loadingDuration: number;
    }
  ) => React.ReactNode;
  renderLoading?:
    | boolean
    | ((
        loadingDuration: number,
        client: BicycleClient,
        status: {
          result: QueryResult;
          loaded: boolean;
          errors: ReadonlyArray<string>;
          errorDetails: ReadonlyArray<ErrorResult>;
          previousElement: React.ReactNode;
          loadingDuration: number;
        }
      ) => React.ReactNode);
  renderErrors?:
    | boolean
    | ((
        errors: ReadonlyArray<string>,
        client: BicycleClient,
        status: {
          result: QueryResult;
          loaded: boolean;
          errors: ReadonlyArray<string>;
          errorDetails: ReadonlyArray<ErrorResult>;
          previousElement: React.ReactNode;
          loadingDuration: number;
        }
      ) => React.ReactNode);
}
export interface State<QueryResult> extends QueryCacheResult<QueryResult> {
  loadingDuration: number;
}

const loadingComponents: Connect<any>[] = [];
setInterval(() => {
  const now = Date.now();
  for (let i = 0; i < loadingComponents.length; i++) {
    const start = loadingComponents[i]._startLoadingTime;
    loadingComponents[i].setState({
      loadingDuration: start ? now - start : 0
    });
  }
}, 100);

export default class Connect<QueryResult> extends React.Component<
  Props<QueryResult>,
  State<QueryResult>
> {
  static contextTypes = {
    bicycleClient: clientShape
  };
  private _client: BicycleClient<any>;
  private _query: BaseRootQuery<QueryResult> | void;
  private _subscription: Subscription | void;
  private _previousElement: React.ReactNode = null;

  public _startLoadingTime: number | null = null;

  constructor(props: Props<QueryResult>, context: any) {
    super(props, context);
    this._client = context.bicycleClient;

    if (!this._client) {
      throw new Error(
        `Could not find "client" in either the context or ` +
          `props of Connect. ` +
          `Either wrap the root component in a <Provider>, ` +
          `or explicitly pass "client" as a prop to Connect.`
      );
    }

    this._query = this.props.query;

    const { result, loaded, errors, errorDetails } = this._query
      ? queryCache(this._client, this._query)
      : {
          result: undefined as any,
          loaded: true,
          errors: [],
          errorDetails: []
        };
    this.state = { result, loaded, errors, errorDetails, loadingDuration: 0 };
  }
  componentDidMount() {
    if (this._query) {
      this._subscription = subscribe(this._client, this._query, this._onUpdate);
    }
  }
  componentWillReceiveProps(nextProps: Props<QueryResult>) {
    const newQuery = nextProps.query;
    if (!newQuery) {
      if (this._subscription) {
        this._subscription.unsubscribe();
      }
    } else if (
      !this._query ||
      notEqual(
        this._query instanceof BaseRootQuery ? this._query._query : this._query,
        newQuery instanceof BaseRootQuery ? newQuery._query : newQuery
      )
    ) {
      if (this._subscription) {
        this._subscription.unsubscribe();
      }
      this._query = newQuery;
      if (this._query) {
        this._subscription = subscribe(
          this._client,
          this._query,
          this._onUpdate
        );
      }
    }
  }
  componentWillUnmount() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    const index = loadingComponents.indexOf(this);
    if (index !== -1) {
      loadingComponents.splice(index, 1);
    }
  }
  _onUpdate = (
    result: QueryResult,
    loaded: boolean,
    errors: ReadonlyArray<string>,
    errorDetails: ReadonlyArray<ErrorResult>
  ) => {
    if (loaded) {
      if (this._startLoadingTime !== null) {
        this._startLoadingTime = null;
        const index = loadingComponents.indexOf(this);
        if (index !== -1) {
          loadingComponents.splice(index, 1);
        }
      }
    } else {
      if (this._startLoadingTime === null) {
        this._startLoadingTime = Date.now();
        loadingComponents.push(this);
      }
    }
    this.setState({
      result,
      loaded,
      errors,
      errorDetails,
      loadingDuration: this._startLoadingTime
        ? Date.now() - this._startLoadingTime
        : 0
    });
  };
  _render() {
    if (this.state.errors.length && this.props.renderErrors !== true) {
      if (this.props.renderErrors === false) {
        return null;
      } else if (typeof this.props.renderErrors === "function") {
        return this.props.renderErrors(this.state.errors, this.context.client, {
          ...this.state,
          previousElement: this._previousElement
        });
        // TODO: allow using context to set error renderer
      } else {
        return React.createElement(
          "div",
          {},
          this.state.errors.map((err, i) =>
            React.createElement("div", { key: i, style: errorStyle }, err + "")
          )
        );
      }
    }

    if (!this.state.loaded && this.props.renderLoading !== true) {
      if (this.props.renderLoading === false) {
        return null;
      } else if (typeof this.props.renderLoading === "function") {
        return this.props.renderLoading(
          this.state.loadingDuration,
          this.context.client,
          {
            ...this.state,
            previousElement: this._previousElement
          }
        );
        // TODO: allow using context to set loading renderer
      } else {
        if (this.state.loadingDuration > 1000) {
          return React.createElement("div", {}, "Loading...");
        } else {
          return null;
        }
      }
    }
    return this.props.children(this.state.result, this.context.client, {
      ...this.state,
      previousElement: this._previousElement
    });
  }
  render() {
    return (this._previousElement = this._render()) as any;
  }
}

export function query<QueryResult>(
  query: Props<QueryResult>["query"],
  children: Props<QueryResult>["children"],
  options?: Pick<Props<QueryResult>, "renderLoading" | "renderErrors">
) {
  const C: React.ComponentClass<Props<QueryResult>> = Connect;
  return React.createElement(C, {
    query,
    children,
    ...options
  });
}
