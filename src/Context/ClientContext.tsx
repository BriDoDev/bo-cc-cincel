import React, { createContext, useState, useContext, ReactNode } from "react";
import { Client } from "../Types/Type";
import { useAuthContext } from "./AuthContext";

interface ClientContextType {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  showSnackbar: (message: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClientContext must be used within a ClientProvider");
  }
  return context;
};

interface ClientProviderProps {
  children: ReactNode;
}

const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  const { showSnackbar } = useAuthContext();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <ClientContext.Provider
      value={{
        clients,
        isLoading,
        setClients,
        setIsLoading,
        showSnackbar,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export default ClientProvider;
