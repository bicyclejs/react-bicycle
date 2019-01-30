import * as React from 'react';
import ErrorResult from 'bicycle/types/ErrorResult';
import {BaseRootQuery} from 'bicycle/typed-helpers/query';
import DeepPartial from './helpers/DeepPartial';
import DeepPartialUnion from './helpers/DeepPartialUnion';
import Query from 'bicycle/types/Query';
import useLoadingDuration from './useLoadingDuration';
import {Context, useContext} from './context';

export interface SuccessResponse<TResult> {
  loaded: true;
  loading: false;
  errored: false;
  result: TResult;
}
export interface ErrorResponse<TResult> {
  loaded: false;
  loading: false;
  errored: true;
  result: DeepPartialUnion<TResult, ErrorResult>;
  errors: ReadonlyArray<string>;
  errorDetails: ReadonlyArray<ErrorResult>;
  render: () => React.ReactElement<unknown>;
}
export interface LoadingResponse<TResult> {
  loaded: false;
  loading: true;
  errored: false;
  result: DeepPartial<TResult>;
  loadingDuration: number;
  render: () => React.ReactElement<unknown>;
}
export type Response<TResult> =
  | SuccessResponse<TResult>
  | ErrorResponse<TResult>
  | LoadingResponse<TResult>;
function extractResponse<TResult>(
  ctx: Context,
  result: TResult,
  loaded: boolean,
  errors: ReadonlyArray<string>,
  errorDetails: ReadonlyArray<ErrorResult>,
): Response<TResult> {
  if (errors.length !== 0) {
    const r: ErrorResponse<TResult> = {
      loaded: false,
      loading: false,
      errored: true,
      result,
      errors,
      errorDetails,
      render: () => React.createElement(ctx.renderErrors, r),
    };
    return r;
  }
  if (!loaded) {
    const r: LoadingResponse<TResult> = {
      loaded: false,
      loading: true,
      errored: false,
      result,
    } as any;
    return r;
  }
  return {
    loaded: true,
    loading: false,
    errored: false,
    result,
  };
}

/**
 * Subscribe to the results of a bicycle query
 *
 * @param query The query to subscribe to
 */
export default function useQuery<QueryResult>(
  query: Query | BaseRootQuery<QueryResult>,
): Response<QueryResult> {
  const ctx = useContext();
  const [response, setResponse] = React.useState<Response<QueryResult>>(() => {
    const r = ctx.client.queryCache(query as BaseRootQuery<QueryResult>);
    return extractResponse(ctx, r.result, r.loaded, r.errors, r.errorDetails);
  });
  const loadingDuration = useLoadingDuration(response.loading);
  React.useEffect(() => {
    let ready = false;
    const subscription = ctx.client.subscribe(
      query as BaseRootQuery<QueryResult>,
      (result, loaded, errors, errorDetails) => {
        if (ready) {
          setResponse(
            extractResponse(ctx, result, loaded, errors, errorDetails),
          );
        }
      },
    );
    ready = true;
    return () => {
      subscription.unsubscribe();
    };
  }, [ctx.client, query]);
  if (response.loading) {
    const r: LoadingResponse<QueryResult> = {
      ...response,
      loadingDuration,
      render: () => React.createElement(ctx.renderLoading, r),
    };
    return r;
  }
  return response;
}
