// src/hooks/useClientApi.ts
import { useClientContext } from "../Context/ClientContext";

const useClientApi = () => {
  const {
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    provisionClient,
  } = useClientContext();

  return {
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    provisionClient,
  };
};

export default useClientApi;
