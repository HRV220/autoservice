import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Link,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../context/AuthContext";

// Стили для модального окна, чтобы оно было по центру
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "16px",
  boxShadow: 24,
  p: 4, // padding
};

const AuthModal = ({ open, handleClose, initialMode = "login" }) => {
  const [mode, setMode] = useState(initialMode);
  const [loginField, setLoginField] = useState("");
  const [password, setPassword] = useState("");
  const { login, register } = useAuth();

  // Этот useEffect будет синхронизировать состояние модалки с тем, что приходит из HomePage
  useEffect(() => {
    if (open) {
      setMode(initialMode);
    }
  }, [initialMode, open]);

  // Сбрасываем поля при смене режима внутри модалки
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "login" ? "register" : "login"));
    setLoginField("");
    setPassword("");
  };

  // Закрытие модалки сбрасывает ее в начальное состояние
  const handleModalClose = () => {
    handleClose();
    // Небольшая задержка, чтобы пользователь не видел смены режима при закрытии
    setTimeout(() => {
      setLoginField("");
      setPassword("");
    }, 300);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!loginField || !password) {
      alert("Пожалуйста, заполните все поля.");
      return;
    }

    let success = false;
    if (mode === "login") {
      success = await login(loginField, password);
    } else {
      success = await register(loginField, password);
    }
    if (success) {
      handleModalClose();
    }
  };

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={handleModalClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          sx={{ mb: 3, fontWeight: "bold" }}
        >
          {mode === "login" ? "Вход" : "Регистрация"}
        </Typography>

        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <Typography variant="body1" sx={{ mb: 1 }}>
            Ваш логин
          </Typography>
          <TextField
            fullWidth
            id="login"
            placeholder="Введите логин"
            variant="outlined"
            value={loginField}
            onChange={(e) => setLoginField(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Typography variant="body1" sx={{ mb: 1 }}>
            Ваш пароль
          </Typography>
          <TextField
            fullWidth
            id="password"
            type="password"
            placeholder="Введите пароль"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ py: 1.5 }}
          >
            {mode === "login" ? "Войти" : "Зарегистрироваться"}
          </Button>

          <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
            {mode === "login" ? "Нет аккаунта? " : "Уже есть аккаунт? "}
            <Link
              component="button"
              variant="body2"
              onClick={toggleMode}
              type="button"
            >
              {mode === "login" ? "Зарегистрируйтесь" : "Войдите"}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default AuthModal;
