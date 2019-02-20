import * as React from 'react';
import getBicycle from '../js-schema';
import App from '../connect/App';
import testDemo from '.';

testDemo(() => <App />, getBicycle);
