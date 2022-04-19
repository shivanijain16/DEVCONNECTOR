import React from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../Layout/Spinner';

const PrivateRoute = ({ component: Component, isAuthenticated, loading }) => {
  console.log(isAuthenticated);
  if (loading) return <Spinner />;
  if (isAuthenticated) return <Component />;
  return <Navigate to='/login' />;

  // return (<Route {...restProps}
  // render={props=>
  // isAuthenticated&&!loading?(<Component {...props}/>):(<Navigate to="/login"/>)}></Route>
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
});

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(PrivateRoute);
