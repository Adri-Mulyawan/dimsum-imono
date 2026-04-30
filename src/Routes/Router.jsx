import { Navigate, createBrowserRouter } from "react-router-dom";

import CustomerLayout from "@/Layouts/CustomerLayout";
import Home from "@/Pages/Customer/Home";
import Cart from "@/Pages/Customer/Cart";
import Checkout from "@/Pages/Customer/Checkout";
import OrderSuccess from "@/Pages/Customer/OrderSuccess";
import PageNotFound from "@/Pages/Error/PageNotFound";

import AdminLayout from "@/Layouts/AdminLayout";
import AdminLogin from "@/Pages/Admin/Login";
import ProtectedAdmin from "@/Pages/Admin/ProtectedAdmin";
import Dashboard from "@/Pages/Admin/Dashboard";
import Orders from "@/Pages/Admin/Orders";
import ManageMenu from "@/Pages/Admin/ManageMenu";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "success",
        element: <OrderSuccess />,
      },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedAdmin>
        <AdminLayout />
      </ProtectedAdmin>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "menu",
        element: <ManageMenu />,
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default router;