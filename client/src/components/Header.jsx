import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

// Принимаем ДВЕ функции как пропсы
const Header = ({ onLoginClick, onRegisterClick }) => {
  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{ backgroundColor: "primary.main" }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          color="inherit"
          startIcon={<AppRegistrationIcon />}
          onClick={onRegisterClick}
          sx={{ mr: 1 }}
        >
          Регистрация
        </Button>
        <Button
          color="inherit"
          startIcon={<LoginIcon />}
          onClick={onLoginClick}
        >
          Войти
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
