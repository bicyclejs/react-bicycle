import * as React from 'react';
import BicycleClient from 'bicycle/client';
import {ContextProvider} from '../context';
import Component from '../component-class';
import DefaultLoadingElement from './DefaultLoadingRenderer';
import DefaultErrorRenderer from './DefaultErrorRenderer';
import {LoadingResponse, ErrorResponse} from '../useQuery';

// prevent this code loading in production
let ErrorToastNotifications!: typeof import('./ErrorToastNotifications').ErrorToastNotifications;
if (process.env.NODE_ENV !== 'production') {
  ErrorToastNotifications = require('./ErrorToastNotifications').default;
}

export interface Props {
  children: React.ReactNode;
  client: BicycleClient<any>;
  disableErrorReporter?: boolean;
  renderLoading?: Component<LoadingResponse<any>>;
  renderErrors?: Component<ErrorResponse<any>>;
}
export default function BicycleProvider({
  children,
  client,
  disableErrorReporter = false,
  renderLoading = DefaultLoadingElement,
  renderErrors = DefaultErrorRenderer,
}: Props) {
  return (
    <ContextProvider value={{client, renderLoading, renderErrors}}>
      {process.env.NODE_ENV !== 'production' && !disableErrorReporter ? (
        <ErrorToastNotifications>{children}</ErrorToastNotifications>
      ) : (
        children
      )}
    </ContextProvider>
  );
}
