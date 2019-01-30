import BicycleClient from "bicycle/client";
import Provider from "./components/provider";
import Connect, { query, Status, RenderLoaded, RenderLoading, RenderErrors, RenderMaybeLoaded } from "./components/connect";
import connect, { ConnectProps } from "./components/connect-hoc";
import connectErrors from "./components/connect-errors";

import {BicycleProvider} from './context';
import useClient from "./useClient";
import useQuery from './useQuery';
import useNetworkError from './useNetworkError';

export {useClient, BicycleProvider, useQuery, useNetworkError};
export default useQuery;

export {
  Provider,
  Connect,
  query,
  Status,
  RenderLoaded,
  RenderLoading,
  RenderErrors,
  RenderMaybeLoaded,
  connect,
  connectErrors,
  ConnectProps,
  BicycleClient
};
