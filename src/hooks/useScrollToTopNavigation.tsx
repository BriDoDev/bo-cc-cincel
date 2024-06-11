import { useNavigate } from "react-router-dom";

const useScrollToTopNavigation = () => {
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return navigateTo;
};

export default useScrollToTopNavigation;
