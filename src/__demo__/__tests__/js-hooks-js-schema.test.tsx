import * as React from 'react';
import getBicycle from '../js-schema';
import App from '../js-hooks/App';
import testDemo from '.';

testDemo(() => <App />, getBicycle);
