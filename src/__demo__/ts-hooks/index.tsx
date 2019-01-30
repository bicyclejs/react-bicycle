import * as React from 'react';
import BicycleClient from 'bicycle/client';
import * as ReactDOM from 'react-dom';
import {Provider} from '../../..';
import App from './App';

const client = new BicycleClient();
ReactDOM.render(
  <Provider client={client}>
    <App />
  </Provider>,
  document.getElementsByClassName('todoapp')[0],
);
