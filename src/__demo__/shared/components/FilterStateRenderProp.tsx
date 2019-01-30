
import * as React from 'react';
import FilterState from '../FilterState';
import useFilterState from './useFilterState';

export interface Props {
  children: (filterState: FilterState) => React.ReactNode;
}
const FilterStateRenderProp: React.SFC<Props> = (props) => {
  return <React.Fragment>{props.children(useFilterState())}</React.Fragment>;
}
export default FilterStateRenderProp;