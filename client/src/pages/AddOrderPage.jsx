import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Autocomplete,
  Chip,
  IconButton,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AddIcon from "@mui/icons-material/Add";

// Импортируем все необходимые API функции
import {
  fetchClients,
  fetchEmployees,
  fetchServices,
  createOrder,
} from "../services/api";

// === НАСТРОЙКА DAYJS ДЛЯ РАБОТЫ С ЧАСОВЫМИ ПОЯСАМИ ===
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Применяем плагины
dayjs.extend(utc);
dayjs.extend(timezone);

// Устанавливаем часовой пояс по умолчанию для всех операций dayjs в этом файле
const moscowTimezone = "Europe/Moscow"; // Москва это UTC+3, но можно указать любой

const AddOrderPage = () => {
  const navigate = useNavigate();

  // Состояния для справочников
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);

  // Состояния для формы
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  // === ИЗМЕНЕНИЕ: Устанавливаем начальное время в нужном часовом поясе ===
  const [startTime, setStartTime] = useState(dayjs().tz(moscowTimezone));
  const [endTime, setEndTime] = useState(
    dayjs().tz(moscowTimezone).add(2, "hour")
  );
  const [boxNumber, setBoxNumber] = useState("");
  const [placeNumber, setPlaceNumber] = useState("");

  // Логика для блока "Проводимые работы"
  const [selectedServices, setSelectedServices] = useState([]);
  const [currentService, setCurrentService] = useState(null);
  const [currentServiceCount, setCurrentServiceCount] = useState(1);

  // Состояния для UI
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Загрузка всех справочников при монтировании компонента
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [clientsRes, employeesRes, servicesRes] = await Promise.all([
          fetchClients(),
          fetchEmployees(),
          fetchServices(),
        ]);
        setClients(clientsRes.data);
        setEmployees(employeesRes.data);
        setServices(servicesRes.data);
      } catch (error) {
        console.error("Ошибка загрузки справочников:", error);
        alert("Не удалось загрузить данные для создания заказа.");
      } finally {
        setPageLoading(false);
      }
    };
    loadAllData();
  }, []);

  // Список машин для выбора, который зависит от выбранного клиента
  const carOptions = useMemo(() => {
    return selectedClient ? selectedClient.cars : [];
  }, [selectedClient]);

  // Функции для работы с услугами
  const handleAddService = () => {
    if (currentService && currentServiceCount > 0) {
      const isAlreadyAdded = selectedServices.some(
        (s) => s.service.serviceId === currentService.serviceId
      );
      if (isAlreadyAdded) {
        alert("Эта услуга уже добавлена в заявку.");
        return;
      }
      setSelectedServices((prev) => [
        ...prev,
        { service: currentService, count: parseInt(currentServiceCount, 10) },
      ]);
      setCurrentService(null);
      setCurrentServiceCount(1);
    }
  };

  const handleRemoveService = (serviceIdToRemove) => {
    setSelectedServices((prev) =>
      prev.filter((s) => s.service.serviceId !== serviceIdToRemove)
    );
  };

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClient || !selectedCar || selectedServices.length === 0) {
      alert(
        "Пожалуйста, выберите клиента, автомобиль и добавьте хотя бы одну услугу."
      );
      return;
    }
    setLoading(true);
    const orderData = {
      clientId: selectedClient.id,
      carId: selectedCar.carId,
      employeeId: selectedEmployee?.employeeId,
      createDate: startTime.toISOString(),
      completeDate: endTime.toISOString(),
      boxNumber: boxNumber,
      placeNumber: placeNumber,
      services: selectedServices.map((s) => ({
        serviceId: s.service.serviceId,
        count: s.count,
      })),
    };
    try {
      await createOrder(orderData);
      navigate("/planning");
    } catch (error) {
      console.error("Ошибка создания заказа:", error);
      alert("Ошибка при создании заказа");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Создание заявки
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Данные клиента и автомобиля
        </Typography>
        {/* ИСПОЛЬЗУЕМ FLEXBOX ВМЕСТО GRID ДЛЯ НАДЕЖНОСТИ */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            {" "}
            {/* Занимает половину доступного места */}
            <Autocomplete
              options={clients}
              getOptionLabel={(option) => option.name || ""}
              value={selectedClient}
              onChange={(event, newValue) => {
                setSelectedClient(newValue);
                setSelectedCar(null);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Выберите клиента *" />
              )}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            {" "}
            {/* Занимает вторую половину */}
            <Autocomplete
              options={carOptions}
              getOptionLabel={(option) =>
                `${option.model} (${option.plate})` || ""
              }
              value={selectedCar}
              onChange={(event, newValue) => setSelectedCar(newValue)}
              disabled={!selectedClient}
              renderInput={(params) => (
                <TextField {...params} label="Выберите автомобиль *" />
              )}
            />
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Проводимые работы
        </Typography>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Box sx={{ flex: "2 1 0" }}>
            {" "}
            {/* Занимает 2/4 ширины */}
            <Autocomplete
              options={services}
              getOptionLabel={(option) =>
                `${option.nameService} - ${option.price} руб.` || ""
              }
              value={currentService}
              onChange={(event, newValue) => setCurrentService(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Выберите работу" />
              )}
            />
          </Box>
          <Box sx={{ flex: "1 1 0" }}>
            {" "}
            {/* Занимает 1/4 ширины */}
            <TextField
              label="Количество"
              type="number"
              value={currentServiceCount}
              onChange={(e) => setCurrentServiceCount(e.target.value)}
              fullWidth
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Box>
          <Box sx={{ flex: "1 1 0" }}>
            {" "}
            {/* Занимает 1/4 ширины */}
            <Button
              variant="contained"
              onClick={handleAddService}
              fullWidth
              startIcon={<AddIcon />}
              disabled={!currentService}
              sx={{ height: "56px" }}
            >
              Добавить
            </Button>
          </Box>
        </Box>
        <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {selectedServices.map(({ service, count }) => (
            <Chip
              key={service.serviceId}
              label={`${service.nameService} (${count} шт.)`}
              onDelete={() => handleRemoveService(service.serviceId)}
            />
          ))}
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Информация о заявке
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={employees}
              getOptionLabel={(option) =>
                `${option.lastName} ${option.firstName}` || ""
              }
              value={selectedEmployee}
              onChange={(event, newValue) => setSelectedEmployee(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Выберите мастера" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} />
          {/* Для полей с фиксированной шириной Grid подходит отлично */}
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Начало работ"
                value={startTime}
                onChange={setStartTime}
                timezone={moscowTimezone}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Конец работ"
                value={endTime}
                onChange={setEndTime}
                timezone={moscowTimezone}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Номер бокса"
              value={boxNumber}
              onChange={(e) => setBoxNumber(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Номер места"
              value={placeNumber}
              onChange={(e) => setPlaceNumber(e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Создать"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddOrderPage;
