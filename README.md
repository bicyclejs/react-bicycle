# React Bicycle

React bindings for the bicycle data synchronisation library

## Usage

For an full demo of a task list app see:

 - with ts-bicycle [src/__demo__/ts-hooks](src/__demo__/ts-hooks) and [src/__demo__/ts-schema](src/__demo__/ts-schema)
 - without ts-bicycle  [src/__demo__/js-hooks](src/__demo__/js-hooks) and [src/__demo__/js-schema](src/__demo__/js-schema)

These demos are API compatible, so you can use either client with either backend.

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
