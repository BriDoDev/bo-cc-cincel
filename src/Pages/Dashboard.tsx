import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  TextField,
  Snackbar,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Report as ReportIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useSnackbar } from "../hooks/useSnackbar";

interface Client {
  id: number;
  name: string;
  email: string;
  balance: number;
  lastProvisioning: string;
}

const Dashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openProvisionDialog, setOpenProvisionDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [provisionType, setProvisionType] = useState("");
  const [provisionAmount, setProvisionAmount] = useState(0);
  const { showSnackbar, snackbarProps } = useSnackbar();

  useEffect(() => {
    // Fetch clients from API or define them statically
    const initialClients: Client[] = [
      {
        id: 1,
        name: "Empresa S.A. de C.V",
        email: "empresa@empresa.com",
        balance: 1000,
        lastProvisioning: "05 May 2024",
      },
      {
        id: 2,
        name: "Empresa 2 S.A. de C.V",
        email: "empresa2@empresa2.com",
        balance: 1000,
        lastProvisioning: "05 April 2024",
      },
      {
        id: 3,
        name: "Empresa S.A. de C.V",
        email: "empresa@empresa.com",
        balance: 1000,
        lastProvisioning: "05 May 2024",
      },
      {
        id: 4,
        name: "Empresa 2 S.A. de C.V",
        email: "empresa2@empresa2.com",
        balance: 1000,
        lastProvisioning: "05 April 2024",
      },
      {
        id: 5,
        name: "Empresa S.A. de C.V",
        email: "empresa@empresa.com",
        balance: 1000,
        lastProvisioning: "05 May 2024",
      },
      {
        id: 6,
        name: "Empresa 2 S.A. de C.V",
        email: "empresa2@empresa2.com",
        balance: 1000,
        lastProvisioning: "05 April 2024",
      },
      {
        id: 7,
        name: "Empresa S.A. de C.V",
        email: "empresa@empresa.com",
        balance: 1000,
        lastProvisioning: "05 May 2024",
      },
      {
        id: 8,
        name: "Empresa 2 S.A. de C.V",
        email: "empresa2@empresa2.com",
        balance: 1000,
        lastProvisioning: "05 April 2024",
      },
      {
        id: 9,
        name: "Empresa S.A. de C.V",
        email: "empresa@empresa.com",
        balance: 1000,
        lastProvisioning: "05 May 2024",
      },
      {
        id: 10,
        name: "Empresa 2 S.A. de C.V",
        email: "empresa2@empresa2.com",
        balance: 1000,
        lastProvisioning: "05 April 2024",
      },
      {
        id: 11,
        name: "Empresa S.A. de C.V",
        email: "empresa@empresa.com",
        balance: 1000,
        lastProvisioning: "05 May 2024",
      },
      {
        id: 12,
        name: "Empresa 2 S.A. de C.V",
        email: "empresa2@empresa2.com",
        balance: 1000,
        lastProvisioning: "05 April 2024",
      },
    ];
    setClients(initialClients);
    setFilteredClients(initialClients);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "") {
      setFilteredClients(clients);
    } else {
      setFilteredClients(
        clients.filter(
          (client) =>
            client.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            client.email.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
  };

  const handleOpenEditDialog = (client: Client) => {
    setSelectedClient(client);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedClient(null);
  };

  const handleSaveEdit = () => {
    // Logic to save edited client
    setOpenEditDialog(false);
    showSnackbar("Client updated successfully", "success");
  };

  const handleOpenDeleteDialog = (client: Client) => {
    setSelectedClient(client);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedClient(null);
  };

  const handleDeleteClient = () => {
    // Logic to delete client
    setClients(clients.filter((client) => client.id !== selectedClient?.id));
    setOpenDeleteDialog(false);
    showSnackbar("Client deleted successfully", "success");
  };

  const handleOpenProvisionDialog = (client: Client) => {
    setSelectedClient(client);
    setOpenProvisionDialog(true);
  };

  const handleCloseProvisionDialog = () => {
    setOpenProvisionDialog(false);
    setSelectedClient(null);
  };

  const handleSaveProvision = () => {
    // Logic to provision client
    setOpenProvisionDialog(false);
    showSnackbar("Client provisioned successfully", "success");
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleSaveAdd = () => {
    // Logic to add client
    setOpenAddDialog(false);
    showSnackbar("Client added successfully", "success");
  };

  return (
    <Container>
      <TextField
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Buscar"
        InputProps={{
          endAdornment: <SearchIcon />,
        }}
      />
      <Button startIcon={<AddIcon />} onClick={handleOpenAddDialog}>
        Nuevo cliente
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Saldo disponible</TableCell>
              <TableCell>Último aprovisionamiento</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.balance}</TableCell>
                <TableCell>{client.lastProvisioning}</TableCell>
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => handleOpenEditDialog(client)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleOpenDeleteDialog(client)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Aprovisionar">
                    <IconButton
                      onClick={() => handleOpenProvisionDialog(client)}
                    >
                      <ReportIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reporte">
                    <IconButton
                      onClick={() => showSnackbar("Reporte de cliente", "info")}
                    >
                      <ReportIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Editar Cliente</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre cliente"
            value={selectedClient?.name}
            onChange={(e) =>
              setSelectedClient({ ...selectedClient!, name: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Correo"
            value={selectedClient?.email}
            onChange={(e) =>
              setSelectedClient({ ...selectedClient!, email: e.target.value })
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancelar</Button>
          <Button onClick={handleSaveEdit}>Aceptar</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Eliminar Cliente</DialogTitle>
        <DialogContent>
          ¿Está seguro que desea eliminar el cliente {selectedClient?.name}?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDeleteClient}>Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* Provision Dialog */}
      <Dialog open={openProvisionDialog} onClose={handleCloseProvisionDialog}>
        <DialogTitle>Aprovisionar Cliente: {selectedClient?.name}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Tipo de aprovisionamiento</InputLabel>
            <Select
              value={provisionType}
              onChange={(e) => setProvisionType(e.target.value as string)}
            >
              <MenuItem value="type1">Tipo 1</MenuItem>
              <MenuItem value="type2">Tipo 2</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Monto"
            value={provisionAmount}
            onChange={(e) => setProvisionAmount(Number(e.target.value))}
            type="number"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProvisionDialog}>Cancelar</Button>
          <Button onClick={handleSaveProvision}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Nuevo Cliente</DialogTitle>
        <DialogContent>
          <TextField label="Nombre cliente" fullWidth />
          <TextField label="Correo" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancelar</Button>
          <Button onClick={handleSaveAdd}>Aceptar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar {...snackbarProps} />
    </Container>
  );
};

export default Dashboard;
