import { TextField, Button, Typography } from "@mui/material";
import Aos from "aos";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";
import useScrollToTopNavigation from "../../hooks/useScrollToTopNavigation";

const ForgotPassword = () => {
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
          // Lógica de cambio de contraseña
        }}
      >
        {({ errors, touched }) => (
          <Form
            className="card w-[600px] items-center mb-20"
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
            <div></div>
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
