import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
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
  TablePagination,
  Fab,
  useMediaQuery,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Report as ReportIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useGlobalContext } from "../Context/GlobalContext";

interface Client {
  id: number;
  name: string;
  email: string;
  balance: number;
  lastProvisioning: string;
}

const App: React.FC = () => {
  const { showSnackbar } = useGlobalContext();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openProvisionDialog, setOpenProvisionDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const isMdOrSm = useMediaQuery("(max-width:960px)");

  const initialClients: Client[] = [
    {
      id: 1,
      name: "Empresa 1 S.A. de C.V",
      email: "empresa1@empresa.com",
      balance: 1000,
      lastProvisioning: "01 May 2024",
    },
    {
      id: 2,
      name: "Empresa 2 S.A. de C.V",
      email: "empresa2@empresa.com",
      balance: 2000,
      lastProvisioning: "02 May 2024",
    },
    {
      id: 3,
      name: "Empresa 3 S.A. de C.V",
      email: "empresa3@empresa.com",
      balance: 3000,
      lastProvisioning: "03 May 2024",
    },
    {
      id: 4,
      name: "Empresa 4 S.A. de C.V",
      email: "empresa4@empresa.com",
      balance: 4000,
      lastProvisioning: "04 May 2024",
    },
    {
      id: 5,
      name: "Empresa 5 S.A. de C.V",
      email: "empresa5@empresa.com",
      balance: 5000,
      lastProvisioning: "05 May 2024",
    },
    {
      id: 6,
      name: "Empresa 6 S.A. de C.V",
      email: "empresa6@empresa.com",
      balance: 6000,
      lastProvisioning: "06 May 2024",
    },
    {
      id: 7,
      name: "Empresa 7 S.A. de C.V",
      email: "empresa7@empresa.com",
      balance: 7000,
      lastProvisioning: "07 May 2024",
    },
    {
      id: 8,
      name: "Empresa 8 S.A. de C.V",
      email: "empresa8@empresa.com",
      balance: 8000,
      lastProvisioning: "08 May 2024",
    },
    {
      id: 9,
      name: "Empresa 9 S.A. de C.V",
      email: "empresa9@empresa.com",
      balance: 9000,
      lastProvisioning: "09 May 2024",
    },
    {
      id: 10,
      name: "Empresa 10 S.A. de C.V",
      email: "empresa10@empresa.com",
      balance: 10000,
      lastProvisioning: "10 May 2024",
    },
    {
      id: 11,
      name: "Empresa 11 S.A. de C.V",
      email: "empresa11@empresa.com",
      balance: 11000,
      lastProvisioning: "11 May 2024",
    },
    {
      id: 12,
      name: "Empresa 12 S.A. de C.V",
      email: "empresa12@empresa.com",
      balance: 12000,
      lastProvisioning: "12 May 2024",
    },
    {
      id: 13,
      name: "Empresa 13 S.A. de C.V",
      email: "empresa13@empresa.com",
      balance: 13000,
      lastProvisioning: "13 May 2024",
    },
    {
      id: 14,
      name: "Empresa 14 S.A. de C.V",
      email: "empresa14@empresa.com",
      balance: 14000,
      lastProvisioning: "14 May 2024",
    },
    {
      id: 15,
      name: "Empresa 15 S.A. de C.V",
      email: "empresa15@empresa.com",
      balance: 15000,
      lastProvisioning: "15 May 2024",
    },
  ];

  useEffect(() => {
    setClients(initialClients);
    setFilteredClients(initialClients);
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredClients(clients);
    } else {
      setFilteredClients(
        clients.filter(
          (client) =>
            client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, clients]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(0); // Reset page to 0 when search query changes
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when rows per page changes
  };

  const handleOpenEditDialog = (client: Client) => {
    setSelectedClient(client);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedClient(null);
  };

  const handleSaveEdit = (values: Client) => {
    const updatedClients = clients.map((client) =>
      client.id === values.id ? values : client
    );
    setClients(updatedClients);
    setFilteredClients(updatedClients);
    setOpenEditDialog(false);
    showSnackbar("Cliente actualizado con éxito");
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
    setClients(clients.filter((client) => client.id !== selectedClient?.id));
    setFilteredClients(
      clients.filter((client) => client.id !== selectedClient?.id)
    );
    setOpenDeleteDialog(false);
    showSnackbar("Cliente eliminado con éxito");
  };

  const handleOpenProvisionDialog = (client: Client) => {
    setSelectedClient(client);
    setOpenProvisionDialog(true);
  };

  const handleCloseProvisionDialog = () => {
    setOpenProvisionDialog(false);
    setSelectedClient(null);
  };

  const handleSaveProvision = (values: {
    provisionType: string;
    provisionAmount: number;
  }) => {
    const updatedClients = clients.map((client) =>
      client.id === selectedClient?.id
        ? { ...client, balance: client.balance + values.provisionAmount }
        : client
    );
    setClients(updatedClients);
    setFilteredClients(updatedClients);
    setOpenProvisionDialog(false);
    showSnackbar("Cliente aprovisionado con éxito");
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleSaveAdd = (values: Client) => {
    const newClient: Client = {
      ...values,
      id: clients.length + 1,
      balance: 0,
      lastProvisioning: new Date().toLocaleDateString(),
    };
    setClients([...clients, newClient]);
    setFilteredClients([...clients, newClient]);
    setOpenAddDialog(false);
    showSnackbar("Cliente agregado con éxito");
  };

  return (
    <div className="card">
      <div className="w-full flex gap-96 justify-stretch">
        <TextField
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Buscar"
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
        />
        {!isMdOrSm && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{ minWidth: "max-content" }}
          >
            Nuevo cliente
          </Button>
        )}
        {isMdOrSm && (
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleOpenAddDialog}
            style={{ position: "fixed", bottom: 16, right: 16 }}
          >
            <AddIcon />
          </Fab>
        )}
      </div>
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
            {filteredClients
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((client) => (
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
                      <IconButton
                        onClick={() => handleOpenDeleteDialog(client)}
                      >
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
                        onClick={() => showSnackbar("Reporte de cliente")}
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
      <TablePagination
        component="div"
        count={filteredClients.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Editar Cliente</DialogTitle>
        {selectedClient && (
          <Formik
            initialValues={selectedClient}
            validationSchema={Yup.object({
              name: Yup.string().required(
                "Es necesario ingresar un nombre para continuar"
              ),
              email: Yup.string()
                .email("Ingresa un correo electrónico válido")
                .required("Es necesario ingresar un correo para continuar"),
            })}
            onSubmit={(values) => {
              handleSaveEdit(values);
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <DialogContent>
                  <Field
                    as={TextField}
                    name="name"
                    label="Nombre cliente"
                    fullWidth
                    required
                    error={touched.name && Boolean(errors.name)}
                    helperText={<ErrorMessage name="name" />}
                    margin="dense"
                  />
                  <Field
                    as={TextField}
                    name="email"
                    label="Correo"
                    fullWidth
                    required
                    error={touched.email && Boolean(errors.email)}
                    helperText={<ErrorMessage name="email" />}
                    margin="dense"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseEditDialog}>Cancelar</Button>
                  <Button type="submit">Aceptar</Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        )}
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        fullWidth
        maxWidth="sm"
      >
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
      <Dialog
        open={openProvisionDialog}
        onClose={handleCloseProvisionDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Aprovisionar Cliente: {selectedClient?.name}</DialogTitle>
        <Formik
          initialValues={{ provisionType: "", provisionAmount: 0 }}
          validationSchema={Yup.object({
            provisionType: Yup.string().required("Required"),
            provisionAmount: Yup.number()
              .required("Required")
              .min(1, "Must be greater than 0"),
          })}
          onSubmit={(values) => {
            handleSaveProvision(values);
          }}
        >
          <Form>
            <DialogContent>
              <FormControl fullWidth margin="dense">
                <InputLabel>Tipo de aprovisionamiento</InputLabel>
                <Field as={Select} name="provisionType">
                  <MenuItem value="type1">Tipo 1</MenuItem>
                  <MenuItem value="type2">Tipo 2</MenuItem>
                </Field>
                <ErrorMessage name="provisionType" component="div" />
              </FormControl>
              <Field
                as={TextField}
                name="provisionAmount"
                label="Monto"
                type="number"
                fullWidth
                margin="dense"
              />
              <ErrorMessage name="provisionAmount" component="div" />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseProvisionDialog}>Cancelar</Button>
              <Button type="submit">Guardar</Button>
            </DialogActions>
          </Form>
        </Formik>
      </Dialog>

      {/* Add Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Nuevo Cliente</DialogTitle>
        <Formik
          initialValues={{ name: "", email: "" }}
          validationSchema={Yup.object({
            name: Yup.string().required("Required"),
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
          })}
          onSubmit={(values) => {
            handleSaveAdd(values as Client);
          }}
        >
          <Form>
            <DialogContent>
              <Field
                as={TextField}
                name="name"
                label="Nombre cliente"
                fullWidth
                margin="dense"
              />
              <ErrorMessage name="name" component="div" />
              <Field
                as={TextField}
                name="email"
                label="Correo"
                fullWidth
                margin="dense"
              />
              <ErrorMessage name="email" component="div" />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAddDialog}>Cancelar</Button>
              <Button type="submit">Aceptar</Button>
            </DialogActions>
          </Form>
        </Formik>
      </Dialog>
    </div>
  );
};

export default App;
