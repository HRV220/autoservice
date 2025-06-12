import React from "react";
import { Paper, Typography, Box, Tooltip } from "@mui/material";

const statusColors = {
  ожидает: "success.main",
  "в процессе": "warning.main",
  завершен: "error.main",
};

const OrderCard = ({ order }) => {
  const masterName = order.Employee
    ? `${order.Employee.lastName} ${order.Employee.firstName.charAt(0)}.`
    : "Не назначен";
  const clientName = order.Client
    ? `${order.Client.lastName} ${order.Client.firstName.charAt(0)}.`
    : "Не назначен";
  const services = order.Services.map((s) => s.nameService).join("; ");

  return (
    <Paper
      elevation={3}
      sx={{
        p: 1,
        backgroundColor: "grey.100",
        height: "100%",
        borderLeft: 5,
        borderColor: statusColors[order.status] || "grey.500",
      }}
    >
      <Typography variant="body2" fontWeight="bold">
        Заказ №{order.orderId}
      </Typography>
      <Typography variant="caption" display="block">
        Мастер: {masterName}
      </Typography>
      <Typography variant="caption" display="block">
        Клиент: {clientName}
      </Typography>
      <Tooltip title={services}>
        <Typography variant="caption" display="block" noWrap>
          {services || "Услуги не указаны"}
        </Typography>
      </Tooltip>
    </Paper>
  );
};

export default OrderCard;
