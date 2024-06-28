// src/Pages/Dashboard.tsx
import React, { useEffect, useState, useCallback } from "react";
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
  InputAdornment,
  SelectChangeEvent,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ContentCopy as ContentCopyIcon,
  AccountCircle as AccountCircleIcon,
  Email as EmailIcon,
  Percent as PercentIcon,
} from "@mui/icons-material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DescriptionIcon from "@mui/icons-material/Description";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuthContext } from "../Context/AuthContext";
import { Client, dateReport, discount } from "../Types/Type";
import useClientApi from "../hooks/useClientApi";
import { useClientContext } from "../Context/ClientContext";

const ClientSchema = Yup.object({
  nombre: Yup.string().required("Requerido"),
  email: Yup.string()
    .email("Dirección de correo invalida")
    .required("Requerido"),
});

const ProvisionSchema = Yup.object({
  provisionType: Yup.string().required("Requerido"),
  provisionAmount: Yup.number()
    .min(1, "Debe ser mayor que 0")
    .required("Requerido"),
  freeDesc: Yup.number()
    .min(0, "Debe ser mayor que 0")
    .max(100, "Debe ser menor que 100"),
});

const Dashboard: React.FC = () => {
  const {
    clients,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    provisionClient,
    getComboDesc,
    getReporte,
  } = useClientApi();
  const { isLoading, comboDesc } = useClientContext();
  const { showSnackbar } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogState, setDialogState] = useState({
    openEditDialog: false,
    openDeleteDialog: false,
    openProvisionDialog: false,
    openAddDialog: false,
    openReportDialog: false,
    selectedClient: null as Client | null,
  });
  const [currentClient, setCurrentClient] = useState<Client>({
    id: "",
    nombre: "",
    email: "",
    saldo: 0,
    fecha: "",
    password: "",
  });
  const [visiblePassword, setVisiblePassword] = useState<{
    [key: string]: boolean;
  }>({});
  const isMdOrSm = useMediaQuery("(max-width:960px)");
  const [reportDate, setReportDate] = useState<dateReport>({
    Month: new Date().getMonth() + 1,
    Year: new Date().getFullYear(),
  });

  useEffect(() => {
    getComboDesc();
    fetchClients();
  }, []);

  // Funciones para abrir y cerrar el diálogo de reporte
  const handleReportDialogOpen = (client: Client) => {
    setDialogState((prevState) => ({
      ...prevState,
      openReportDialog: true,
      selectedClient: client,
    }));
  };

  const handleReportDialogClose = () => {
    setDialogState((prevState) => ({
      ...prevState,
      openReportDialog: false,
      selectedClient: null,
    }));
  };

  // Función para manejar la generación del reporte
  const handleGenerateReport = async () => {
    if (dialogState.selectedClient) {
      // const { nombre } = dialogState.selectedClient;
      await getReporte(reportDate, dialogState.selectedClient);
      handleReportDialogClose();
    }
  };

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

  const handleDialogOpen = useCallback(
    (dialogType: string, client?: Client) => {
      setDialogState((prevState) => ({
        ...prevState,
        [dialogType]: true,
        selectedClient: client || null,
      }));
      setCurrentClient(
        client || {
          id: "",
          nombre: "",
          email: "",
          saldo: 0,
          fecha: "",
          password: "",
        }
      );
    },
    []
  );

  const handleDialogClose = useCallback((dialogType: string) => {
    setDialogState((prevState) => ({
      ...prevState,
      [dialogType]: false,
      selectedClient: null,
    }));
    setCurrentClient({
      id: "",
      nombre: "",
      email: "",
      saldo: 0,
      fecha: "",
      password: "",
    });
  }, []);

  const handleSave = async (values: Client) => {
    handleDialogClose(
      dialogState.openAddDialog ? "openAddDialog" : "openEditDialog"
    );
    if (dialogState.openAddDialog) {
      await addClient(values);
    } else if (dialogState.openEditDialog && dialogState.selectedClient) {
      await updateClient({ ...dialogState.selectedClient, ...values });
    }
  };

  const handleDeleteClient = async () => {
    handleDialogClose("openDeleteDialog");
    if (dialogState.selectedClient) {
      await deleteClient(dialogState.selectedClient);
    }
  };

  const handleSaveProvision = async (values: {
    provisionType: number;
    provisionAmount: number;
    freeDesc: number;
  }) => {
    handleDialogClose("openProvisionDialog");
    if (dialogState.selectedClient) {
      const currentDiscount: discount = {
        idType: values.provisionType,
        percentage: values.freeDesc,
        type:
          comboDesc.find((item) => item.idType === values.provisionType)
            ?.type || "",
      };

      await provisionClient(
        dialogState.selectedClient,
        values.provisionAmount,
        currentDiscount
      );
    }
  };

  const togglePasswordVisibility = (clientId: string) => {
    setVisiblePassword((prevState) => ({
      ...prevState,
      [clientId]: !prevState[clientId],
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSnackbar("Password copiado al portapapeles");
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
        {!isMdOrSm ? (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleDialogOpen("openAddDialog")}
            sx={{ minWidth: "max-content" }}
          >
            Nuevo cliente
          </Button>
        ) : (
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => handleDialogOpen("openAddDialog")}
            style={{ position: "fixed", bottom: 16, right: 16 }}
          >
            <AddIcon />
          </Fab>
        )}
      </div>
      {isLoading ? (
        <TableContainer className="border rounded-md shadow-md">
          <Table>
            <TableBody>
              {Array.from({ length: 4 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: 1 }).map((_, colIndex) => (
                    <TableCell key={colIndex} className="h-12">
                      <div className="flex justify-center bg-slate-200 rounded items-center h-8 w-full animate-pulse"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Correo</TableCell>
                  <TableCell>Saldo disponible</TableCell>
                  <TableCell>Último aprovisionamiento</TableCell>
                  <TableCell>Password</TableCell>
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
                        <div className="flex items-center">
                          <TextField
                            type={
                              visiblePassword[client.id] ? "text" : "password"
                            }
                            value={client.password}
                            variant="standard"
                            InputProps={{
                              readOnly: true,
                              endAdornment: (
                                <>
                                  <IconButton
                                    onClick={() =>
                                      togglePasswordVisibility(client.id)
                                    }
                                  >
                                    {visiblePassword[client.id] ? (
                                      <VisibilityIcon />
                                    ) : (
                                      <VisibilityOffIcon />
                                    )}
                                  </IconButton>
                                  <IconButton
                                    onClick={() =>
                                      copyToClipboard(client.password || "")
                                    }
                                  >
                                    <ContentCopyIcon />
                                  </IconButton>
                                </>
                              ),
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Editar">
                          <IconButton
                            onClick={() =>
                              handleDialogOpen("openEditDialog", client)
                            }
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Aprovisionar">
                          <IconButton
                            onClick={() =>
                              handleDialogOpen("openProvisionDialog", client)
                            }
                          >
                            <AttachMoneyIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reporte">
                          <IconButton
                            onClick={() => handleReportDialogOpen(client)}
                          >
                            <DescriptionIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            onClick={() =>
                              handleDialogOpen("openDeleteDialog", client)
                            }
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
        </>
      )}

      <ClientDialog
        open={dialogState.openAddDialog || dialogState.openEditDialog}
        onClose={() =>
          handleDialogClose(
            dialogState.openAddDialog ? "openAddDialog" : "openEditDialog"
          )
        }
        onSave={handleSave}
        client={currentClient}
        title={dialogState.openAddDialog ? "Nuevo Cliente" : "Editar Cliente"}
      />

      <ConfirmDialog
        open={dialogState.openDeleteDialog}
        onClose={() => handleDialogClose("openDeleteDialog")}
        onConfirm={handleDeleteClient}
        title="Eliminar Cliente"
        content={`¿Está seguro que desea eliminar el cliente ${dialogState.selectedClient?.nombre}?`}
      />

      <ProvisionDialog
        open={dialogState.openProvisionDialog}
        onClose={() => handleDialogClose("openProvisionDialog")}
        onSave={handleSaveProvision}
        client={dialogState.selectedClient}
        comboDesc={comboDesc}
      />

      <ReportDialog
        open={dialogState.openReportDialog}
        onClose={handleReportDialogClose}
        onGenerate={handleGenerateReport}
        reportDate={reportDate}
        setReportDate={setReportDate}
      />
    </div>
  );
};

interface ClientDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: Client) => void;
  client: Client;
  title: string;
}

const ClientDialog: React.FC<ClientDialogProps> = ({
  open,
  onClose,
  onSave,
  client,
  title,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <Formik
        initialValues={client}
        validationSchema={ClientSchema}
        onSubmit={(values: Client) => onSave(values)}
      >
        {({ errors, touched }) => (
          <Form noValidate autoComplete="off">
            <DialogContent>
              <Field
                as={TextField}
                name="nombre"
                label="Nombre cliente"
                fullWidth
                required
                error={touched.nombre && Boolean(errors.nombre)}
                helperText={<ErrorMessage name="nombre" />}
                margin="dense"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AccountCircleIcon />
                    </InputAdornment>
                  ),
                }}
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancelar</Button>
              <Button type="submit">Aceptar</Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  content,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onConfirm}>Eliminar</Button>
      </DialogActions>
    </Dialog>
  );
};

interface ProvisionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: {
    provisionType: number;
    provisionAmount: number;
    freeDesc: number;
  }) => void;
  client: Client | null;
  comboDesc: discount[];
}

