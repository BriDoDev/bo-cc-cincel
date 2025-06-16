// src/hooks/useClientApi.tsx
import { useClientContext } from "../Context/ClientContext";
import { Client, dateReport, discount } from "../Types/Type";
import { useAuthContext } from "../Context/AuthContext";
import { v4 as uuidv4 } from "uuid";

const LOCAL_STORAGE_KEY = "demo_clients";
const DISCOUNTS_KEY = "demo_discounts";

const useClientApi = () => {
  const { setClients, showSnackbar, setIsLoading, setComboDesc } =
    useClientContext();
  const { isAuthenticated } = useAuthContext();

  const getStoredClients = (): Client[] => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  };

  const saveClients = (clients: Client[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clients));
    setClients(clients);
  };

  const fetchClients = async () => {
    if (!isAuthenticated()) {
      showSnackbar("Tu sesión ha caducado");
      window.location.reload();
      return;
    }
    setIsLoading(true);
    const data = getStoredClients();
    setClients(data);
    setIsLoading(false);
  };

  const addClient = async (client: Client) => {
    if (!isAuthenticated()) return;

    const data = getStoredClients();
    const newClient: Client = {
      ...client,
      id: uuidv4(),
      saldo: 0,
      fecha: new Date().toLocaleDateString(),
      password: Math.random().toString(36).slice(-8), // demo password
    };
    data.push(newClient);
    saveClients(data);
    showSnackbar(`${client.nombre} agregado con éxito.`);
  };

  const updateClient = async (client: Client) => {
    if (!isAuthenticated()) return;

    const data = getStoredClients();
    const updated = data.map((c) => (c.id === client.id ? client : c));
    saveClients(updated);
    showSnackbar(`${client.nombre} actualizado con éxito.`);
  };

  const deleteClient = async (client: Client) => {
    if (!isAuthenticated()) return;

    const data = getStoredClients();
    const filtered = data.filter((c) => c.id !== client.id);
    saveClients(filtered);
    showSnackbar(`${client.nombre} eliminado con éxito.`);
  };

  const provisionClient = async (client: Client, provisionAmount: number) => {
    if (!isAuthenticated()) return;

    const data = getStoredClients();
    const updated = data.map((c) =>
      c.id === client.id
        ? {
            ...c,
            saldo: (c.saldo || 0) + provisionAmount,
            fecha: new Date().toLocaleDateString(),
          }
        : c
    );
    saveClients(updated);
    showSnackbar(
      `Se aprovisionó correctamente el cliente: ${client.nombre} con $${provisionAmount}`
    );
  };

  const getComboDesc = async () => {
    if (!isAuthenticated()) return;

    setIsLoading(true);
    const data = localStorage.getItem(DISCOUNTS_KEY);
    if (data) {
      setComboDesc(JSON.parse(data));
    } else {
      const defaultDiscounts: discount[] = [
        { idType: 1, type: "Normal", percentage: 10 },
        { idType: 0, type: "Especial", percentage: 15 },
      ];
      localStorage.setItem(DISCOUNTS_KEY, JSON.stringify(defaultDiscounts));
      setComboDesc(defaultDiscounts);
    }
    setIsLoading(false);
  };

  const getReporte = async (date: dateReport, client: Client) => {
    showSnackbar("Reporte generado (demo).");
    console.log(
      `Generando PDF demo para ${client.nombre}, mes ${date.Month}, año ${date.Year}`
    );
    // Aquí podrías simular la descarga de un PDF fake si lo deseas
  };

  return {
    clients: getStoredClients(),
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    provisionClient,
    getComboDesc,
    getReporte,
  };
};

export default useClientApi;
