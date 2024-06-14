// src/hooks/useClientApi
import axios from "axios";
import { Client } from "../Types/Type";
import useAuth from "./useAuth";

export const useClientApi = () => {
  const { isAuthenticated } = useAuth();

  const getClients = async (): Promise<Client[]> => {
    console.log(123);
    if (!isAuthenticated()) {
      throw new Error("Tu sesión ha caducado");
    }

    try {
      const jwt = sessionStorage.getItem("jwt");
      const API_URL = import.meta.env.VITE_BACKENDURL + "/api/GetCredits";
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: jwt,
        },
      });

      if (response.status === 200) {
        return response.data as Client[];
      } else {
        throw new Error(`Error al obtener clientes`);
      }
    } catch (e) {
      throw new Error(`Error al obtener clientes`);
    }
  };

  const addClient = async (client: Client): Promise<void> => {
    if (client) {
      console.log("addClient");
    }
    return Promise.resolve();
  };

  const updateClient = async (client: Client): Promise<void> => {
    if (client) {
      console.log("updateClient");
    }
    return Promise.resolve();
  };

  const deleteClient = async (clientId: number): Promise<void> => {
    if (clientId) {
      console.log("updateClient");
    }
    return Promise.resolve();
  };

  const provisionClient = async (
    clientId: number,
    provisionAmount: number
  ): Promise<void> => {
    if (clientId && provisionAmount) {
      console.log("provisionClient");
    }
    return Promise.resolve();
  };

  return {
    getClients,
    addClient,
    updateClient,
    deleteClient,
    provisionClient,
  };
};
