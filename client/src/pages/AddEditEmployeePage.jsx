import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  OutlinedInput,
} from "@mui/material";
import {
  createEmployee,
  updateEmployee,
  fetchEmployeeById,
} from "../services/api";

const AddEditEmployeePage = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(employeeId);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    phoneNumber: "",
    salary: "",
    experience: 0,
    specializations: [],
    photoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode); // Отдельный лоадер для загрузки данных

  const loadEmployeeData = useCallback(async () => {
    if (isEditMode) {
      try {
        const response = await fetchEmployeeById(employeeId);
        const data = response.data;
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          middleName: data.middleName || "",
          phoneNumber: data.phoneNumber || "",
          salary: data.salary || "",
          experience: data.experience || 0,
          specializations:
            data.Specializations?.map((s) => s.specializationName) || [],
          photoUrl: data.photoUrl || "",
        });
      } catch (error) {
        console.error("Ошибка загрузки сотрудника:", error);
        alert("Не удалось загрузить данные сотрудника для редактирования.");
      } finally {
        setPageLoading(false);
      }
    }
  }, [employeeId, isEditMode]);

  useEffect(() => {
    loadEmployeeData();
  }, [loadEmployeeData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecializationChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData((prev) => ({
      ...prev,
      specializations: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Убедимся, что отправляем только нужные данные
    const dataToSend = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      middleName: formData.middleName,
      phoneNumber: formData.phoneNumber,
      salary: formData.salary,
      experience: formData.experience,
      specializations: formData.specializations,
      photoUrl: formData.photoUrl,
    };
    try {
      if (isEditMode) {
        await updateEmployee(employeeId, dataToSend);
      } else {
        await createEmployee(dataToSend);
      }
      navigate("/masters");
    } catch (error) {
      console.error("Ошибка при сохранении мастера:", error);
      alert(error.response?.data?.message || "Не удалось сохранить мастера.");
    } finally {
      setLoading(false);
    }
  };

  // Заглушка для списка специализаций
  const specializationOptions = [
    "Мастер-жестянщик",
    "Слесарь",
    "Автоэлектрик",
    "Специалист по ходовой части",
    "Мастер по АКПП",
  ];

  if (pageLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {isEditMode ? "Редактирование мастера" : "Добавление мастера"}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Аватар
        </Typography>
        <TextField
          fullWidth
          label="URL фото"
          name="photoUrl"
          value={formData.photoUrl}
          onChange={handleChange}
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Личные данные
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Фамилия *"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Имя *"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Отчество"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Телефон *"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Данные мастера
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="specialization-label">Специализация</InputLabel>
              <Select
                labelId="specialization-label"
                multiple
                value={formData.specializations}
                name="specializations"
                onChange={handleSpecializationChange}
                input={<OutlinedInput label="Специализация" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {specializationOptions.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Зарплата *"
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Опыт (лет)"
              name="experience"
              type="number"
              value={formData.experience}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={() => navigate("/masters")} sx={{ mr: 2 }}>
          Отмена
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Сохранить"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddEditEmployeePage;
