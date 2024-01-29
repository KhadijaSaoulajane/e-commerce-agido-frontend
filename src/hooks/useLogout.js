import { useContext } from 'react';
import { LoginContext } from '../context/LoginContext';

export const useLogout = () => {
  const { dispatch } = useContext(LoginContext);

  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  return { logout };
};
