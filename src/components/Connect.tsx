import * as React from 'react';
import BicycleClient from 'bicycle/client';
import ErrorResult from 'bicycle/types/ErrorResult';
import {BaseRootQuery} from 'bicycle/typed-helpers/query';
import DeepPartial from '../helpers/DeepPartial';
import useQuery from '../useQuery';
import {useContext} from '../context';

const EMPTY_ARRAY: never[] = [];

export interface Status<QueryResult> {
  result: DeepPartial<QueryResult>;
  loaded: boolean;
  errors: ReadonlyArray<string>;
  errorDetails: ReadonlyArray<ErrorResult>;
  previousElement: React.ReactNode;
  loadingDuration: number;
}
export type RenderLoaded<QueryResult> = (
  result: QueryResult,
  client: BicycleClient,
  status: Status<QueryResult>,
) => React.ReactNode;
export type RenderMaybeLoaded<QueryResult> = (
  result: DeepPartial<QueryResult>,
  client: BicycleClient,
  status: Status<QueryResult>,
) => React.ReactNode;
export type RenderLoading<QueryResult> = (
  loadingDuration: number,
  client: BicycleClient,
  status: Status<QueryResult>,
) => React.ReactNode;
export type RenderErrors<QueryResult> = (
  errors: ReadonlyArray<string>,
  client: BicycleClient,
  status: Status<QueryResult>,
) => React.ReactNode;

export interface Props<QueryResult> {
  query: BaseRootQuery<QueryResult>;
  children: RenderLoaded<QueryResult>;
  renderLoading?: boolean | RenderLoading<QueryResult>;
  renderErrors?: boolean | RenderErrors<QueryResult>;
}

export default function Connect<QueryResult>(props: Props<QueryResult>) {
  const ctx = useContext();
  const client = ctx.client;
  const previousElementRef = React.useRef<null | React.ReactNode>(null);
  const r = useQuery(props.query);

  if (r.errored && props.renderErrors !== true) {
    if (props.renderErrors === false) {
      return null;
    } else if (typeof props.renderErrors === 'function') {
      return (
        <React.Fragment>
          {props.renderErrors(r.errors, client, {
            result: r.result as any,
            loaded: false,
            errors: r.errors,
            errorDetails: r.errorDetails,
            previousElement: previousElementRef.current,
            loadingDuration: 0,
          })}
        </React.Fragment>
      );
    } else {
      return r.render();
    }
  }

  if (r.loading && props.renderLoading !== true) {
    if (props.renderLoading === false) {
      return null;
    } else if (typeof props.renderLoading === 'function') {
      return (
        <React.Fragment>
          {props.renderLoading(r.loadingDuration, client, {
            result: r.result as any,
            loaded: false,
            errors: EMPTY_ARRAY,
            errorDetails: EMPTY_ARRAY,
            previousElement: previousElementRef.current,
            loadingDuration: r.loadingDuration,
          })}
        </React.Fragment>
      );
    } else {
      return r.render();
    }
  }
  const result = props.children(r.result as any, client, {
    result: r.result as any,
    loaded: r.loaded,
    errors: r.errored ? r.errors : EMPTY_ARRAY,
    errorDetails: r.errored ? r.errorDetails : EMPTY_ARRAY,
    previousElement: previousElementRef.current,
    loadingDuration: r.loading ? r.loadingDuration : 0,
  });
  previousElementRef.current = result;
  return <React.Fragment>{result}</React.Fragment>;
}

export function query<QueryResult>(
  query: BaseRootQuery<QueryResult>,
  children: RenderLoaded<QueryResult>,
): React.ReactElement<any>;
export function query<QueryResult>(
  query: BaseRootQuery<QueryResult>,
  children: RenderLoaded<QueryResult>,
  options: {
    renderLoading?: RenderLoading<QueryResult>;
    renderErrors?: RenderErrors<QueryResult>;
  },
): React.ReactElement<any>;
export function query<QueryResult>(
  query: BaseRootQuery<QueryResult>,
  children: RenderMaybeLoaded<QueryResult>,
  options: {
    renderLoading?: boolean | RenderLoading<QueryResult>;
    renderErrors?: boolean | RenderErrors<QueryResult>;
  },
): React.ReactElement<any>;
export function query<QueryResult>(
  query: BaseRootQuery<QueryResult>,
  children: RenderLoaded<QueryResult>,
  options?: {
    renderLoading?: boolean | RenderLoading<QueryResult>;
    renderErrors?: boolean | RenderErrors<QueryResult>;
  },
): React.ReactElement<any> {
  const C: React.SFC<Props<QueryResult>> = Connect;
  return React.createElement(C, {
    query,
    children,
    ...options,
  });
}
