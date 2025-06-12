import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ClientCard from "../components/ClientCard";
import AddClientModal from "../components/AddClientModal"; // Импортируем модальное окно
import { fetchClients } from "../services/api";
import { Link as RouterLink } from "react-router-dom"; // Импортируем Link

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Состояние для управления модальным окном добавления
  const [isModalOpen, setModalOpen] = useState(false);

  // Функция для загрузки или обновления списка клиентов
  const getClients = async () => {
    try {
      // Не устанавливаем setLoading(true) здесь, чтобы избежать мигания при обновлении
      const response = await fetchClients();
      setClients(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Не удалось загрузить клиентов");
      console.error(err);
    } finally {
      // setLoading(false) будет установлен только при первоначальной загрузке
      if (loading) {
        setLoading(false);
      }
    }
  };

  // Выполняется один раз при монтировании компонента для первоначальной загрузки
  useEffect(() => {
    setLoading(true); // Устанавливаем загрузку только в самом начале
    getClients();
  }, []); // Пустой массив зависимостей означает "выполнить один раз"

  // Фильтрация клиентов на основе поискового запроса
  const filteredClients = useMemo(() => {
    if (!searchTerm) {
      return clients;
    }
    return clients.filter(
      (client) =>
        (client.name &&
          client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.phone && client.phone.includes(searchTerm))
    );
  }, [clients, searchTerm]);

  // Условный рендеринг для первоначальной загрузки
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Условный рендеринг для ошибки
  if (error) {
    return (
      <Typography color="error" textAlign="center">
        {error}
      </Typography>
    );
  }

  return (
    <Box>
      {/* Панель с поиском и кнопкой */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "16px",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Поиск по ФИО или телефону..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {searchTerm && (
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                    <ClearIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
            sx: { borderRadius: "12px" },
          }}
        />
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          sx={{ ml: 2, flexShrink: 0 }}
          onClick={() => setModalOpen(true)} // Открываем модальное окно по клику
        >
          Добавить
        </Button>
      </Paper>

      {/* Список отфильтрованных клиентов */}
      <Box>
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <RouterLink
              to={`/clients/${client.id}`}
              key={client.id}
              style={{ textDecoration: "none" }}
            >
              <Box sx={{ mb: 2, "&:hover": { boxShadow: 6 } }}>
                <ClientCard client={client} />
              </Box>
            </RouterLink>
          ))
        ) : (
          <Typography textAlign="center" sx={{ mt: 4 }}>
            {searchTerm
              ? "Клиенты не найдены"
              : "Список клиентов пуст. Добавьте первого!"}
          </Typography>
        )}
      </Box>

      {/* Модальное окно для добавления клиента */}
      <AddClientModal
        open={isModalOpen}
        handleClose={() => setModalOpen(false)}
        onClientAdded={getClients} // Передаем функцию для обновления списка
      />
    </Box>
  );
};

export default ClientsPage;
