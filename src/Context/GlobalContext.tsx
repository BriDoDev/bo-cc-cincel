// src/context/GlobalContext.tsx
import { Snackbar, SnackbarProps } from "@mui/material";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

// Define the type for the context
interface ContextType {
  jwt: string | null;
  setJwt: (jwt: string | null, expiresIn?: number) => void;
  logout: () => void;
  showSnackbar: (message: string) => void;
}

export const Context = createContext<ContextType | undefined>(undefined);

export const useGlobalContext = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a ContextProvider");
  }
  return context;
};

//#region Interfaces
interface ContextProviderProps {
  children: ReactNode;
}
interface SnackbarState extends SnackbarProps {
  message: string;
  open: boolean;
}
//#endregion

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const [jwt, setJwtState] = useState<string | null>(null);
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    message: "",
    open: false,
    autoHideDuration: 3000,
    onClose: () => setSnackbarState((prev) => ({ ...prev, open: false })),
  });

  const showSnackbar = (message: string) => {
    setSnackbarState({
      message,
      open: true,
      autoHideDuration: 6000,
      onClose: () => setSnackbarState((prev) => ({ ...prev, open: false })),
    });
  };

  const setJwt = (token: string | null, expiresIn?: number) => {
    if (token) {
      sessionStorage.setItem("jwt", token);
      if (expiresIn) {
        const expirationTime = new Date().getTime() + expiresIn * 1000;
        sessionStorage.setItem("jwt_expiration", expirationTime.toString());
      } else {
        sessionStorage.removeItem("jwt_expiration");
      }
    } else {
      sessionStorage.removeItem("jwt");
      sessionStorage.removeItem("jwt_expiration");
    }
    setJwtState(token);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");
    const expirationTime = sessionStorage.getItem("jwt_expiration");
    if (token && expirationTime) {
      const now = new Date().getTime();
      if (now < parseInt(expirationTime)) {
        setJwtState(token);
      } else {
        setJwt(null);
      }
    }
  }, []);

  const logout = () => {
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("jwt_expiration");
    setJwtState(null);
    window.location.reload(); // Recargar la página
  };

  return (
    <Context.Provider value={{ jwt, setJwt, logout, showSnackbar }}>
      {children}
      <Snackbar
        {...snackbarState}
        message={snackbarState.message}
        open={snackbarState.open}
        autoHideDuration={snackbarState.autoHideDuration}
        onClose={snackbarState.onClose}
      />
    </Context.Provider>
  );
};

export default ContextProvider;
