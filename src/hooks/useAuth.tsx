// src/hooks/useAuthApi.ts
import axios from "axios";
import { useAuthContext } from "../Context/AuthContext";
import { DecodedToken, userAuthenticate } from "../Types/Type";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const { setJwt, setIsLoading } = useAuthContext();

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

      return "Sesión iniciada con éxito";
    } catch (e) {
      setIsLoading(false);
      if (axios.isAxiosError(e)) {
        if (e.response) {
          const status = e.response.status;
          switch (status) {
            case 400:
              throw new Error(
                "Error en la solicitud. Por favor, verifica tu correo electrónico y contraseña."
              );
            case 401:
              throw new Error(
                "Correo electrónico o contraseña incorrectos. Inténtalo nuevamente."
              );
            case 403:
              throw new Error(
                "Correo electrónico o contraseña incorrectos. Inténtalo nuevamente."
              );
            case 404:
              throw new Error(
                "Servicio no encontrado. Por favor, intenta más tarde."
              );
            case 500:
              throw new Error(
                "Error interno del servidor. Por favor, intenta más tarde."
              );
            default:
              throw new Error(
                "Error desconocido al iniciar sesión. Por favor, intenta más tarde."
              );
          }
        } else if (e.request) {
          throw new Error(
            "No se recibió respuesta del servidor. Verifica tu conexión a internet."
          );
        } else {
          throw new Error(
            "Error al configurar la solicitud de inicio de sesión. Por favor, intenta más tarde."
          );
        }
      } else {
        throw new Error(
          "Error desconocido al iniciar sesión. Por favor, intenta más tarde."
        );
      }
    }
  };

  return { authenticate };
};

export default useAuth;
