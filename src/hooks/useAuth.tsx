// src/hooks/useAuthApi.ts
import { useAuthContext } from "../Context/AuthContext";
import { userAuthenticate } from "../Types/Type";

const useAuth = () => {
  const { setJwt, setIsLoading } = useAuthContext();

  const authenticate = async ({ email, password }: userAuthenticate) => {
    try {
      setIsLoading(true);

      const validEmail = "mail@mail.com";
      const validPassword = "Asdfg123&";

      if (email === validEmail && password === validPassword) {
        // Simular payload de JWT
        const payload = {
          Email: email,
          exp: Math.floor(Date.now() / 1000) + 60 * 60, // expira en 1 hora
        };

        // Simular encabezado y firma
        const header = {
          alg: "HS256",
          typ: "JWT",
        };

        // Codificar en base64
        const base64Header = btoa(JSON.stringify(header));
        const base64Payload = btoa(JSON.stringify(payload));
        const fakeSignature = "simulada"; // No se firma realmente

        const fakeJwt = `${base64Header}.${base64Payload}.${fakeSignature}`;

        setJwt(fakeJwt, payload.exp);
        setIsLoading(false);
        return "Sesión iniciada con éxito";
      } else {
        setIsLoading(false);
        throw new Error("Correo electrónico o contraseña incorrectos.");
      }
    } catch (e) {
      setIsLoading(false);
      throw e instanceof Error
        ? e
        : new Error("Error desconocido al iniciar sesión.");
    }
  };

  return { authenticate };
};

export default useAuth;
