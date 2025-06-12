import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Grid,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Вернем крестик для удобства
import { createClient } from "../services/api";

// Стили для модального окна, можно сделать чуть шире
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800, // Сделаем еще шире для 3 полей в ряд
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: 24,
  p: 3,
};

const AddClientModal = ({ open, handleClose, onClientAdded }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    phoneNumber: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const onModalClose = () => {
    handleClose();
    setTimeout(() => {
      setFormData({
        firstName: "",
        lastName: "",
        middleName: "",
        phoneNumber: "",
        email: "",
      });
    }, 300);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phoneNumber) {
      alert("Пожалуйста, заполните обязательные поля: Имя, Фамилия, Телефон.");
      return;
    }

    setLoading(true);
    try {
      await createClient(formData);
      onClientAdded();
      onModalClose();
    } catch (error) {
      console.error("Ошибка при создании клиента:", error);
      alert(error.response?.data?.message || "Не удалось создать клиента.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onModalClose}>
      <Box sx={style}>
        <IconButton
          onClick={onModalClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          variant="h5"
          component="h2"
          sx={{ mb: 2, fontWeight: "bold" }}
        >
          Добавление нового клиента
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Box component="form" onSubmit={handleSubmit}>
          {/* Используем Grid для расположения полей */}
          <Grid container spacing={3}>
            {/* Ряд с ФИО (3 колонки) */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Фамилия *
              </Typography>
              <TextField
                name="lastName"
                placeholder="Введите фамилию"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Имя *
              </Typography>
              <TextField
                name="firstName"
                placeholder="Введите имя"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Отчество
              </Typography>
              <TextField
                name="middleName"
                placeholder="Введите отчество"
                value={formData.middleName}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            {/* Ряд с контактами (2 колонки) */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Телефон *
              </Typography>
              <TextField
                name="phoneNumber"
                placeholder="+7 (___) ___-__-__"
                value={formData.phoneNumber}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Email
              </Typography>
              <TextField
                name="email"
                placeholder="Введите email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ px: 4, py: 1 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Создать клиента"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddClientModal;
