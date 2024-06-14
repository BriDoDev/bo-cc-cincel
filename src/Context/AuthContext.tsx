import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Snackbar } from "@mui/material";
import { SnackbarState } from "../Types/Type";

interface AuthContextType {
  jwt: string | null;
  setJwt: (jwt: string | null, expiresIn?: number) => void;
  logout: () => void;
  showSnackbar: (message: string) => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [jwt, setJwtState] = useState<string | null>(null);
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    message: "",
    open: false,
    autoHideDuration: 3000,
    onClose: () =>
      setSnackbarState((prev: SnackbarState) => ({ ...prev, open: false })),
  });

  const isAuthenticated = () => {
    const token = sessionStorage.getItem("jwt");
    const expirationTime = sessionStorage.getItem("jwt_expiration");
    const now = Math.floor(new Date().getTime() / 1000);

    if (token && expirationTime && now < parseInt(expirationTime)) {
      return true;
    } else {
      showSnackbar("Tu sesión ha caducado");
      return false;
    }
  };

  useEffect(() => {
    isAuthenticated();
  }, []);

  const showSnackbar = (message: string) => {
    setSnackbarState({
      message,
      open: true,
      autoHideDuration: 6000,
      onClose: () =>
        setSnackbarState((prev: SnackbarState) => ({ ...prev, open: false })),
    });
  };

  const setJwt = (token: string | null, expiresIn?: number) => {
    if (token && expiresIn) {
      sessionStorage.setItem("jwt", token);
      sessionStorage.setItem("jwt_expiration", expiresIn.toString());
      setJwtState(token);

      // Set a timeout to automatically logout when token expires
      const timeout = expiresIn * 1000 - new Date().getTime();
      setTimeout(() => logout(), timeout);
    } else {
      sessionStorage.removeItem("jwt");
      sessionStorage.removeItem("jwt_expiration");
      setJwtState(null);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("jwt_expiration");
    setJwtState(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        jwt,
        setJwt,
        logout,
        showSnackbar,
        isAuthenticated,
      }}
    >
      {children}
      <Snackbar
        {...snackbarState}
        message={snackbarState.message}
        open={snackbarState.open}
        autoHideDuration={snackbarState.autoHideDuration}
        onClose={snackbarState.onClose}
      />
    </AuthContext.Provider>
  );
};

export default AuthProvider;
