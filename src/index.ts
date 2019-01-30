import BicycleClient from 'bicycle/client';
import Connect, {
  query,
  Status,
  RenderLoaded,
  RenderLoading,
  RenderErrors,
  RenderMaybeLoaded,
} from './components/Connect';
import connect, {ConnectProps} from './components/connect-hoc';
import connectErrors from './components/connect-errors';

import useClient from './useClient';
import useQuery from './useQuery';
import useNetworkError from './useNetworkError';
import BicycleProvider from './components/BicycleProvider';

export {useClient, useQuery, useNetworkError};
export default useQuery;

export {
  BicycleProvider,
  BicycleProvider as Provider,
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
  BicycleClient,
};
