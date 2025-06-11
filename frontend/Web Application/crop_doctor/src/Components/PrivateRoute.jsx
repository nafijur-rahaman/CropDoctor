import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { auth } = useAuth();

  return auth && auth.token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
