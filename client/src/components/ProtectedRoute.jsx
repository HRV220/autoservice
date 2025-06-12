import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // Если пользователя нет, перенаправляем на главную страницу
    return <Navigate to="/" replace />;
  }

  // Если пользователь есть, рендерим дочерний компонент (например, MainLayout)
  return children;
};

export default ProtectedRoute;
