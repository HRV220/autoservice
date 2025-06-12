import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ClientsPage from "./pages/ClientsPage";
import MainLayout from "./layouts/MainLayout";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ClientDetailPage from "./pages/ClientDetailPage";
import PriceListPage from "./pages/PriceListPage";
import EmployeesPage from "./pages/EmployeesPage";
import EmployeeDetailPage from "./pages/EmployeeDetailPage";
import AddEditEmployeePage from "./pages/AddEditEmployeePage";
import PlanningPage from "./pages/PlanningPage"; // <-- Импорт
import AddOrderPage from "./pages/AddOrderPage"; // <-- Импорт

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Публичный роут для главной страницы */}
          <Route path="/" element={<HomePage />} />

          {/* Групповой роут для всех защищенных страниц */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Все страницы, требующие авторизации и общего layout, идут сюда */}
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/:clientId" element={<ClientDetailPage />} />
            <Route path="/price-list" element={<PriceListPage />} />
            <Route path="/masters/new" element={<AddEditEmployeePage />} />
            <Route
              path="/masters/:employeeId/edit"
              element={<AddEditEmployeePage />}
            />{" "}
            {/* <-- НОВЫЙ РОУТ */}
            <Route
              path="/masters/:employeeId"
              element={<EmployeeDetailPage />}
            />
            <Route path="/masters" element={<EmployeesPage />} />
            <Route path="/planning" element={<PlanningPage />} />
            <Route path="/orders/new" element={<AddOrderPage />} />{" "}
            {/* <-- НОВЫЙ РОУТ */}
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
