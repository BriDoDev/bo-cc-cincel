// src/hooks/useAuth.tsx
import axios from "axios";
import { useGlobalContext } from "../Context/GlobalContext";
import { DecodedToken, userAuthenticate } from "../Types/Type";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const { setJwt } = useGlobalContext();

  const isAuthenticated = (): boolean => {
    const jwt = sessionStorage.getItem("jwt");
    const expirationTime = sessionStorage.getItem("jwt_expiration");
    const now = Math.floor(new Date().getTime() / 1000); // Convertir a segundos

    if (jwt && expirationTime && now < parseInt(expirationTime)) {
      return true;
    } else {
      return false;
    }
  };

  const authenticate = async ({ email, password }: userAuthenticate) => {
    try {
      const API_URL = import.meta.env.VITE_BACKENDURL + "/Api/Login";
      const response = await axios.post(API_URL, { email, password });
      const jwt: string = response.data;
      const decodedToken = jwtDecode<DecodedToken>(jwt);
      const { exp } = decodedToken;
      setJwt(jwt, exp);
      return "Sesión iniciada con éxito";
    } catch (e) {
      console.error(e);
      throw new Error("Error al iniciar sesión");
    }
  };

  return {
    isAuthenticated,
    authenticate,
  };
};

export default useAuth;
