import BicycleServer from 'bicycle/server';

import RootObject from './schema/objects/root';
import TodoObject from './schema/objects/todo';
import IdScalar from './schema/scalars/id';

// could be written as:
//
// const bicycle = new BicycleServer(__dirname + '/schema');
//
// but won't work for tests because our actual files are typescript
export default () =>
  new BicycleServer({
    objects: [RootObject, TodoObject],
    scalars: [IdScalar],
  });
