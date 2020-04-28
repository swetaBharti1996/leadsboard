import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import LayoutCover from '../layout/layout';

export const PrivateRoute = ({
  isAuthenticated,
  component: Component,
  ...rest
}) => {
  return (
    <Route {...rest} render={(props) => {
      return (
        isAuthenticated === true ? (
          <div>
            <LayoutCover>
              <Component {...props} />
            </LayoutCover>
          </div>
        ) : (
            <Redirect to="/" />
          )
      )
    }} />
  )
};

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.auth.token
});

export default connect(mapStateToProps)(PrivateRoute);
