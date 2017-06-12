import PropTypes from 'prop-types';

export default PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  queryCache: PropTypes.func.isRequired,
});
