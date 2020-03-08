import React, { createContext, useReducer } from 'react';
export const AuthContext = createContext(undefined);

const initialState = {
  currentUser: null,
};

const authReducer = (state, { type, payload }) => {
  switch (type) {
    case 'LOGIN':
      return {
        ...state,
        currentUser: payload,
      };
    case 'LOGOUT': {
      return {
        ...state,
        currentUser: null,
      };
    }
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const logIn = data => {
    dispatch({
      type: 'LOGIN',
      payload: data,
    });
  };

  const logOut = () => {
    dispatch({
      type: 'LOGOUT',
    });
  };

  return (
    <AuthContext.Provider value={{ state, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
