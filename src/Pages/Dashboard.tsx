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
import { useGlobalContext } from "../Context/GlobalContext";
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
  } = useGlobalContext();
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
  }, []);

  const filteredClients = searchQuery
    ? clients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : clients;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
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
            onSubmit={(values) => handleSaveEdit(values)}
          >
            {({ errors, touched }) => (
              <Form noValidate autoComplete="off">
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
          onSubmit={(values) => handleSaveProvision(values)}
        >
          <Form noValidate autoComplete="off">
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
          onSubmit={(values) => handleSaveAdd(values as Client)}
        >
          <Form noValidate autoComplete="off">
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

export default Dashboard;
