import React, { createContext, useReducer } from 'react';
export const AuthContext = createContext(undefined);

const initialState = {
  currentUser: null,
  location: null,
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
    case 'CREATE_DRAFT': {
      return {
        ...state,
        draft: {
          latitude: 0,
          longitude: 0,
        },
      };
    }
    case 'UPDATE_DRAFT_LOCATION': {
      return {
        ...state,
        draft: payload,
      };
    }
    case 'Discard': {
      return {
        ...state,
        draft: null,
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

  const createDraft = () => {
    dispatch({
      type: 'CREATE_DRAFT',
    });
  };

  const discard = () => {
    dispatch({
      type: 'Discard',
    });
  };

  const updateDraftLocation = data => {
    dispatch({
      type: 'UPDATE_DRAFT_LOCATION',
      payload: data,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        logIn,
        logOut,
        createDraft,
        updateDraftLocation,
        discard,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
