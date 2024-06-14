// src/main.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./main.css";
import "aos/dist/aos.css";

// Fonts
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// Loader
import Loader from "./Components/Loader.tsx";

// Context Provider
import ContextProvider from "./Context/GlobalContext.tsx";

// Theme Provider
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme.ts";

// Layouts
const Layout = lazy(() => import("./Pages/Layouts/Layout.tsx"));

// Lazy loading for routes
const Login = lazy(() => import("./Pages/Account/Login.tsx"));
const ForgotPassword = lazy(() => import("./Pages/Account/ForgotPassword.tsx"));
const Dashboard = lazy(() => import("./Pages/Dashboard.tsx"));

import PrivateRoute from "./Components/PrivateRoute.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loader />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <Suspense fallback={<Loader />}>
        <ForgotPassword />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Suspense fallback={<Loader />}>
          <Layout>
            <Dashboard />
          </Layout>
        </Suspense>
      </PrivateRoute>
    ),
  },
  // Puedes agregar más rutas privadas aquí
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ContextProvider>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ContextProvider>
  </React.StrictMode>
);

