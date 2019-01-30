import * as React from 'react';
import BicycleClient from 'bicycle/client';
import Component from './component-class';
import {LoadingResponse, ErrorResponse} from './useQuery';

export interface Context {
  client: BicycleClient;
  renderLoading: Component<LoadingResponse<any>>;
  renderErrors: Component<ErrorResponse<any>>;
}
const context = React.createContext<Context | undefined>(undefined);

export const ContextProvider = context.Provider;
export const BicycleConsumer = context.Consumer;

export function useContext(): Context {
  const ctx = React.useContext(context);
  if (!ctx) {
    throw new Error(
      'No BicycleProvider rendered. Make sure you render the BicycleProvider as a parent of this component.',
    );
  }
  return ctx;
}
