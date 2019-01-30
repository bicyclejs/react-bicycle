import * as React from 'react';
import {cleanup} from 'react-testing-library';
import BicycleServer from 'bicycle/server-core';
import {installFakeTimers, uninstallFakeTimers} from './setup';
import {reset} from '../shared/data';
import initalRender from './initialRender';
import newTodo from './newTodo';

export default function testDemo(
  getApp: () => React.ReactElement<unknown>,
  getServer: () => BicycleServer<{}>,
) {
  describe('<App>', () => {
    beforeAll(() => {
      reset();
      installFakeTimers();
    });
    afterEach(() => {
      cleanup();
    });
    afterAll(() => {
      uninstallFakeTimers();
    });
    const options = {getApp, getServer};
    initalRender(options);
    newTodo(options);
  });
}
