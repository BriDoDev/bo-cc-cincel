// src/hooks/useAuth.ts
import { useAuthContext } from "../Context/AuthContext";

const useAuth = () => {
  const { isAuthenticated, authenticate } = useAuthContext();

  return { isAuthenticated, authenticate };
};

export default useAuth;
