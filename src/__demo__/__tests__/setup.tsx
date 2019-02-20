import * as React from 'react';
import {render} from 'react-testing-library';
import BicycleClient from 'bicycle/client';
import BicycleServer from 'bicycle/server-core';
import {install, Clock} from 'lolex';
import {Provider} from '../..';
const act: (fn: () => void) => void = require('react-dom/test-utils').act;

let clock: Clock | undefined;
export const installFakeTimers = () => {
  return (clock = install());
};
export const uninstallFakeTimers = () => {
  if (clock) {
    clock.uninstall();
    clock = undefined;
  }
};

export interface Options {
  getApp: () => React.ReactElement<unknown>;
  getServer: () => BicycleServer<{}>;
}
const setup = ({getApp, getServer}: Options) => {
  const server = getServer();
  const client = new BicycleClient({
    networkLayer: {
      send: async message => {
        const response = await server.handleMessage(message, () => ({}));
        return response;
      },
    },
  });
  return {
    act: (fn: () => void) =>
      act(() => {
        fn();
      }),
    clock: clock!,
    client,
    ...render(<Provider client={client}>{getApp()}</Provider>),
  };
};

export default setup;
