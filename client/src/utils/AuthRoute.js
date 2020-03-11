import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Context } from '../Context';

function AuthRoute({ component: Component, ...rest }) {
  const {
    state: { currentUser },
  } = useContext(Context);

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
