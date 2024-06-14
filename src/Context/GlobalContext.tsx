// src/Context/GlobalContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { Snackbar } from "@mui/material";
import { useClientApi } from "../hooks/useClientApi";
import { Client, SnackbarState } from "../Types/Type";

interface ContextType {
  jwt: string | null;
  setJwt: (jwt: string | null, expiresIn?: number) => void;
  logout: () => void;
  showSnackbar: (message: string) => void;
  clients: Client[];
  fetchClients: () => void;
  addClient: (client: Client) => Promise<void>;
  updateClient: (client: Client) => Promise<void>;
  deleteClient: (clientId: number) => Promise<void>;
  provisionClient: (clientId: number, provisionAmount: number) => Promise<void>;
  isAuthenticated: boolean;
}

export const Context = createContext<ContextType | undefined>(undefined);

export const useGlobalContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useGlobalContext must be used within a ContextProvider");
  }
  return context;
};

interface ContextProviderProps {
  children: ReactNode;
}

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const [jwt, setJwtState] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    message: "",
    open: false,
    autoHideDuration: 3000,
    onClose: () => setSnackbarState((prev) => ({ ...prev, open: false })),
  });
  const [clients, setClients] = useState<Client[]>([]);
  const { getClients, addClient, updateClient, deleteClient, provisionClient } =
    useClientApi();

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");
    console.log(token);
    const expirationTime = sessionStorage.getItem("jwt_expiration");
    console.log(expirationTime);
    const now = Math.floor(new Date().getTime() / 1000); // Convertir a segundos
    console.log(now);

    console.log(
      "if: " + token && expirationTime && now < parseInt(expirationTime)
    );
    if (token && expirationTime && now < parseInt(expirationTime)) {
      setJwtState(token);
      setIsAuthenticated(true);
    } else {
      setJwtState(null);
      setIsAuthenticated(false);
    }
  }, []);

  const showSnackbar = (message: string) => {
    setSnackbarState({
      message,
      open: true,
      autoHideDuration: 6000,
      onClose: () => setSnackbarState((prev) => ({ ...prev, open: false })),
    });
  };

  const setJwt = (token: string | null, expiresIn?: number) => {
    if (token && expiresIn) {
      sessionStorage.setItem("jwt", token);
      sessionStorage.setItem("jwt_expiration", expiresIn.toString());
      setIsAuthenticated(true);
    } else {
      sessionStorage.removeItem("jwt");
      sessionStorage.removeItem("jwt_expiration");
      setIsAuthenticated(false);
    }
    setJwtState(token);
  };

  const logout = () => {
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("jwt_expiration");
    setJwtState(null);
    setIsAuthenticated(false);
    window.location.reload();
  };

  const fetchClients = async () => {
    getClients()
      .then((clientsData: Client[]) => {
        setClients(clientsData);
      })
      .catch((error) => {
        showSnackbar(error.message);
      });
  };

  const handleAddClient = async (client: Client) => {
    try {
      await addClient(client);
      fetchClients();
    } catch (e) {
      console.error(e);
      showSnackbar("Error al agregar el cliente");
    }
  };

  const handleUpdateClient = async (client: Client) => {
    try {
      await updateClient(client);
      fetchClients();
    } catch (e) {
      console.error(e);
      showSnackbar("Error al actualizar cliente");
    }
  };

  const handleDeleteClient = async (clientId: number) => {
    try {
      await deleteClient(clientId);
      fetchClients();
    } catch (e) {
      console.error(e);
      showSnackbar("Error al eliminar cliente");
    }
  };

  const handleProvisionClient = async (
    clientId: number,
    provisionAmount: number
  ) => {
    try {
      await provisionClient(clientId, provisionAmount);
      fetchClients();
    } catch (e) {
      console.error(e);
      showSnackbar("Error al aprovisionar cliente");
    }
  };

  const contextValue = {
    jwt,
    setJwt,
    logout,
    showSnackbar,
    clients,
    fetchClients,
    addClient: handleAddClient,
    updateClient: handleUpdateClient,
    deleteClient: handleDeleteClient,
    provisionClient: handleProvisionClient,
    isAuthenticated,
  };

  return (
    <Context.Provider value={contextValue}>
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
