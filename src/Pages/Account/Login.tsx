import { TextField, Button, Typography, Link } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";
import Aos from "aos";
import { useGlobalContext } from "../../Context/GlobalContext";
import useScrollToTopNavigation from "../../hooks/useScrollToTopNavigation";

const Login = () => {
  const { setJwt } = useGlobalContext();
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
    password: Yup.string()
      .required("Es necesario ingresar una contraseña para continuar")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial"
      ),
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
          const dummyJwt: string =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.dummySignatureForTesting";
          const expiresIn: number = 3600; // Token expiration time in seconds (1 hour)
          setJwt(dummyJwt, expiresIn); // Guardar el JWT en el contexto
          console.log(values);
          navigateTo("/");
        }}
      >
        {({ errors, touched }) => (
          <Form
            className="card w-[500px] items-center mb-20"
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
              Iniciar sesión
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
            <Field
              data-aos="fade-up"
              data-aos-delay="100"
              as={TextField}
              name="password"
              type="password"
              label="Contraseña"
              fullWidth
              required
              error={touched.password && Boolean(errors.password)}
              helperText={<ErrorMessage name="password" />}
            />
            <Link
              data-aos="fade-up"
              data-aos-delay="150"
              href="/forgot-password"
              variant="body2"
            >
              Olvide mi contraseña
            </Link>
            <Button
              data-aos="fade-up"
              data-aos-delay="200"
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Iniciar Sesión
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
