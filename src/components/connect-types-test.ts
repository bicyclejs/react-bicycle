import {query} from './Connect';
import {BaseRootQuery} from 'bicycle/typed-helpers/query';

const exampleQuery: BaseRootQuery<{x: {y: 42}}> = null as any;

query(exampleQuery, result => {
  const x: {x: {y: 42}} = result;
  const y: typeof result = {x: {y: 42}};
  console.log({x, y});
  return null;
});

query(
  exampleQuery,
  result => {
    const v: 42 = result.x!.y!;
    const x: typeof result = {};
    const y: typeof result = {x: {}};
    const z: typeof result = {x: {y: 42}};
    console.log({v, x, y, z});
    return null;
  },
  {renderLoading: true},
);

query(
  exampleQuery,
  result => {
    const x: {x: {y: 42}} = result;
    const y: typeof result = {x: {y: 42}};
    console.log({x, y});
    return null;
  },
  {
    renderLoading: (loadingDuration, client, status) => {
      const l: number = loadingDuration;
      const result = status.result;
      const v: 42 = result.x!.y!;
      const x: typeof result = {};
      const y: typeof result = {x: {}};
      const z: typeof result = {x: {y: 42}};
      console.log({l, v, x, y, z});
      return null;
    },
  },
);
