import { Navigate } from "react-router-dom";

const ProtectedAdmin = ({ children }) => {
  const admin = localStorage.getItem("admin");

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedAdmin;