import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Grid,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { createCar, updateCar } from "../services/api";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: 24,
  p: 3,
};

// Начальное состояние пустой формы
const initialState = {
  stateNumber: "",
  vin: "",
  brand: "",
  model: "",
  yearRelease: "",
  bodyType: "",
  mileage: "",
  transmission: "Механическая",
  engine: {
    engineNumber: "",
    type: "Бензин",
    horsePower: "",
    capacity: "",
  },
};

const AddEditCarModal = ({
  open,
  handleClose,
  onCarUpdated,
  carToEdit,
  clientId,
}) => {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(carToEdit);

  useEffect(() => {
    if (open) {
      if (isEditMode && carToEdit) {
        // Заполняем форму данными для редактирования
        setFormData({
          stateNumber: carToEdit.stateNumber || "",
          vin: carToEdit.vin || "",
          brand: carToEdit.CarModel?.brand || "",
          model: carToEdit.CarModel?.model || "",
          yearRelease: carToEdit.yearRelease || "",
          bodyType: carToEdit.bodyType || "",
          mileage: carToEdit.mileage || "",
          transmission: carToEdit.transmission || "Механическая",
          engine: {
            engineNumber: carToEdit.Engine?.engineNumber || "",
            type: carToEdit.Engine?.type || "Бензин",
            horsePower: carToEdit.Engine?.horsePower || "",
            capacity: carToEdit.Engine?.capacity || "",
          },
        });
      } else {
        // Сбрасываем форму до начального состояния для добавления
        setFormData(initialState);
      }
    }
  }, [carToEdit, isEditMode, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEngineChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      engine: {
        ...prev.engine,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.brand ||
      !formData.model ||
      !formData.stateNumber ||
      !formData.vin ||
      !formData.engine.engineNumber
    ) {
      alert(
        "Пожалуйста, заполните все обязательные поля, отмеченные звёздочкой (*)."
      );
      return;
    }
    setLoading(true);
    try {
      if (isEditMode) {
        // Отправляем только те данные, которые может обработать наш простой update
        await updateCar(carToEdit.carId, {
          stateNumber: formData.stateNumber,
          vin: formData.vin,
          yearRelease: formData.yearRelease,
          bodyType: formData.bodyType,
          mileage: formData.mileage,
          transmission: formData.transmission,
        });
      } else {
        // Отправляем все данные для создания
        await createCar({ ...formData, clientId });
      }
      onCarUpdated();
      handleClose();
    } catch (error) {
      console.error("Ошибка при сохранении автомобиля:", error);
      alert(
        error.response?.data?.message || "Не удалось сохранить автомобиль."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          {isEditMode ? "Редактирование автомобиля" : "Добавление автомобиля"}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Ряд с данными машины */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="brand"
                label="Марка *"
                value={formData.brand}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="model"
                label="Модель *"
                value={formData.model}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="stateNumber"
                label="Гос. номер *"
                value={formData.stateNumber}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="vin"
                label="VIN *"
                value={formData.vin}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="yearRelease"
                label="Год выпуска"
                type="number"
                value={formData.yearRelease}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="mileage"
                label="Пробег"
                type="number"
                value={formData.mileage}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="bodyType"
                label="Тип кузова"
                value={formData.bodyType}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="transmission"
                label="Трансмиссия"
                value={formData.transmission}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>Данные двигателя</Divider>
            </Grid>

            {/* Ряд с данными двигателя */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="engineNumber"
                label="Номер двигателя *"
                value={formData.engine.engineNumber}
                onChange={handleEngineChange}
                fullWidth
                required
                disabled={isEditMode}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth disabled={isEditMode}>
                <InputLabel id="engine-type-label">Тип</InputLabel>
                <Select
                  labelId="engine-type-label"
                  name="type"
                  label="Тип"
                  value={formData.engine.type}
                  onChange={handleEngineChange}
                >
                  <MenuItem value="Бензин">Бензин</MenuItem>
                  <MenuItem value="Дизель">Дизель</MenuItem>
                  <MenuItem value="Электромотор">Электромотор</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="horsePower"
                label="Л.с."
                type="number"
                value={formData.engine.horsePower}
                onChange={handleEngineChange}
                fullWidth
                disabled={isEditMode}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="capacity"
                label="Объем (л)"
                type="number"
                value={formData.engine.capacity}
                onChange={handleEngineChange}
                fullWidth
                disabled={isEditMode}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <Button onClick={handleClose} sx={{ mr: 2 }}>
              Отмена
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Сохранить"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddEditCarModal;
