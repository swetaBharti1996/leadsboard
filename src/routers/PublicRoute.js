import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

export const PublicRoute = ({
  isAuthenticated,
  component: Component,
  ...rest
}) => {
  return (
    <Route {...rest} render={(props) => {
      return (
        isAuthenticated === false ? (
          <div>
            <Component {...props} />
          </div>
        ) : (
            <Redirect to="/post" />
          )
      )
    }} />
  )
};

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.auth.token
});

export default connect(mapStateToProps)(PublicRoute);
