import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Avatar,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { fetchClientById, deleteCar } from "../services/api";
import AddEditCarModal from "../components/AddEditCarModal";

const carPlaceholderImage =
  "https://via.placeholder.com/300x200.png?text=No+Image";

const ClientCarCard = ({ car, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => {
    onEdit(car);
    handleMenuClose();
  };
  const handleDelete = () => {
    onDelete(car);
    handleMenuClose();
  };

  return (
    <Card sx={{ position: "relative" }}>
      <IconButton
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          backgroundColor: "rgba(255,255,255,0.7)",
        }}
        onClick={handleMenuClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>Редактировать</MenuItem>
        <MenuItem onClick={handleDelete}>Удалить</MenuItem>
      </Menu>
      <CardMedia
        component="img"
        height="160"
        image={car.imageUrl || carPlaceholderImage}
        alt={`${car.CarModel?.brand} ${car.CarModel?.model}`}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">{`${
          car.CarModel?.brand || ""
        } ${car.CarModel?.model || "Модель не указана"}`}</Typography>
        <Typography variant="body2" color="text.secondary">{`${
          car.bodyType || ""
        }, ${car.transmission || ""}`}</Typography>
        <Typography variant="caption" display="block">
          VIN: {car.vin}
        </Typography>
        <Typography variant="caption" display="block">
          Гос.номер: {car.stateNumber}
        </Typography>
      </CardContent>
    </Card>
  );
};

const ClientDetailPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCarModalOpen, setCarModalOpen] = useState(false);
  const [carToEdit, setCarToEdit] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);

  const [notificationType, setNotificationType] = useState("email");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const loadClientData = useCallback(async () => {
    try {
      const response = await fetchClientById(clientId);
      setClient(response.data);
    } catch (err) {
      console.error("Ошибка загрузки данных клиента:", err);
      setError("Не удалось загрузить данные клиента.");
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    setLoading(true);
    loadClientData();
  }, [loadClientData]);

  const handleSendNotification = useCallback(() => {
    if (!notificationMessage) {
      alert("Введите текст сообщения");
      return;
    }
    setSnackbarMessage("Сообщение успешно отправлено!");
    setSnackbarOpen(true);
    setNotificationMessage("");
  }, [notificationMessage]);

  const handleSnackbarClose = useCallback((event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  }, []);

  const handleOpenAddCarModal = useCallback(() => {
    setCarToEdit(null);
    setCarModalOpen(true);
  }, []);

  const handleOpenEditCarModal = useCallback((car) => {
    setCarToEdit(car);
    setCarModalOpen(true);
  }, []);

  const handleOpenDeleteDialog = useCallback((car) => {
    setCarToDelete(car);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!carToDelete) return;
    try {
      await deleteCar(carToDelete.carId);
      setCarToDelete(null);
      setDeleteDialogOpen(false);
      await loadClientData();
    } catch (error) {
      console.error("Ошибка при удалении автомобиля:", error);
      alert(error.response?.data?.message || "Не удалось удалить автомобиль.");
    }
  }, [carToDelete, loadClientData]);

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
  if (!client)
    return (
      <Typography textAlign="center" variant="h5">
        Клиент не найден.
      </Typography>
    );

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: "16px" }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Личные данные
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={2}>
            <Avatar sx={{ width: 120, height: 120, bgcolor: "primary.light" }}>
              <PersonIcon sx={{ fontSize: 80 }} />
            </Avatar>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>{`${
              client.lastName
            } ${client.firstName} ${client.middleName || ""}`}</Typography>
            <Typography variant="h6" color="text.secondary">
              тел. {client.phoneNumber}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Уведомление клиента
            </Typography>
            <RadioGroup
              row
              value={notificationType}
              onChange={(e) => setNotificationType(e.target.value)}
            >
              <FormControlLabel
                value="email"
                control={<Radio />}
                label="Письмо на почту"
              />
              <FormControlLabel
                value="sms"
                control={<Radio />}
                label="Смс по номеру телефона"
              />
            </RadioGroup>
            <TextField
              label="Сообщение"
              multiline
              rows={2}
              fullWidth
              variant="outlined"
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{ mt: 1 }}
              onClick={handleSendNotification}
            >
              Отправить
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: "16px" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mr: 1 }}>
            Автомобили
          </Typography>
          <IconButton color="primary" onClick={handleOpenAddCarModal}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Box>
        <Grid container spacing={3}>
          {client.ClientCars && client.ClientCars.length > 0 ? (
            client.ClientCars.map((car) => (
              <Grid item key={car.carId} xs={12} sm={6} md={4} lg={3}>
                <ClientCarCard
                  car={car}
                  onEdit={handleOpenEditCarModal}
                  onDelete={handleOpenDeleteDialog}
                />
              </Grid>
            ))
          ) : (
            <Typography sx={{ ml: 2 }}>
              У клиента нет зарегистрированных автомобилей.
            </Typography>
          )}
        </Grid>
      </Paper>

      <AddEditCarModal
        open={isCarModalOpen}
        handleClose={() => setCarModalOpen(false)}
        onCarUpdated={loadClientData}
        carToEdit={carToEdit}
        clientId={clientId}
      />

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить автомобиль{" "}
            {carToDelete?.CarModel?.brand} {carToDelete?.CarModel?.model} с
            госномером {carToDelete?.stateNumber}? Это действие необратимо.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientDetailPage;
