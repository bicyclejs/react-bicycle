import * as React from 'react';

export interface ComponentClass<P = {}> {
    new (props?: P, context?: any): React.Component<P, any>;
    defaultProps?: Partial<P>;
    displayName?: string;
}
export interface StatelessComponent<P = {}> {
  (props: P & { children?: React.ReactNode }, context?: any): React.ReactElement<any> | null;
  defaultProps?: Partial<P>;
  displayName?: string;
}
export type FunctionComponent<P = {}> = (props: P & { children?: React.ReactNode }, context?: any) => React.ReactElement<any> | null;

export type Component<P = {}> = ComponentClass<P> | StatelessComponent<P> | FunctionComponent<P>;

export default Component;

export function getDisplayName<P>(component: Component<P>) {
  return (component as any).displayName || (component as any).name || 'Anonymous';
}