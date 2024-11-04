// PrivateRoute.tsx
import { RootState } from "@/redux/Store";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { token } = useSelector((state: RootState) => state.auth)

  if (token === null) {
    return <Navigate to={'/login'} />
  } else {
    return children;
  }
};

export default PrivateRoute;
