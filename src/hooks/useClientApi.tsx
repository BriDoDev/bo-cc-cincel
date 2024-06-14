import axios from "axios";
import { Client } from "../Types/Type";

export const useClientApi = () => {
  const getClients = async (): Promise<Client[]> => {
    try {
      const jwt = sessionStorage.getItem("jwt");
      const API_URL = import.meta.env.VITE_BACKENDURL + "/api/GetCredits";
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (response.status === 200) {
        return response.data as Client[];
      } else {
        throw new Error(`Error al obtener clientes`);
      }
    } catch (e) {
      throw Error();
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

  const deleteClient = async (clientId: string): Promise<void> => {
    if (clientId) {
      console.log("updateClient");
    }
    return Promise.resolve();
  };

  const provisionClient = async (
    clientId: string,
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
