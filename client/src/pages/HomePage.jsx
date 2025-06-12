import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import Header from "../components/Header";
import AuthModal from "../components/AuthModal"; // Используем новое имя
import backgroundImage from "../assets/background.jpeg";

// Данные-заглушки для карточек преимуществ
const features = [
  {
    title: "Надёжность и поддержка 24/7",
    description:
      "Нас выбирают профессионалы по всей стране — потому что мы знаем, что важно в работе.",
  },
  {
    title: "Более 1000 довольных клиентов",
    description:
      "Нас выбирают профессионалы по всей стране — потому что мы знаем, что важно в работе.",
  },
  {
    title: "Экономия времени и ресурсов",
    description:
      "Интерфейс и функции созданы для мастеров — меньше кликов, больше дел.",
  },
];

const HomePage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [initialMode, setInitialMode] = useState("login"); // 'login' или 'register'

  const handleOpenModal = (mode) => {
    setInitialMode(mode);
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  return (
    // Главный контейнер страницы
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Передаем функции, которые вызывают handleOpenModal с нужным режимом */}
      <Header
        onLoginClick={() => handleOpenModal("login")}
        onRegisterClick={() => handleOpenModal("register")}
      />
      <AuthModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        initialMode={initialMode}
      />

      {/* Секция с текстом на белом фоне */}
      <Box sx={{ bgcolor: "white", py: 8, flexShrink: 0 }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            Выбор профессионалов:
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            sx={{ color: "primary.main", textAlign: "center" }}
          >
            надежность, проверенная временем.
          </Typography>
        </Container>
      </Box>

      {/* Секция с фоном и карточками */}
      <Box
        sx={{
          position: "relative",
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
        }}
      >
        {/* Абсолютно спозиционированный фон */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(4px) brightness(0.7)",
            zIndex: -1,
          }}
        />

        {/* Контейнер для карточек */}
        <Container>
          <Grid container spacing={4} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={3} key={index} sx={{ display: "flex" }}>
                <Card elevation={4} sx={{ width: "100%" }}>
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Typography
                      variant="h6"
                      component="div"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
