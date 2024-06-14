import { Client } from "../Types/Type";

export const useClientApi = () => {
  const demoClients: Client[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      balance: 1000,
      lastProvisioning: "2024-06-10",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      balance: 1500,
      lastProvisioning: "2024-06-09",
    },
    {
      id: 3,
      name: "Alice Johnson",
      email: "alice@example.com",
      balance: 500,
      lastProvisioning: "2024-06-08",
    },
  ];

  const getClients = async (): Promise<Client[]> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simular un error
        const errorOccured = false; // Cambiar a `true` para simular un error
        if (errorOccured) {
          reject(new Error("Failed to fetch clients"));
        } else {
          resolve(demoClients);
        }
      }, 500); // Simular un retardo en la llamada a la API
    });
  };

  const addClient = async (client: Client): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        demoClients.push(client);
        resolve();
      }, 500);
    });
  };

  const updateClient = async (client: Client): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = demoClients.findIndex((c) => c.id === client.id);
        if (index !== -1) {
          demoClients[index] = client;
          resolve();
        } else {
          reject(new Error("Cliente no encontrado"));
        }
      }, 500);
    });
  };

  const deleteClient = async (clientId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = demoClients.findIndex((c) => c.id === clientId);
        if (index !== -1) {
          demoClients.splice(index, 1);
          resolve();
        } else {
          reject(new Error("Cliente no encontrado"));
        }
      }, 500);
    });
  };

  const provisionClient = async (
    clientId: number,
    provisionAmount: number
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const client = demoClients.find((c) => c.id === clientId);
        if (client) {
          client.balance += provisionAmount;
          client.lastProvisioning = new Date().toISOString().split("T")[0];
          resolve();
        } else {
          reject(new Error("Cliente no encontrado"));
        }
      }, 500);
    });
  };

  return {
    getClients,
    addClient,
    updateClient,
    deleteClient,
    provisionClient,
  };
};
