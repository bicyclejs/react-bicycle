import * as React from 'react';
import getBicycle from '../js-schema';
import App from '../ts-query/App';
import testDemo from '.';

testDemo(() => <App />, getBicycle);
