import { useNavigate } from 'react-router-dom';

export function useCustomNavigate() {
  const navigate = useNavigate();

  const goTo = (path) => {
    navigate(path);
  };

  return goTo;
}