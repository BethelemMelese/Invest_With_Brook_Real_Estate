import { api } from "./api/axiosConfig";
import { useEffect, useState } from "react";
import Login from "../components/login";

interface Props {
  component: React.ComponentType;
  path?: string;
  roles?: Array<any>;
}

export const ProtectedRoute: React.FC<Props> = ({
  component: RouteComponent,
  roles,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    api
      .get("/admin/auth")
      .then((response: any) => {
        setIsAuthenticated(response.data.isAuthenticated);
      })
      .catch((error: any) => {
        setIsAuthenticated(false);
      });
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (isAuthenticated == false) {
    return <Login />;
  } else {
    return <RouteComponent />;
  }
};
