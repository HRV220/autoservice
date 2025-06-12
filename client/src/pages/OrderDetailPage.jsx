import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Autocomplete,
  TextField,
  IconButton,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  fetchOrderById,
  updateOrder,
  fetchServices,
  deleteOrder,
} from "../services/api";

// Маленький вспомогательный компонент для отображения полей
const InfoField = ({ label, value, component = "div" }) => (
  <Box component={component} sx={{ mb: 2 }}>
    <Typography color="text.secondary" variant="body2" component="div">
      {label}
    </Typography>
    <Typography variant="body1" component="div" sx={{ fontWeight: 500 }}>
      {value || "Не указано"}
    </Typography>
  </Box>
);

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Состояния данных
  const [order, setOrder] = useState(null);
  const [allServices, setAllServices] = useState([]); // Справочник всех услуг

  // Состояния для редактируемых полей
  const [status, setStatus] = useState("");
  const [editableServices, setEditableServices] = useState([]);

  // Состояния для формы добавления услуг
  const [currentService, setCurrentService] = useState(null);
  const [currentServiceCount, setCurrentServiceCount] = useState(1);

  // Состояния UI
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [orderRes, servicesRes] = await Promise.all([
        fetchOrderById(orderId),
        fetchServices(),
      ]);

      const orderData = orderRes.data;
      setOrder(orderData);
      setStatus(orderData.status);
      setAllServices(servicesRes.data);

      const formattedServices = orderData.Services.map((s) => ({
        service: {
          serviceId: s.serviceId,
          nameService: s.nameService,
          price: s.price,
        },
        count: s.Order_Service.count,
      }));
      setEditableServices(formattedServices);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      alert("Не удалось загрузить данные заказа");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddService = () => {
    if (currentService && currentServiceCount > 0) {
      const isAdded = editableServices.some(
        (s) => s.service.serviceId === currentService.serviceId
      );
      if (isAdded) {
        alert("Эта услуга уже в списке.");
        return;
      }

      setEditableServices((prev) => [
        ...prev,
        { service: currentService, count: parseInt(currentServiceCount, 10) },
      ]);
      setCurrentService(null);
      setCurrentServiceCount(1);
    }
  };

  const handleRemoveService = (serviceIdToRemove) => {
    setEditableServices((prev) =>
      prev.filter((s) => s.service.serviceId !== serviceIdToRemove)
    );
  };
  const handleDeleteOrder = async () => {
    if (!window.confirm("Вы уверены, что хотите удалить этот заказ?")) return;

    try {
      await deleteOrder(orderId);
      alert("Заказ удален");
      navigate("/planning"); // или куда нужно
    } catch (error) {
      console.error("Ошибка при удалении заказа:", error);
      alert("Не удалось удалить заказ");
    }
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const updatedData = {
        status,
        services: editableServices.map((s) => ({
          serviceId: s.service.serviceId,
          count: s.count,
        })),
      };

      await updateOrder(orderId, updatedData);
      alert("Заказ успешно обновлен!");
      setSaving(false);
      loadData(); // Перезагружаем данные для отображения актуальной цены
    } catch (error) {
      console.error("Ошибка обновления заказа:", error);
      alert("Не удалось обновить заказ");
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  if (!order) return <Typography>Заказ не найден.</Typography>;

  const fullName = `${order.Client?.lastName || ""} ${
    order.Client?.firstName || ""
  }`.trim();
  const carName = `${order.ClientCar?.CarModel?.brand || ""} ${
    order.ClientCar?.CarModel?.model || ""
  }`.trim();
  const masterName = `${order.Employee?.lastName || ""} ${
    order.Employee?.firstName || ""
  }`.trim();

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Редактирование заказа № {order.orderId}
      </Typography>

      <Grid container spacing={3}>
        {/* Левая колонка с основной информацией */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Информация о заявке
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InfoField label="Клиент" value={fullName} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoField
                  label="Автомобиль"
                  value={`${carName} (${
                    order.ClientCar?.stateNumber || "б/н"
                  })`}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoField label="Мастер" value={masterName || "Не назначен"} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoField
                  label="Бокс"
                  value={
                    order.Box ? `Бокс №${order.Box.boxNumber}` : "Не назначен"
                  }
                />
              </Grid>
            </Grid>
          </Paper>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Проводимые работы
            </Typography>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={12} md={7}>
                <Autocomplete
                  options={allServices}
                  getOptionLabel={(option) =>
                    `${option.nameService} - ${option.price} руб.`
                  }
                  value={currentService}
                  onChange={(e, val) => setCurrentService(val)}
                  renderInput={(params) => (
                    <TextField {...params} label="Добавить работу" />
                  )}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  label="Кол-во"
                  type="number"
                  value={currentServiceCount}
                  onChange={(e) => setCurrentServiceCount(e.target.value)}
                  fullWidth
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <Button
                  variant="outlined"
                  onClick={handleAddService}
                  fullWidth
                  startIcon={<AddIcon />}
                  disabled={!currentService}
                >
                  Добавить
                </Button>
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {editableServices.map(({ service, count }) => (
                <Chip
                  key={service.serviceId}
                  label={`${service.nameService} (${count} шт.)`}
                  onDelete={() => handleRemoveService(service.serviceId)}
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Правая колонка с управлением */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Управление
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="status-select-label">Статус заказа</InputLabel>
              <Select
                labelId="status-select-label"
                value={status}
                label="Статус заказа"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="ожидает">Ожидает</MenuItem>
                <MenuItem value="в процессе">В процессе</MenuItem>
                <MenuItem value="завершен">Завершен</MenuItem>
              </Select>
            </FormControl>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="h5"
              sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              Итог: {new Intl.NumberFormat("ru-RU").format(order.price)} ₽
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSaveChanges}
              disabled={saving}
              sx={{ mt: 1 }}
            >
              {saving ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Сохранить изменения"
              )}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              size="large"
              onClick={handleDeleteOrder}
              sx={{ mt: 1 }}
            >
              Удалить заказ
            </Button>
            <Button
              fullWidth
              variant="text"
              size="large"
              onClick={() => navigate("/planning")}
              sx={{ mt: 1 }}
            >
              Назад к планированию
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetailPage;
