import * as React from 'react';
import BicycleServer from '../ts-schema/server';
import App from '../js-hooks/App';
import testDemo from '.';

testDemo(() => <App />, () => new BicycleServer());
