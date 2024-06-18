// src/hooks/useAuthApi.ts
import axios from "axios";
import { useAuthContext } from "../Context/AuthContext";
import { DecodedToken, userAuthenticate } from "../Types/Type";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const { setJwt, showSnackbar, setIsLoading } = useAuthContext();

  const authenticate = async ({ email, password }: userAuthenticate) => {
    try {
      setIsLoading(true);
      const API_URL = import.meta.env.VITE_BACKENDURL + "/Api/Login";
      const response = await axios.post(API_URL, { email, password });
      const jwt: string = response.data;
      const decodedToken = jwtDecode<DecodedToken>(jwt);
      const { exp } = decodedToken;

      setJwt(jwt, exp);
      setIsLoading(false);

      showSnackbar("Sesión iniciada con éxito");
    } catch (e) {
      setIsLoading(false);
      if (axios.isAxiosError(e)) {
        if (e.response) {
          const status = e.response.status;
          switch (status) {
            case 400:
              showSnackbar(
                "Error en la solicitud. Por favor, verifica tu correo electrónico y contraseña."
              );
              break;
            case 401:
              showSnackbar(
                "Correo electrónico o contraseña incorrectos. Inténtalo nuevamente."
              );
              break;
            case 403:
              showSnackbar(
                "Acceso denegado. No tienes permiso para iniciar sesión."
              );
              break;
            case 404:
              showSnackbar(
                "Servicio no encontrado. Por favor, intenta más tarde."
              );
              break;
            case 500:
              showSnackbar(
                "Error interno del servidor. Por favor, intenta más tarde."
              );
              break;
            default:
              showSnackbar(
                "Error desconocido al iniciar sesión. Por favor, intenta más tarde."
              );
          }
        } else if (e.request) {
          showSnackbar(
            "No se recibió respuesta del servidor. Verifica tu conexión a internet."
          );
        } else {
          showSnackbar(
            "Error al configurar la solicitud de inicio de sesión. Por favor, intenta más tarde."
          );
        }
      } else {
        showSnackbar(
          "Error desconocido al iniciar sesión. Por favor, intenta más tarde."
        );
      }
    }
  };

  return { authenticate };
};

export default useAuth;
