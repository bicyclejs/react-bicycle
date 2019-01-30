import * as React from 'react';
import BiycleServer from '../ts-schema/server';
import App from '../ts-hooks/App';
import testDemo from '.';

testDemo(() => <App />, () => new BiycleServer());
