import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import WorkerDashboardPage from "./pages/WorkerDashboardPage";
import ProtectedRoute from "./layouts/protectedRouters";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";
import Dashboard from "./pages/dashboard";
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<RedirectIfAuthenticated />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Route>

        <Route element={<ProtectedRoute requiredRole="WORKER" />}>
          <Route path="/worker/dashboard" element={<WorkerDashboardPage />} />
        </Route>

        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
