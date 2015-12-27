import {PropTypes} from 'react';

export default PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  queryCache: PropTypes.func.isRequired,
});
