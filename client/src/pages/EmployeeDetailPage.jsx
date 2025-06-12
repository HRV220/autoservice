import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Avatar,
  Button,
  CircularProgress,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { fetchEmployeeById, deleteEmployee } from "../services/api";

const EmployeeDetailPage = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const loadEmployeeData = useCallback(async () => {
    try {
      const response = await fetchEmployeeById(employeeId);
      setEmployee(response.data);
    } catch (err) {
      setError("Не удалось загрузить данные сотрудника.");
      console.error("Ошибка загрузки сотрудника:", err);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    setLoading(true);
    loadEmployeeData();
  }, [loadEmployeeData]);

  const handleDelete = async () => {
    try {
      await deleteEmployee(employeeId);
      setDeleteDialogOpen(false);
      navigate("/masters"); // Возвращаемся к списку после удаления
    } catch (err) {
      console.error("Ошибка при удалении сотрудника:", err);
      alert("Ошибка при удалении сотрудника");
      setDeleteDialogOpen(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Typography color="error" textAlign="center" variant="h5">
        {error}
      </Typography>
    );
  if (!employee)
    return (
      <Typography textAlign="center" variant="h5">
        Сотрудник не найден.
      </Typography>
    );

  const fullName = `${employee.lastName} ${employee.firstName} ${
    employee.middleName || ""
  }`.trim();

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, borderRadius: "16px" }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item>
            <Avatar sx={{ width: 150, height: 150, bgcolor: "grey.200" }}>
              {employee.photoUrl ? (
                <img
                  src={employee.photoUrl}
                  alt={fullName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <PersonIcon sx={{ fontSize: 100, color: "grey.500" }} />
              )}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h3" component="h1" sx={{ fontWeight: "bold" }}>
              {fullName}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Телефон: {employee.phoneNumber}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Опыт работы: {employee.experience} лет
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Зарплата: {new Intl.NumberFormat("ru-RU").format(employee.salary)}{" "}
              ₽
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Специализации:
              </Typography>
              {employee.Specializations &&
              employee.Specializations.length > 0 ? (
                employee.Specializations.map((spec) => (
                  <Chip
                    key={spec.specializationId || spec.specializationName}
                    label={spec.specializationName}
                    sx={{ mr: 1, mt: 1 }}
                  />
                ))
              ) : (
                <Typography>Специализации не указаны.</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          onClick={() => navigate("/masters")}
          sx={{ mr: 2 }}
        >
          Назад к списку
        </Button>
        <Button
          variant="contained"
          component={RouterLink}
          to={`/masters/${employeeId}/edit`}
          sx={{ mr: 2 }}
        >
          Редактировать
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setDeleteDialogOpen(true)}
        >
          Удалить
        </Button>
      </Box>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить сотрудника {fullName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleDelete} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeDetailPage;
