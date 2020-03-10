import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function AuthRoute({ component: Component, ...rest }) {
  const {
    state: { currentUser },
  } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={props =>
        !currentUser ? <Redirect to="/login" /> : <Component {...props} />
      }
    />
  );
}

export default AuthRoute;
