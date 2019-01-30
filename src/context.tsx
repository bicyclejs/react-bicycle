import * as React from 'react';
import BicycleClient from 'bicycle/client';
import ErrorResult from 'bicycle/types/ErrorResult';
import Component from './component-class';


export interface RenderProps {
  result: any,
  loaded: boolean,
  errors: ReadonlyArray<string>,
  errorDetails: ReadonlyArray<ErrorResult>,
  isLoaded(path: string): boolean;
  isLoaded(value: any, path: string): boolean;
}
export interface Context {
  client: BicycleClient;
  renderLoading?: Component<RenderProps>;
  renderErrors?: Component<RenderProps>;
}
const context = React.createContext<Context | undefined>(undefined);

const BC = context.Provider;
// TODO: render network errors/mutation errors, especially in development?
export const BicycleProvider: React.SFC<Context> = ({children, ...context}) => <BC value={context}>{children}</BC>;
export const BicycleConsumer = context.Consumer;

export function useContext(): Context {
  const ctx = React.useContext(context);
  if (!ctx) {
    throw new Error('No BicycleProvider rendered. Make sure you render the BicycleProvider as a parent of this component.');
  }
  return ctx;
}

