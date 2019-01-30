# React Bicycle

React bindings for the bicycle data synchronisation library

## Usage

```js
import React from 'react';
import ReactDOM from 'react-dom';
import BicycleClient from 'bicycle/client';
import useQuery, {useClient, BicycleProvider} from 'react-bicycle';

function App() {
  const client = useClient();
  const q = useQuery({myField: true});

  // If the query result has not yet loaded, or has errored
  // render an appropriate placeholder.
  // `q` has properties to allow you to render your own custom
  // loading indicator or error message.
  if (!q.loaded) return r.render();
  
  // client.update('Root.setMyField', {value})

  return <div>My Field: <strong>{q.result.myField}</strong></div>;
}

const client = new BicycleClient();
ReactDOM.render(
  <BicycleProvider client={client}><AppContainer/></BicycleProvider>,
  document.getElementById('container'),
);
```
