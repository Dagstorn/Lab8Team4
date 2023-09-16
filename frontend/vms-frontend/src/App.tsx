import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DriversListPage from "./admin/pages/DriversListPage";
import Homepage from "./Homepage";
import NavBar from "./shared/components/NavBar";
import MainDashboard from "./admin/pages/MainDashboard";
import AdminLayout from "./admin/AdminLayout";
import DriverDetailPage from "./admin/pages/DriverDetailPage";
import AppointmentsPage from "./admin/pages/AppointmentsPage";
import AddDriverPage from "./admin/pages/AddDriverPage";
import TasksPage from "./admin/pages/TasksPage";
import AppointmentDetailPage from "./admin/pages/AppointmentDetailPage";
import TaskDetailPage from "./admin/pages/TaskDetailPage";
import StaffListPage from "./admin/pages/StaffList";
import VehiclesListPage from "./admin/pages/VehiclesListPage";
import MakeAppointmentPage from "./driver/pages/MakeAppointmentPage";
import MainLayout from "./shared/MainLayout";
function App() {
  return (
    <Router>
      <NavBar />

      <Routes>
        <Route path="/" element={<MainLayout />} >
          <Route index element={<Homepage />} />
          <Route path="appointments/add" element={<MakeAppointmentPage />} />

        </Route>
        <Route path="admin" element={<AdminLayout />}>
          <Route path="" element={<MainDashboard />} />

          <Route path="drivers" element={<DriversListPage />} />
          <Route path="drivers/add" element={<AddDriverPage />} />
          <Route path="drivers/:driverID/detail" element={<DriverDetailPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="appointments/:appointmentId" element={<AppointmentDetailPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="tasks/:taskId" element={<TaskDetailPage />} />
          <Route path="staff" element={<StaffListPage />} />
          <Route path="vehicles" element={<VehiclesListPage />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
