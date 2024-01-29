import React, { createContext, useEffect, useReducer } from 'react';

export const LoginContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload };
    case 'LOGOUT':
      localStorage.removeItem('user');
      return { user: null };
    default:
      break;
  }
};

export const LoginContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
  });
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      return dispatch({ type: 'LOGIN', payload: user });
    }
  }, []);
  return (
    <LoginContext.Provider value={{ ...state, dispatch }}>
      {children}
    </LoginContext.Provider>
  );
};
