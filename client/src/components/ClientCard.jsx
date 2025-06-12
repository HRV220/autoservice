import React from "react";
import { Paper, Box, Grid, Typography, Chip } from "@mui/material";

const ClientCard = ({ client }) => {
  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: "16px" }}>
      <Grid container spacing={2} alignItems="center">
        {/* Колонка ФИО */}
        <Grid item xs={12} md={3}>
          <Typography variant="caption" color="text.secondary">
            ФИО
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {client.name}
          </Typography>
        </Grid>

        {/* Колонка Номер телефона */}
        <Grid item xs={12} md={3}>
          <Typography variant="caption" color="text.secondary">
            Номер телефона
          </Typography>
          <Typography variant="body1">{client.phone}</Typography>
        </Grid>

        {/* Колонка Автомобили */}
        <Grid item xs={12} md={6}>
          <Typography variant="caption" color="text.secondary">
            Автомобили
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", mt: 0.5 }}>
            {client.cars.map((car, index) => (
              <Chip
                key={index}
                label={`${car.model} | Номер: ${car.plate}`}
                sx={{ mr: 1, mb: 1, bgcolor: "#e0e0e0" }}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ClientCard;
