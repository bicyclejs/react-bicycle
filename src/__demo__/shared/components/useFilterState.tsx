import * as React from 'react';
import FilterState from '../FilterState';

function getFilterState(hash: string) {
  switch (hash) {
    case '#/completed':
      return  FilterState.COMPLETED_TODOS;
    case '#/active':
      return FilterState.ACTIVE_TODOS;
    default:
      return FilterState.ALL_TODOS;
  }
}
export default function useFilterState() {
  const [state, set] = React.useState(getFilterState(location.hash));
  React.useEffect(() => {
    const onHashChange = () => {
      set(getFilterState(location.hash))
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  return state;
}