import * as React from 'react';
import ErrorResult from 'bicycle/types/ErrorResult';
import {BaseRootQuery} from 'bicycle/typed-helpers/query';
import  useClient  from "./useClient";
import DeepPartial from './helpers/DeepPartial';
import DeepPartialUnion from './helpers/DeepPartialUnion';

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
}
export interface LoadingResponse<TResult> {
  loaded: false;
  loading: true;
  errored: false;
  result: DeepPartial<TResult>;
}
export type Response<TResult> = SuccessResponse<TResult> | ErrorResponse<TResult> | LoadingResponse<TResult>
function extractResponse<TResult>(result: TResult, loaded: boolean, errors: ReadonlyArray<string>, errorDetails: ReadonlyArray<ErrorResult>): Response<TResult> {
  if (errors.length !== 0) {
    return {
      loaded: false,
      loading: false,
      errored: true,
      result,
      errors,
      errorDetails,
    };
  }
  if (!loaded) {
    return {
      loaded: false,
      loading: true,
      errored: false,
      result,
    };
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
  query: BaseRootQuery<QueryResult>,
): Response<QueryResult> {
  const client = useClient();
  const [response, setResponse] = React.useState<Response<QueryResult>>(() => {
    const r = client.queryCache(query);
    return extractResponse(r.result, r.loaded, r.errors, r.errorDetails)
  });
  React.useEffect(() => {
    let ready = false;
    const subscription = client.subscribe(query, (result, loaded, errors, errorDetails) => {
      if (ready) {
        setResponse(extractResponse(result, loaded, errors, errorDetails))
      }
    });
    ready = true;
    return () => {
      subscription.unsubscribe();
    }
  }, [client, query])
  return response;
}