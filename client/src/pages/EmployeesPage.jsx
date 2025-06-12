import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  // Grid больше не нужен для item, только как контейнер, но мы его заменили на Box
  Typography,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { fetchEmployees } from "../services/api";
import EmployeeCard from "../components/EmployeeCard";
import { Link as RouterLink } from "react-router-dom"; // <-- Добавьте этот импорт

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // === ВОТ ИСПРАВЛЕННЫЙ useEffect ===
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await fetchEmployees();
        setEmployees(response.data);
      } catch (err) {
        setError("Не удалось загрузить список сотрудников");
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, []); // Пустой массив зависимостей - все правильно

  // === ВОТ ИСПРАВЛЕННЫЙ useMemo ===
  const filteredEmployees = useMemo(() => {
    if (!searchTerm) {
      return employees;
    }
    return employees.filter((emp) =>
      `${emp.lastName} ${emp.firstName} ${emp.middleName || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3, display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Поиск по ФИО..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <RouterLink to="/masters/new">
          {" "}
          {/* <-- Оборачиваем кнопку */}
          <IconButton sx={{ ml: 2 }}>
            <AddCircleOutlineIcon color="primary" sx={{ fontSize: 30 }} />
          </IconButton>
        </RouterLink>
      </Paper>

      {/* Используем наш новый подход к сетке через Box */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 3,
        }}
      >
        {filteredEmployees.map((employee) => (
          // Оборачиваем карточку в Link
          <RouterLink
            to={`/masters/${employee.employeeId}`}
            key={employee.employeeId}
            style={{ textDecoration: "none" }}
          >
            <EmployeeCard employee={employee} />
          </RouterLink>
        ))}
      </Box>
    </Box>
  );
};

export default EmployeesPage;
