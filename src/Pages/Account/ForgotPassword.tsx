// src/Pages/Account/ForgotPassword.tsx
import { TextField, Button, Box, InputAdornment } from "@mui/material";
import Aos from "aos";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";
import useScrollToTopNavigation from "../../hooks/useScrollToTopNavigation";
import Logo from "../../../public/img/logo-personal.png";
import { Email } from "@mui/icons-material";
import { useAuthContext } from "../../Context/AuthContext";

const ForgotPassword = () => {
  const { showSnackbar } = useAuthContext();

  const navigateTo = useScrollToTopNavigation();
  // Inicializar AOS
  useEffect(() => {
    Aos.init({
      duration: 1000, // Duración de la animación en milisegundos
      once: true, // Si se establece en true, la animación solo se ejecuta una vez
    });
  }, []);

  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Ingresa un correo electrónico válido")
      .required("Es necesario ingresar un correo para continuar"),
  });

  return (
    <div
      data-aos="fade-up"
      data-aos-delay="00"
      className="w-screen h-screen flex justify-center items-center p-4"
    >
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log(values);
          showSnackbar("Se envió un correo de recuperación de contraseña");
          // Lógica de cambio de contraseña
        }}
      >
        {({ errors, touched }) => (
          <Form
            className="card w-[600px] flex gap-8 items-center mb-20"
            noValidate
            autoComplete="off"
          >
            <Box
              component="img"
              sx={{
                height: 60,
                display: { md: "flex" },
                mr: 1,
              }}
              alt="Logo"
              src={Logo}
            />
            <Field
              data-aos="fade-up"
              data-aos-delay="50"
              as={TextField}
              name="email"
              type="email"
              label="Correo electrónico"
              fullWidth
              required
              autoFocus
              error={touched.email && Boolean(errors.email)}
              helperText={<ErrorMessage name="email" />}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
            <div
              className="w-full flex flex-wrap-reverse md:flex-nowrap xl:flex-nowrap gap-4 mt-6"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <Button
                type="submit"
                fullWidth
                variant="outlined"
                color="primary"
                onClick={() => {
                  navigateTo("/login");
                }}
              >
                Regresar
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Recuperar contraseña
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPassword;
