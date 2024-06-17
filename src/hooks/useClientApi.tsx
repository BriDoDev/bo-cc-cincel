// src/hooks/useClientApi.tsx
import axios from "axios";
import { useClientContext } from "../Context/ClientContext";
import { Client, discount } from "../Types/Type";
import { useAuthContext } from "../Context/AuthContext";

const useClientApi = () => {
  const { clients, setClients, showSnackbar, setIsLoading, setComboDesc } =
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
        } else {
          throw new Error("Error al obtener clientes");
        }
        setIsLoading(false);
      } else {
        showSnackbar("Tu sesión ha caducado");
      }
    } catch (error) {
      showSnackbar("Error al obtener clientes");
    }
  };

  const addClient = async (client: Client) => {
    try {
      if (isAuthenticated()) {
        setIsLoading(true);
        const API_URL = import.meta.env.VITE_BACKENDURL + "/Api/CreateClient";
        await axios.post(
          API_URL,
          {
            Name: client.nombre,
            Mail: client.email,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
            },
          }
        );
        fetchClients();
        showSnackbar(`${client.nombre} agregado con éxito.`);
        setIsLoading(false);
      } else {
        showSnackbar("Tu sesión ha caducado");
      }
    } catch (error) {
      showSnackbar("Error al agregar el cliente");
    }
  };

  const updateClient = async (client: Client) => {
    try {
      if (isAuthenticated()) {
        setIsLoading(true);
        const API_URL = import.meta.env.VITE_BACKENDURL + "/api/Client";
        await axios.put(
          API_URL,
          {
            Id: client.id,
            Name: client.nombre,
            Mail: client.email,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
            },
          }
        );
        fetchClients();
        showSnackbar(`${client.nombre} actualizado con éxito.`);
        setIsLoading(false);
      } else {
        showSnackbar("Tu sesión ha caducado");
      }
    } catch (error) {
      showSnackbar("Error al actualizar cliente");
    }
  };

  const deleteClient = async (client: Client) => {
    try {
      if (isAuthenticated()) {
        setIsLoading(true);
        //   const API_URL =
        //     import.meta.env.VITE_BACKENDURL + `/api/DeleteClient/${clientId}`;
        //   await axios.delete(API_URL, {
        //     headers: {
        //       Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
        //     },
        //   });
        // fetchClients();
        showSnackbar(`${client.nombre} eliminado con éxito.`);
        setIsLoading(false);
      } else {
        showSnackbar("Tu sesión ha caducado");
      }
    } catch (error) {
      showSnackbar("Error al eliminar cliente");
    }
  };

  const provisionClient = async (
    client: Client,
    provisionAmount: number,
    desc: discount
  ) => {
    try {
      if (isAuthenticated()) {
        setIsLoading(true);
        const API_URL = import.meta.env.VITE_BACKENDURL + "/api/AsignCredits";
        await axios.post(
          API_URL,
          {
            IdCliente: client.id,
            Cantidad: provisionAmount,
            Tipo: desc.idType,
            Descuento: desc.percentage,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
            },
          }
        );
        fetchClients();
        showSnackbar(
          `Se aprovisionó correctamente el cliente: ${client.nombre} con $${provisionAmount}`
        );
        setIsLoading(false);
      } else {
        showSnackbar("Tu sesión ha caducado");
      }
    } catch (error) {
      showSnackbar("Error al aprovisionar cliente");
    }
  };

  const getComboDesc = async () => {
    try {
      if (isAuthenticated()) {
        setIsLoading(true);
        const API_URL = import.meta.env.VITE_BACKENDURL + "/api/GetDiscount";
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
          },
        });

        setComboDesc(JSON.parse(response.data));
      } else {
        showSnackbar("Tu sesión ha caducado");
      }
    } catch (error) {
      console.error(error);
      showSnackbar("Error al obtener descuentos");
    }
  };

  return {
    clients,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    provisionClient,
    getComboDesc,
  };
};

export default useClientApi;
