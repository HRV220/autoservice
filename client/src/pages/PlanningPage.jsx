import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import dayjs from "dayjs";
import { fetchOrders } from "../services/api";
import OrderCard from "../components/OrderCard";
import { Link as RouterLink } from "react-router-dom"; // Добавляем импорт

// Константы для сетки
const HOURS = Array.from({ length: 13 }, (_, i) => 8 + i); // с 8:00 до 20:00
const BOXES = ["Бокс №1", "Бокс №2", "Бокс №3", "Бокс №4"];

const PlanningPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const dateString = selectedDate.format("YYYY-MM-DD");
      const response = await fetchOrders(dateString);
      setOrders(response.data);
    } catch (error) {
      console.error("Ошибка загрузки заказов:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const { scheduledOrders, unscheduledOrders } = useMemo(() => {
    const scheduled = [];
    const unscheduled = [];
    orders.forEach((order) => {
      if (order.Box) {
        scheduled.push(order);
      } else {
        unscheduled.push(order);
      }
    });
    return { scheduledOrders: scheduled, unscheduledOrders: unscheduled };
  }, [orders]);

  const getOrderStyle = (order) => {
    const orderDate = new Date(order.createDate);
    const startHour = orderDate.getHours();
    const startMinute = orderDate.getMinutes();
    const durationHours = 2; // Предполагаемая длительность заказа

    const boxMapping = { 1: 0, 2: 1, 3: 2, 4: 3 }; // Сопоставление номера бокса с индексом массива
    const boxIndex = order.Box ? boxMapping[order.Box.boxNumber] : -1;

    if (boxIndex === -1 || boxIndex >= BOXES.length) {
      return { display: "none" };
    }
    const gridRow = boxIndex + 2;

    const gridColumnStart =
      (startHour - 8) * 2 + Math.floor(startMinute / 30) + 2;
    const gridColumnSpan = durationHours * 2;

    return {
      gridRow: gridRow,
      gridColumn: `${gridColumnStart} / span ${gridColumnSpan}`,
      p: 0.5, // Небольшой внутренний отступ для карточки
      minWidth: 0, // Важно для правильного отображения внутри grid
    };
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3, display: "flex", alignItems: "center" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Выберите дату"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
          />
        </LocalizationProvider>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Блок с сеткой планирования */}
          <Paper sx={{ p: 2, overflowX: "auto", mb: 3 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "100px repeat(24, 1fr)",
                gridTemplateRows: `40px repeat(${BOXES.length}, 100px)`,
                minWidth: "1500px",
                gap: "1px", // Небольшой отступ между ячейками
                backgroundColor: "#e0e0e0", // Цвет для линий сетки
              }}
            >
              {/* Пустая ячейка в углу */}
              <Box
                sx={{ gridRow: 1, gridColumn: 1, bgcolor: "background.paper" }}
              />

              {/* Рендеринг времени и боксов */}
              {HOURS.map((hour) => (
                <Typography
                  key={`time-${hour}`}
                  align="center"
                  sx={{
                    gridRow: 1,
                    gridColumn: `${(hour - 8) * 2 + 2} / span 2`,
                    bgcolor: "background.paper",
                    borderBottom: "1px solid #e0e0e0",
                    pt: 1,
                  }}
                >{`${hour}:00`}</Typography>
              ))}
              {BOXES.map((boxName, index) => (
                <React.Fragment key={`row-${index}`}>
                  <Typography
                    align="center"
                    sx={{
                      gridRow: index + 2,
                      gridColumn: 1,
                      bgcolor: "background.paper",
                      borderRight: "1px solid #e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {boxName}
                  </Typography>
                  {/* Ячейки для часов в строке бокса */}
                  {Array.from({ length: 24 }).map((_, colIndex) => (
                    <Box
                      key={`cell-${index}-${colIndex}`}
                      sx={{
                        gridRow: index + 2,
                        gridColumn: colIndex + 2,
                        bgcolor: "background.paper",
                      }}
                    />
                  ))}
                </React.Fragment>
              ))}

              {/* Рендеринг запланированных заказов */}
              {scheduledOrders.map((order) => (
                <Box key={order.orderId} sx={getOrderStyle(order)}>
                  <OrderCard order={order} />
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Блок "Входящие заказы" */}
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mr: 1 }}>
                Входящие заказы
              </Typography>
              <RouterLink to="/orders/new">
                <IconButton>
                  <AddCircleOutlineIcon color="primary" />
                </IconButton>
              </RouterLink>
            </Box>
            {unscheduledOrders.length > 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  overflowX: "auto",
                  pb: 1,
                }}
              >
                {unscheduledOrders.map((order) => (
                  <Box
                    key={order.orderId}
                    sx={{ minWidth: 250, flexShrink: 0 }}
                  >
                    <OrderCard order={order} />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">
                Нет входящих заказов на выбранную дату.
              </Typography>
            )}
          </Paper>
        </>
      )}
    </Box>
  );
};

export default PlanningPage;
