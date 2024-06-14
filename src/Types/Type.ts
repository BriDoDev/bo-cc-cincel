import { ReactNode } from "react";

export interface ContextType {
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
  }

export interface Client {
    id: string;
    name: string;
    assigned: number;
    used: number;
    balance: number;
    email: string;
    lastProvisioning: Date;
  }
  
  export interface SnackbarState {
    message: string;
    open: boolean;
    autoHideDuration: number;
    onClose: () => void;
  }
  export interface ContextProviderProps {
    children: ReactNode;
  }
  
  export interface userAuthenticate {
    email: string,
    password: string,
  }
  export interface DecodedToken {
    exp: number;
    Email: string;
  }