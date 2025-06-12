import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
} from "../services/api";
// Для удаления понадобится диалог, который мы уже использовали
// import { Dialog, DialogActions, ... } from '@mui/material';

const PriceListPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Состояние для редактируемой строки
  const [editRowId, setEditRowId] = useState(null); // ID услуги, которую редактируем
  const [editedData, setEditedData] = useState({}); // Данные в полях ввода

  // Состояние для новой строки
  const [isAdding, setIsAdding] = useState(false);
  const [newData, setNewData] = useState({ nameService: "", price: "" });

  const loadServices = useCallback(async () => {
    try {
      const response = await fetchServices();
      setServices(response.data);
    } catch (err) {
      setError("Не удалось загрузить прайс-лист");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  // Обработчики для редактирования
  const handleEditClick = (service) => {
    setEditRowId(service.serviceId);
    setEditedData({ nameService: service.nameService, price: service.price });
  };

  const handleCancelEdit = () => {
    setEditRowId(null);
    setEditedData({});
  };

  const handleSaveEdit = async () => {
    try {
      await updateService(editRowId, editedData);
      setEditRowId(null);
      setEditedData({});
      await loadServices(); // Перезагружаем данные
    } catch (err) {
      console.error(err);
      alert("Ошибка при обновлении услуги");
    }
  };

  // Обработчики для добавления
  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewData({ nameService: "", price: "" });
  };

  const handleSaveNew = async () => {
    try {
      await createService(newData);
      setIsAdding(false);
      setNewData({ nameService: "", price: "" });
      await loadServices();
    } catch (err) {
      console.error(err);
      alert("Ошибка при создании услуги");
    }
  };

  // Обработчик для удаления
  const handleDelete = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить эту услугу?")) {
      try {
        await deleteService(id);
        await loadServices();
      } catch (err) {
        console.error(err);
        alert("Ошибка при удалении услуги");
      }
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Поиск..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Tooltip title="Добавить новую услугу">
          <IconButton onClick={handleAddClick} sx={{ ml: 2 }}>
            <AddCircleOutlineIcon color="primary" sx={{ fontSize: 30 }} />
          </IconButton>
        </Tooltip>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Название</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Цена
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", width: "120px" }}
              >
                Действия
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Строка для добавления новой услуги */}
            {isAdding && (
              <TableRow>
                <TableCell>
                  <TextField
                    variant="standard"
                    fullWidth
                    value={newData.nameService}
                    onChange={(e) =>
                      setNewData({ ...newData, nameService: e.target.value })
                    }
                  />
                </TableCell>
                <TableCell align="right">
                  <TextField
                    variant="standard"
                    type="number"
                    value={newData.price}
                    onChange={(e) =>
                      setNewData({ ...newData, price: e.target.value })
                    }
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={handleSaveNew}>
                    <CheckIcon color="success" />
                  </IconButton>
                  <IconButton onClick={handleCancelAdd}>
                    <CloseIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            )}

            {/* Список существующих услуг */}
            {services.map((service) => (
              <TableRow key={service.serviceId}>
                {editRowId === service.serviceId ? (
                  <>
                    <TableCell>
                      <TextField
                        variant="standard"
                        fullWidth
                        value={editedData.nameService}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            nameService: e.target.value,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        variant="standard"
                        type="number"
                        value={editedData.price}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            price: e.target.value,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton onClick={handleSaveEdit}>
                        <CheckIcon color="success" />
                      </IconButton>
                      <IconButton onClick={handleCancelEdit}>
                        <CloseIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{service.nameService}</TableCell>
                    <TableCell align="right">{`${service.price} руб.`}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleEditClick(service)}>
                        <EditIcon fontSize="small" color="primary" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(service.serviceId)}
                      >
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PriceListPage;
