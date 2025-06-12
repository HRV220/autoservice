import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Avatar,
  Container,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MainLayout = () => {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose(); // Закрываем меню после выхода
  };

  // Стили для активной ссылки в навигации
  const navLinkStyles = ({ isActive }) => {
    return {
      fontWeight: isActive ? "bold" : "normal",
      color: "white",
      textDecoration: "none",
      padding: "6px 16px",
      borderBottom: isActive ? "2px solid white" : "none",
      borderRadius: "2px",
      margin: "0 8px",
      textTransform: "uppercase", // Добавим для стилистики
      fontSize: "0.875rem",
    };
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#f4f6f8",
      }}
    >
      <AppBar position="static">
        <Toolbar>
          {/* Навигация */}
          <Box>
            <NavLink to="/clients" style={navLinkStyles}>
              Клиенты
            </NavLink>
            {/* Заглушки для других ссылок, чтобы они выглядели неактивными */}
            <NavLink to="/price-list" style={navLinkStyles}>
              Прайс-лист
            </NavLink>
            <NavLink to="/planning" style={navLinkStyles}>
              Планирование
            </NavLink>
            <NavLink to="/masters" style={navLinkStyles}>
              Мастера
            </NavLink>
          </Box>
          {/* Распорка, чтобы увести аватар вправо */}
          <Box sx={{ flexGrow: 1 }} />
          {/* Иконка профиля */}
          <Tooltip title="Настройки аккаунта">
            <IconButton onClick={handleClick} size="small">
              <Avatar sx={{ bgcolor: "secondary.main" }}>М</Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            // Стили для позиционирования меню под аватаром
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleLogout}>Выйти</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Основной контент страницы */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="lg">
          <Outlet /> {/* <-- Сюда будет рендериться ClientsPage */}
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
