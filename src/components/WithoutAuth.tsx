import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../hooks/useUserAuth";

export function WithoutAuth({ children }: { children: ReactNode }) {
    const { user } = useUserAuth()
    if (user) {
        return <Navigate to='/' />;
    }
    return children;
}