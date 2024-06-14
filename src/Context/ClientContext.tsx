// src/Context/ClientContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";
import axios from "axios";
import { Client } from "../Types/Type";
import { useAuthContext } from "./AuthContext";

interface ClientContextType {
  clients: Client[];
  fetchClients: () => void;
  addClient: (client: Client) => Promise<void>;
  updateClient: (client: Client) => Promise<void>;
  deleteClient: (clientId: string) => Promise<void>;
  provisionClient: (clientId: string, provisionAmount: number) => Promise<void>;
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
  const { isAuthenticated, showSnackbar } = useAuthContext();
  const [clients, setClients] = useState<Client[]>([]);

  const fetchClients = async () => {
    try {
      if (isAuthenticated) {
        const API_URL = import.meta.env.VITE_BACKENDURL + "/api/GetClients";
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
          },
        });

        if (response.status === 200) {
          setClients(response.data as Client[]);
        } else {
          throw new Error("Error al obtener clientes");
        }
      } else {
        showSnackbar("Tu sesión ha caducado");
      }
    } catch (error) {
      showSnackbar("Error al obtener clientes");
    }
  };

  const addClient = async (client: Client) => {
    try {
      if (isAuthenticated) {
        const API_URL = import.meta.env.VITE_BACKENDURL + "/api/AddClient";
        await axios.post(API_URL, client, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
          },
        });
        fetchClients();
      }
    } catch (error) {
      showSnackbar("Error al agregar el cliente");
    }
  };

  const updateClient = async (client: Client) => {
    try {
      if (isAuthenticated) {
        const API_URL = import.meta.env.VITE_BACKENDURL + "/api/UpdateClient";
        await axios.put(API_URL, client, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
          },
        });
        fetchClients();
      }
    } catch (error) {
      showSnackbar("Error al actualizar cliente");
    }
  };

  const deleteClient = async (clientId: string) => {
    try {
      if (isAuthenticated) {
        const API_URL =
          import.meta.env.VITE_BACKENDURL + `/api/DeleteClient/${clientId}`;
        await axios.delete(API_URL, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
          },
        });
        fetchClients();
      }
    } catch (error) {
      showSnackbar("Error al eliminar cliente");
    }
  };

  const provisionClient = async (clientId: string, provisionAmount: number) => {
    try {
      if (isAuthenticated) {
        const API_URL =
          import.meta.env.VITE_BACKENDURL + `/api/ProvisionClient/${clientId}`;
        await axios.post(
          API_URL,
          { provisionAmount },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
            },
          }
        );
        fetchClients();
      }
    } catch (error) {
      showSnackbar("Error al aprovisionar cliente");
    }
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        fetchClients,
        addClient,
        updateClient,
        deleteClient,
        provisionClient,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export default ClientProvider;
