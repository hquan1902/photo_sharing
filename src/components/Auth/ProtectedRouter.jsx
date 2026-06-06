import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRouter({ user, children }) {
    if (!user) {
        return <Navigate to="/login" replace />
    }
    return children;
}