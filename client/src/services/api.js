import axios from "axios";

const apiClient = axios.create({
  // Меняем базовый URL, чтобы он соответствовал вашим новым путям
  baseURL: "http://localhost:5000/api/user", // Пример. Замените на свой.
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor остается без изменений
apiClient.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      const token = user?.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Функция для входа в систему
 * @param {string} login
 * @param {string} password
 */
export const loginUser = (login, password) => {
  // Исправляем путь и передаваемые данные
  return apiClient.post("/login", { login, password });
};

/**
 * НОВАЯ ФУНКЦИЯ для регистрации
 * @param {string} login
 * @param {string} password
 */
export const registerUser = (login, password) => {
  return apiClient.post("/registration", { login, password });
};

/**
 * Функция для получения списка всех клиентов
 * @returns {Promise<AxiosResponse<any>>}
 */
export const fetchClients = () => {
  // Важно: для этого запроса нужен другой baseURL, т.к. он не в /api/user
  // Мы переопределяем его прямо в запросе
  return apiClient.get("/client", { baseURL: "http://localhost:5000/api" });
};

/**
 * НОВАЯ ФУНКЦИЯ для создания клиента
 * @param {object} clientData - Данные клиента { firstName, lastName, middleName, phoneNumber, email }
 */
export const createClient = (clientData) => {
  // Этот запрос должен идти на /api/client, поэтому переопределяем baseURL
  return apiClient.post("/client", clientData, {
    baseURL: "http://localhost:5000/api",
  });
};

/**
 * НОВАЯ ФУНКЦИЯ для получения одного клиента по ID
 * @param {string|number} clientId
 */
export const fetchClientById = (clientId) => {
  return apiClient.get(`/client/${clientId}`, {
    baseURL: "http://localhost:5000/api",
  });
};

/**
 * Функция для создания нового автомобиля
 * @param {object} carData - Данные автомобиля
 */
export const createCar = (carData) => {
  return apiClient.post("/car", carData, {
    baseURL: "http://localhost:5000/api",
  });
};

/**
 * Функция для обновления данных автомобиля
 * @param {string|number} carId - ID автомобиля
 * @param {object} carData - Новые данные автомобиля
 */
export const updateCar = (carId, carData) => {
  return apiClient.put(`/car/${carId}`, carData, {
    baseURL: "http://localhost:5000/api",
  });
};

/**
 * Функция для удаления автомобиля
 * @param {string|number} carId - ID автомобиля
 */
export const deleteCar = (carId) => {
  return apiClient.delete(`/car/${carId}`, {
    baseURL: "http://localhost:5000/api",
  });
};

// === SERVICE API ===
export const fetchServices = () => {
  return apiClient.get("/service", { baseURL: "http://localhost:5000/api" });
};

export const createService = (serviceData) => {
  return apiClient.post("/service", serviceData, {
    baseURL: "http://localhost:5000/api",
  });
};

export const updateService = (id, serviceData) => {
  return apiClient.put(`/service/${id}`, serviceData, {
    baseURL: "http://localhost:5000/api",
  });
};

export const deleteService = (id) => {
  return apiClient.delete(`/service/${id}`, {
    baseURL: "http://localhost:5000/api",
  });
};

// === EMPLOYEE API ===
export const fetchEmployees = () => {
  return apiClient.get("/employee", { baseURL: "http://localhost:5000/api" });
};

// === EMPLOYEE API (дополняем) ===
export const fetchEmployeeById = (id) => {
  return apiClient.get(`/employee/${id}`, {
    baseURL: "http://localhost:5000/api",
  });
};

// === EMPLOYEE API (дополняем) ===
export const createEmployee = (employeeData) => {
  return apiClient.post("/employee", employeeData, {
    baseURL: "http://localhost:5000/api",
  });
};

// === EMPLOYEE API (дополняем) ===
export const updateEmployee = (id, employeeData) => {
  return apiClient.put(`/employee/${id}`, employeeData, {
    baseURL: "http://localhost:5000/api",
  });
};

export const deleteEmployee = (id) => {
  return apiClient.delete(`/employee/${id}`, {
    baseURL: "http://localhost:5000/api",
  });
};

// === ORDER API ===
export const fetchOrders = (date) => {
  // date должен быть в формате YYYY-MM-DD
  const params = date ? { date } : {};
  return apiClient.get("/order", {
    params,
    baseURL: "http://localhost:5000/api",
  });
};

// === ORDER API (дополняем) ===
export const createOrder = (orderData) => {
  return apiClient.post("/order", orderData, {
    baseURL: "http://localhost:5000/api",
  });
};

export const fetchOrderById = (id) => {
  return apiClient.get(`/order/${id}`, {
    baseURL: "http://localhost:5000/api",
  });
};

export const updateOrder = (id, orderData) => {
  return apiClient.put(`/order/${id}`, orderData, {
    baseURL: "http://localhost:5000/api",
  });
};

export const deleteOrder = (orderId) => {
  return axios.delete(`/order/${orderId}`, {
    baseURL: "http://localhost:5000/api",
  });
};
