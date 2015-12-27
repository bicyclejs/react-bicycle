# React Bicycle

React bindings for the bicycle data synchronisation library

## Usage

```js
import React from 'react';
import ReactDOM from 'react-dom';
import Bicycle from 'bicycle/lib/client';
import {Provider, connect} from 'react-bicycle';

const App = React.createClass({
  render() {
    if (!this.props.loaded) return <div>Loading...</div>;
    return <div>My Field: <strong>{this.props.myField}</strong></div>;
  },
});

const AppContainer = connect(
  (props) => ({myField: true}),
  (client, props) => ({
    setMyField(value) {
      return client.update('Root.setMyField', {value});
    },
  }),
)(App);

const client = new Bicycle();
ReactDOM.render(
  <Provider client={client}><AppContainer/></Provider>,
  document.getElementById('container'),
);
```
