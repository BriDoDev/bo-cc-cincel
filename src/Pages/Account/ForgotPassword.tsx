import { TextField, Button, Typography } from "@mui/material";
import Aos from "aos";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";

const ForgotPassword = () => {
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
      className="w-screen h-screen flex justify-center items-center"
    >
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log(values);
          // Lógica de cambio de contraseña
        }}
      >
        {({ errors, touched }) => (
          <Form
            className="card w-[500px] items-center"
            noValidate
            autoComplete="off"
          >
            <Typography
              data-aos="fade-up"
              data-aos-delay="00"
              variant="h4"
              gutterBottom
              sx={{ mt: 2 }}
            >
              Recupera tu contraseña
            </Typography>
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
            />
            <Button
              data-aos="fade-up"
              data-aos-delay="100"
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Recuperar contraseña
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPassword;
