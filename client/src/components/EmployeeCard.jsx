import React from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const EmployeeCard = ({ employee }) => {
  const fullName = `${employee.lastName} ${employee.firstName} ${
    employee.middleName || ""
  }`.trim();
  const specializations = employee.Specializations.map(
    (spec) => spec.specializationName
  ).join(", ");

  return (
    // Убираем height: '100%', так как в CSS Grid это не нужно,
    // но оставляем display: 'flex' для внутреннего выравнивания
    <Card sx={{ display: "flex", flexDirection: "column" }}>
      <CardMedia
        sx={{
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.200",
        }}
      >
        {employee.photoUrl ? (
          <img
            src={employee.photoUrl}
            alt={fullName}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <PersonIcon sx={{ fontSize: 80, color: "grey.500" }} />
        )}
      </CardMedia>
      {/* flexGrow все еще нужен, чтобы прижимать зарплату к низу */}
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Box>
          <Typography variant="h6" component="div">
            {fullName}
          </Typography>
          <Typography title={specializations} color="text.secondary" noWrap>
            {specializations || "Специализация не указана"}
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="h6" align="right" color="primary" sx={{ mt: 1 }}>
          {`${new Intl.NumberFormat("ru-RU").format(employee.salary)} ₽`}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;
