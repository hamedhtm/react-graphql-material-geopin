import React, { createContext, useReducer } from 'react';
export const Context = createContext(undefined);

const initialState = {
  currentUser: null,
  location: null,
  pins: [],
  currentPin: null,
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
        currentPin: null,
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
    case 'DISCARD_DRAFT': {
      return {
        ...state,
        draft: null,
      };
    }
    case 'CREATE_PIN': {
      const newPin = payload;
      const prevPins = state.pins.filter(pin => pin._id !== newPin._id);
      return {
        ...state,
        pins: [...prevPins, newPin],
      };
    }
    case 'GET_PINS': {
      return {
        ...state,
        pins: payload,
      };
    }
    case 'SET_CURRENT_PIN': {
      return {
        ...state,
        currentPin: payload,
        draft: null,
      };
    }
    case 'DELETE_PIN': {
      const deletePin = state.pins.filter(pin => pin._id !== payload._id);
      return {
        ...state,
        pins: deletePin,
        currentPin: null,
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

  const discardDraft = () => {
    dispatch({
      type: 'DISCARD_DRAFT',
    });
  };

  const updateDraftLocation = data => {
    dispatch({
      type: 'UPDATE_DRAFT_LOCATION',
      payload: data,
    });
  };

  const createPinContext = data => {
    dispatch({
      type: 'CREATE_PIN',
      payload: data,
    });
  };

  const getPinsContext = data => {
    dispatch({
      type: 'GET_PINS',
      payload: data,
    });
  };

  const setCurrentPin = data => {
    dispatch({
      type: 'SET_CURRENT_PIN',
      payload: data,
    });
  };

  const deletePinContext = data => {
    dispatch({
      type: 'DELETE_PIN',
      payload: data,
    });
  };

  return (
    <Context.Provider
      value={{
        state,
        logIn,
        logOut,
        createDraft,
        updateDraftLocation,
        discardDraft,
        getPinsContext,
        createPinContext,
        setCurrentPin,
        deletePinContext,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default AuthProvider;