const ProvisionDialog: React.FC<ProvisionDialogProps> = ({
  open,
  onClose,
  onSave,
  client,
  comboDesc,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Aprovisionar Cliente: {client?.nombre}</DialogTitle>
      <Formik
        initialValues={{ provisionType: 1, provisionAmount: 0, freeDesc: 0 }}
        validationSchema={ProvisionSchema}
        onSubmit={(values) => onSave(values)}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form noValidate autoComplete="off">
            <DialogContent>
              <FormControl
                fullWidth
                margin="dense"
                error={touched.provisionType && Boolean(errors.provisionType)}
              >
                <InputLabel id="provision-type-label">
                  Tipo de aprovisionamiento
                </InputLabel>
                <Field
                  as={Select}
                  labelId="provision-type-label"
                  id="provision-type"
                  name="provisionType"
                  label="Tipo de aprovisionamiento"
                  fullWidth
                  required
                  error={touched.provisionType && Boolean(errors.provisionType)}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    setFieldValue("provisionType", e.target.value);
                    if (e.target.value === 0) {
                      setFieldValue(
                        "freeDesc",
                        comboDesc.find((item) => item.idType === 0)
                          ?.percentage || 0
                      );
                    }
                  }}
                >
                  {}
                  {comboDesc.map((item) => (
                    <MenuItem key={item.idType} value={item.idType}>
                      {`${item.type} ${
                        item.idType === 0 ? "" : `| ${item.percentage}%`
                      }`}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
              {values.provisionType === 0 && (
                <Field
                  as={TextField}
                  name="freeDesc"
                  label="Descuento"
                  type="number"
                  fullWidth
                  required
                  margin="dense"
                  error={touched.freeDesc && Boolean(errors.freeDesc)}
                  helperText={<ErrorMessage name="freeDesc" />}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PercentIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              <Field
                as={TextField}
                name="provisionAmount"
                label="Monto"
                type="number"
                fullWidth
                required
                margin="dense"
                error={
                  touched.provisionAmount && Boolean(errors.provisionAmount)
                }
                helperText={<ErrorMessage name="provisionAmount" />}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AttachMoneyIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancelar</Button>
              <Button type="submit">Guardar</Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  onGenerate: () => void;
  reportDate: dateReport;
  setReportDate: React.Dispatch<React.SetStateAction<dateReport>>;
}

const ReportDialog: React.FC<ReportDialogProps> = ({
  open,
  onClose,
  onGenerate,
  reportDate,
  setReportDate,
}) => {
  const handleDateChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setReportDate((prev) => ({
      ...prev,
      [name]: value as number,
    }));
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2024 + 1 },
    (_, index) => 2024 + index
  );
  const months = [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Generar Reporte</DialogTitle>
      <DialogContent>
        <Formik initialValues={reportDate} onSubmit={onGenerate}>
          {({ setFieldValue }) => (
            <Form>
              <FormControl fullWidth margin="dense">
                <InputLabel id="month-label">Mes</InputLabel>
                <Field
                  as={Select}
                  labelId="month-label"
                  id="Month"
                  name="Month"
                  value={reportDate.Month}
                  onChange={(e: SelectChangeEvent<number>) => {
                    handleDateChange(e);
                    setFieldValue("Month", e.target.value);
                  }}
                >
                  {months.map((month) => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.label}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
              <FormControl fullWidth margin="dense">
                <InputLabel id="year-label">Año</InputLabel>
                <Field
                  as={Select}
                  labelId="year-label"
                  id="Year"
                  name="Year"
                  value={reportDate.Year}
                  onChange={(e: SelectChangeEvent<number>) => {
                    handleDateChange(e);
                    setFieldValue("Year", e.target.value);
                  }}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
              <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button type="submit" color="primary">
                  Generar
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
export default Dashboard;
