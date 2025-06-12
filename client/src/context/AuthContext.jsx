import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/api"; // Импортируем обе функции

// 1. Создаем сам контекст
const AuthContext = createContext(null);

// 2. Создаем "Провайдер" - компонент-обертку
export const AuthProvider = ({ children }) => {
  // Инициализируем состояние, пытаясь достать пользователя из localStorage
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error(
        "Не удалось распарсить пользователя из localStorage",
        error
      );
      return null;
    }
  });

  const navigate = useNavigate();

  // Обновленная функция login
  const login = async (login, password) => {
    // меняем email на login
    try {
      const response = await loginUser(login, password); // используем login
      const { token } = response.data; // Получаем токен из ответа

      if (token) {
        // Так как сервер возвращает только токен, мы сами формируем объект пользователя
        const userData = { login, token };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        navigate("/clients");
        return true;
      }
      return false;
    } catch (error) {
      console.error(
        "Ошибка входа:",
        error.response?.data?.message || error.message
      );
      alert(error.response?.data?.message || "Произошла ошибка при входе");
      return false;
    }
  };

  // НОВАЯ функция register
  const register = async (login, password) => {
    try {
      const response = await registerUser(login, password);
      const { token } = response.data;

      if (token) {
        // После успешной регистрации сразу логиним пользователя
        const userData = { login, token };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        navigate("/clients");
        return true;
      }
      return false;
    } catch (error) {
      console.error(
        "Ошибка регистрации:",
        error.response?.data?.message || error.message
      );
      alert(
        error.response?.data?.message || "Произошла ошибка при регистрации"
      );
      return false;
    }
  };

  // Функция для выхода из системы
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  // Значение, которое будет доступно всем дочерним компонентам
  const value = { user, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Создаем кастомный хук для удобного использования контекста
export const useAuth = () => {
  return useContext(AuthContext);
};
