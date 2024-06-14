// src/components/Dashboard.tsx
import React, { useEffect, useState } from "react";
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
  Add as AddIcon,
} from "@mui/icons-material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DescriptionIcon from "@mui/icons-material/Description";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuthContext } from "../Context/AuthContext";
import { Client } from "../Types/Type";

const Dashboard: React.FC = () => {
  const {
    showSnackbar,
    clients,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    provisionClient,
  } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openProvisionDialog, setOpenProvisionDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const isMdOrSm = useMediaQuery("(max-width:960px)");

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filteredClients = searchQuery
    ? clients.filter(
        (client) =>
          client.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : clients;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenEditDialog = (client: Client) => {
    setSelectedClient(client);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedClient(null);
  };

  const handleSaveEdit = async (values: Client) => {
    await updateClient(values);
    handleCloseEditDialog();
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

  const handleDeleteClient = async () => {
    if (selectedClient) {
      await deleteClient(selectedClient.id);
      handleCloseDeleteDialog();
      showSnackbar("Cliente eliminado con éxito");
    }
  };

  const handleOpenProvisionDialog = (client: Client) => {
    setSelectedClient(client);
    setOpenProvisionDialog(true);
  };

  const handleCloseProvisionDialog = () => {
    setOpenProvisionDialog(false);
    setSelectedClient(null);
  };

  const handleSaveProvision = async (values: {
    provisionType: string;
    provisionAmount: number;
  }) => {
    if (selectedClient) {
      await provisionClient(selectedClient.id, values.provisionAmount);
      handleCloseProvisionDialog();
      showSnackbar("Cliente aprovisionado con éxito");
    }
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleSaveAdd = async (values: Client) => {
    await addClient(values);
    handleCloseAddDialog();
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
                  <TableCell>{client.nombre}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.saldo}</TableCell>
                  <TableCell>{client.fecha}</TableCell>
                  <TableCell>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => handleOpenEditDialog(client)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Aprovisionar">
                      <IconButton
                        onClick={() => handleOpenProvisionDialog(client)}
                      >
                        <AttachMoneyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reporte">
                      <IconButton
                        onClick={() =>
                          showSnackbar("Generación de reporte de cliente")
                        }
                      >
                        <DescriptionIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => handleOpenDeleteDialog(client)}
                      >
                        <DeleteIcon />
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
      {/* Add Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Nuevo Cliente</DialogTitle>
        <Formik
          initialValues={{ nombre: "", email: "" }}
          validationSchema={Yup.object({
            nombre: Yup.string().required("Requerido"),
            email: Yup.string()
              .email("Dirección de correo invalida")
              .required("Requerido"),
          })}
          onSubmit={(values) => handleSaveAdd(values as Client)}
        >
          {({ errors, touched }) => (
            <Form noValidate autoComplete="off">
              <DialogContent>
                <Field
                  as={TextField}
                  nombre="nombre"
                  label="Nombre cliente"
                  fullWidth
                  required
                  error={touched.nombre && Boolean(errors.nombre)}
                  helperText={<ErrorMessage name="nombre" />}
                  margin="dense"
                />
                <Field
                  as={TextField}
                  nombre="email"
                  label="Correo"
                  fullWidth
                  required
                  error={touched.email && Boolean(errors.email)}
                  helperText={<ErrorMessage name="email" />}
                  margin="dense"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseAddDialog}>Cancelar</Button>
                <Button type="submit">Aceptar</Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

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
              nombre: Yup.string().required(
                "Es necesario ingresar un nombre para continuar"
              ),
              email: Yup.string()
                .email("Ingresa un correo electrónico válido")
                .required("Es necesario ingresar un correo para continuar"),
            })}
            onSubmit={(values) => handleSaveEdit(values)}
          >
            {({ errors, touched }) => (
              <Form noValidate autoComplete="off">
                <DialogContent>
                  <Field
                    as={TextField}
                    nombre="nombre"
                    label="Nombre cliente"
                    fullWidth
                    required
                    error={touched.nombre && Boolean(errors.nombre)}
                    helperText={<ErrorMessage name="nombre" />}
                    margin="dense"
                  />
                  <Field
                    as={TextField}
                    nombre="email"
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
          ¿Está seguro que desea eliminar el cliente {selectedClient?.nombre}?
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
        <DialogTitle>
          Aprovisionar Cliente: {selectedClient?.nombre}
        </DialogTitle>
        <Formik
          initialValues={{ provisionType: "", provisionAmount: 0 }}
          validationSchema={Yup.object({
            provisionType: Yup.string().required("Requerido"),
            provisionAmount: Yup.number()
              .min(1, "Debe ser mayor que 0")
              .required("Requerido"),
          })}
          onSubmit={(values) => handleSaveProvision(values)}
        >
          {({ errors, touched }) => (
            <Form noValidate autoComplete="off">
              <DialogContent>
                <FormControl
                  fullWidth
                  margin="dense"
                  error={touched.provisionType && Boolean(errors.provisionType)}
                >
                  <InputLabel>Tipo de aprovisionamiento</InputLabel>
                  <Field
                    as={Select}
                    nombre="provisionType"
                    label="Tipo de aprovisionamiento"
                    fullWidth
                    required
                    error={
                      touched.provisionType && Boolean(errors.provisionType)
                    }
                    helperText={<ErrorMessage name="provisionType" />}
                  >
                    <MenuItem value="type1">Tipo 1</MenuItem>
                    <MenuItem value="type2">Tipo 2</MenuItem>
                  </Field>
                </FormControl>
                <Field
                  as={TextField}
                  nombre="provisionAmount"
                  label="Monto"
                  type="number"
                  fullWidth
                  required
                  margin="dense"
                  error={
                    touched.provisionAmount && Boolean(errors.provisionAmount)
                  }
                  helperText={<ErrorMessage name="provisionAmount" />}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseProvisionDialog}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default Dashboard;
