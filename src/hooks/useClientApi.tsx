import axios from "axios";
import { useClientContext } from "../Context/ClientContext";
import { Client } from "../Types/Type";
import { useAuthContext } from "../Context/AuthContext";

const useClientApi = () => {
  const { clients, setClients, showSnackbar, setIsLoading } =
    useClientContext();
  const { isAuthenticated } = useAuthContext();

  const fetchClients = async () => {
    try {
      if (isAuthenticated()) {
        setIsLoading(true);
        const API_URL = import.meta.env.VITE_BACKENDURL + "/api/GetCredits";
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
          },
        });

        if (response.status === 200) {
          setClients(response.data as Client[]);
          setIsLoading(false);
        } else {
          throw new Error("Error al obtener clientes");
        }
      }
    } catch (error) {
      showSnackbar("Error al obtener clientes");
    }
  };

  const addClient = async (client: Client) => {
    try {
      if (isAuthenticated()) {
        // const API_URL = import.meta.env.VITE_BACKENDURL + "/api/AddClient";
        // await axios.post(API_URL, client, {
        //   headers: {
        //     Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
        //   },
        // });
        // fetchClients();
        showSnackbar(`${client.nombre} agregado con éxito.`);
      }
    } catch (error) {
      showSnackbar("Error al agregar el cliente");
    }
  };

  const updateClient = async (client: Client) => {
    try {
      if (isAuthenticated()) {
        // const API_URL = import.meta.env.VITE_BACKENDURL + "/api/UpdateClient";
        // await axios.put(API_URL, client, {
        //   headers: {
        //     Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
        //   },
        // });
        // fetchClients();
        showSnackbar(`${client.nombre} actualizado con éxito.`);
      }
    } catch (error) {
      showSnackbar("Error al actualizar cliente");
    }
  };

  const deleteClient = async (client: Client) => {
    try {
      if (isAuthenticated()) {
        //   const API_URL =
        //     import.meta.env.VITE_BACKENDURL + `/api/DeleteClient/${clientId}`;
        //   await axios.delete(API_URL, {
        //     headers: {
        //       Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
        //     },
        //   });
        // fetchClients();
        showSnackbar(`${client.nombre} eliminado con éxito.`);
      }
    } catch (error) {
      showSnackbar("Error al eliminar cliente");
    }
  };

  const provisionClient = async (client: Client, provisionAmount: number) => {
    try {
      if (isAuthenticated()) {
        // const API_URL =
        //   import.meta.env.VITE_BACKENDURL + `/api/ProvisionClient/${clientId}`;
        // await axios.post(
        //   API_URL,
        //   { provisionAmount },
        //   {
        //     headers: {
        //       Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
        //     },
        //   }
        // );
        // fetchClients();
        showSnackbar(
          `Se aprovisionó correctamente el cliente: ${client.nombre} con $${provisionAmount}`
        );
      }
    } catch (error) {
      showSnackbar("Error al aprovisionar cliente");
    }
  };

  return {
    clients,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    provisionClient,
  };
};

export default useClientApi;
