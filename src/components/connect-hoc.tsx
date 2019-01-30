import * as React from 'react';
import Query from 'bicycle/types/Query';
import {BaseRootQuery} from 'bicycle/typed-helpers/query';
import ErrorResult from 'bicycle/types/ErrorResult';
import Component from '../component-class';
import Connect, {Status} from './Connect';
import useClient from '../useClient';

const hoistStatics = require('hoist-non-react-statics');

export type GetQuery<Props, QueryResult> = (
  props: Props,
) => BaseRootQuery<QueryResult> | Query;
export type GetEventHandlers<Props, EventHandlers> = (
  client: any,
  props: Props,
) => EventHandlers;
export interface Options<Props> {
  renderLoading?: boolean | Component<Props>;
  renderErrors?: boolean | Component<Props>;
}

export interface ConnectResultProps<QueryResult> {
  result: QueryResult;
  loaded: boolean;
  errors: ReadonlyArray<string>;
  errorDetails: ReadonlyArray<ErrorResult>;
  previousElement: React.ReactNode;
}
function getConnectResultProps<QueryResult>(
  status: Status<QueryResult>,
): ConnectResultProps<QueryResult> {
  return {
    result: status.result as QueryResult,
    loaded: status.loaded,
    errors: status.errors,
    errorDetails: status.errorDetails,
    previousElement: status.previousElement,
  };
}
export type ConnectProps<QueryResult, EventHandlers = {}> = ConnectResultProps<
  QueryResult
> &
  EventHandlers;
const EMPTY_OBJECT = {};

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
  WrappedComponent: Component<
    OriginalProps & InjectedEventHandlers & ConnectResultProps<QueryResult>
  >,
  getQuery: GetQuery<OriginalProps, QueryResult>,
  getEventHandlers: GetEventHandlers<OriginalProps, InjectedEventHandlers>,
  options?: Options<
    OriginalProps & InjectedEventHandlers & ConnectResultProps<QueryResult>
  >,
): React.ComponentClass<OriginalProps>;

function connect<OriginalProps extends {}, QueryResult, InjectedEventHandlers>(
  WrappedComponent: Component<
    OriginalProps & InjectedEventHandlers & ConnectResultProps<QueryResult>
  >,
  getQuery?: GetQuery<OriginalProps, QueryResult> | void,
  getEventHandlers?: GetEventHandlers<
    OriginalProps,
    InjectedEventHandlers
  > | void,
  options: Options<
    OriginalProps & InjectedEventHandlers & ConnectResultProps<QueryResult>
  > = EMPTY_OBJECT,
): React.ComponentClass<OriginalProps> {
  function ConnectWrapper(props: OriginalProps) {
    const client = useClient();
    let eventHandlers: InjectedEventHandlers = {} as any;
    if (getEventHandlers) {
      eventHandlers = getEventHandlers(client, props);
    }
    if (!getQuery) {
      return <WrappedComponent {...props} {...eventHandlers as any} />;
    }
    const {renderLoading, renderErrors} = options;
    return (
      <Connect
        query={getQuery(props) as BaseRootQuery<QueryResult>}
        renderLoading={
          typeof renderLoading === 'boolean'
            ? renderLoading
            : renderLoading &&
              ((_duration, _client, status) =>
                React.createElement(renderLoading, {
                  ...props,
                  ...eventHandlers,
                  ...getConnectResultProps(status),
                }))
        }
        renderErrors={
          typeof renderErrors === 'boolean'
            ? renderErrors
            : renderErrors &&
              ((_result, _client, status) =>
                React.createElement(renderErrors, {
                  ...props,
                  ...eventHandlers,
                  ...getConnectResultProps(status),
                }))
        }
      >
        {(_results, _client, status) => (
          <WrappedComponent
            {...props}
            {...eventHandlers}
            {...getConnectResultProps(status)}
          />
        )}
      </Connect>
    );
  }

  return hoistStatics(ConnectWrapper, WrappedComponent);
}

export default connect;
