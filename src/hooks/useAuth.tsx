const useAuth = () => {
  const isAuthenticated = () => {
    const token = sessionStorage.getItem("jwt");
    const expirationTime = sessionStorage.getItem("jwt_expiration");
    const now = new Date().getTime();

    if (token && expirationTime && now < parseInt(expirationTime)) {
      return true;
    } else {
      return false;
    }
  };

  return {
    isAuthenticated,
  };
};

export default useAuth;
