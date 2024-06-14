// src/hooks/useAuthApi.ts
import axios from "axios";
import { useAuthContext } from "../Context/AuthContext";
import { DecodedToken, userAuthenticate } from "../Types/Type";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const { setJwt, showSnackbar } = useAuthContext();

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
      showSnackbar("Error al iniciar sesión");
      throw new Error("Error al iniciar sesión");
    }
  };

  return { authenticate };
};

export default useAuth;
