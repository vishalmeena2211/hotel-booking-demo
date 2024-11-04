// PublicRoute.tsx
import { RootState } from "@/redux/Store";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { token } = useSelector((state: RootState) => state.auth)
    const {user} = useSelector((state: RootState) => state.profile)
    if (token === null) {
        return children;
    } else {
        if(user.user.role === "USER"){
            return <Navigate to={'/hotel-booking'} />
        }else{
            return <Navigate to={'/hotel-manager-booking-approval'} />
        }
    }
};

export default PublicRoute;
