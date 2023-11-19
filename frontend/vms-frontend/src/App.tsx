import "./App.css";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import DriversListPage from "./admin/pages/drivers/DriversListPage.tsx";
import Homepage from "./Homepage";
import NavBar from "./shared/components/NavBar";
import AdminLayout from "./admin/AdminLayout";
import DriverDetailPage from "./admin/pages/drivers/DriverDetailPage.tsx";
import AppointmentsPage from "./admin/pages/tasks/AppointmentsPage.tsx";
import AddDriverPage from "./admin/pages/drivers/AddDriverPage.tsx";
import TasksPage from "./admin/pages/tasks/TasksPage.tsx";
import AppointmentDetailPage from "./admin/pages/tasks/AppointmentDetailPage.tsx";
import StaffListPage from "./admin/pages/staff/StaffList.tsx";
import VehiclesListPage from "./admin/pages/vehicles/VehiclesListPage.tsx";
import MainLayout from "./shared/MainLayout";
import LoginPage from "./shared/LoginPage";
import { AuthContext } from "./shared/contex/auth-context.tsx";
import { useState, useCallback, useEffect } from "react";
import NotFoundPage from "./shared/components/NotFoundPage.tsx";

import RequireAuth from "./shared/components/RequireAuth.tsx";
import jwt_decode from "jwt-decode";
import axios from 'axios';
// import { useToast } from "./shared/shad-ui/ui/use-toast.ts";
import AddTaskPage from "./admin/pages/tasks/AddTaskPage.tsx";
import PersonalPage from "./driver/pages/PersonalPage.tsx";
import PersonalPageLayout from "./driver/PersonalPageLayout.tsx";
import ViewTaskPage from "./driver/pages/ViewTaskPage.tsx";
import RoutesHistory from "./driver/pages/RoutesHistory.tsx";
import Appointments from "./driver/pages/Appointments.tsx";
import Report from "./driver/pages/Report.tsx";
import DriverTasksPage from "./driver/pages/DriverTasksPage.tsx";
import AddFueling from "./admin/pages/staff/AddFueling.tsx";
import AddMaintenance from "./admin/pages/staff/AddMaintenance.tsx";
interface tokenInt {
  refresh: string,
  access: string,
}
import { sidebarNavItems as adminLinks } from "@/admin/components/adminLinks.tsx"
import { sidebarNavItems as fuelingLinks } from "@/staff/components/fuelingLinks.tsx"
import { sidebarNavItems as maintenanceLinks } from "@/staff/components/maintenanceLinks.tsx"
import FuelingPersonalPage from "./staff/pages/fueling/FuelingPersonalPage.tsx";
import MaintenancePersonalPage from "./staff/pages/maintenance/MaintenancePersonalPage.tsx";
import FuelingVehiclesList from "./staff/pages/fueling/FuelingVehiclesList.tsx";
import MaintenanceVehiclesList from "./staff/pages/maintenance/MaintenanceVehiclesList.tsx";
import AddFuelingReport from "./staff/pages/fueling/AddFuelingReport.tsx";
import FuelingReports from "./staff/pages/fueling/FuelingReports.tsx";
import ScheduledJobs from "./staff/pages/maintenance/ScheduledJobs.tsx";
import VehicleReport from "./admin/pages/vehicles/VehicleReport.tsx";
import EditDriverPage from "./admin/pages/drivers/EditDriverPage.tsx";
import EditTaskPage from "./admin/pages/tasks/EditTaskPage.tsx";
import VehiclesAddPage from "./admin/pages/vehicles/VehiclesAddPage.tsx";
import Reports from "./admin/pages/Reports.tsx";
import Auction from "./admin/pages/vehicles/Auction.tsx";
import AddAuctionVeh from "./admin/pages/vehicles/AddAuctionVeh.tsx";
import EditFuelingPage from "./admin/pages/staff/EditFuelingPage.tsx";
import FuelingDetailPage from "./admin/pages/staff/FuelingDetailPage.tsx";
import EditMaintenance from "./admin/pages/staff/EditMaintenance.tsx";
import MaintenanceDetail from "./admin/pages/staff/MaintenanceDetail.tsx";
import VehicleEditPage from "./admin/pages/vehicles/VehicleEditPage.tsx";
import EditVehicle from "./staff/pages/maintenance/EditVehicle.tsx";
import AddJob from "./staff/pages/maintenance/AddJob.tsx";
import EditJob from "./staff/pages/maintenance/EditJob.tsx";
import CompleteJob from "./staff/pages/maintenance/CompleteJob.tsx";
import EditPersonalData from "./staff/pages/maintenance/EditPersonalData.tsx";
import PersonalData from "./admin/pages/PersonalData.tsx";
import EditAdminData from "./admin/pages/EditAdminData.tsx";
import AuctionPage from "./shared/pages/AuctionPage.tsx";
import AdminDetail from "./admin/pages/staff/AdminDetail.tsx";
import EditAdminPage from "./admin/pages/staff/EditAdminPage.tsx";
import MaintenanceTasks from "./admin/pages/staff/MaintenanceTasks.tsx";
import AddMaintenanceTask from "./admin/pages/staff/AddmaintenanceTask.tsx";
import FuelingTasks from "./admin/pages/staff/FuelingTasks.tsx";
import AddFuelingTask from "./admin/pages/staff/AddFuelingTask.tsx";

function App() {
  // global state holders for currently logged in user
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("default");
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [tokens, setTokens] = useState<tokenInt>({
    refresh: '',
    access: ''
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // display toast messages library
  // const { toast } = useToast();

  // will be launched when App components is initialized
  useEffect(() => {
    // we check browser's local storage for saved tokens to persist login when the page is refreshed
    if (localStorage.getItem('authTokens')) {
      // if tokens are found we restore login state so that user does not have to enter login information every time the page is refreshed
      let storageTokens = JSON.parse(localStorage.getItem('authTokens')!);
      setTokens(storageTokens);
      let decodedData: any = jwt_decode(storageTokens.access);
      setUsername(decodedData.username);
      setUserId(decodedData.user_id);
      setRole(decodedData.role);
      setIsLoggedIn(true);
    }
  }, [])

  // helper functions to set auth state
  const defineRole = useCallback((userRole: string) => {
    setRole(userRole);
  }, []);
  const setUserId = useCallback((userId: string) => {
    setId(userId);
  }, []);
  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);
  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUsername('');
    setRole('');
    setTokens({ refresh: '', access: '' });
    localStorage.clear();
    navigate('/');
  }, []);
  const assignToken = useCallback((tokens: tokenInt) => {
    setTokens(tokens);
  }, []);
  const assignUsername = useCallback((username: string) => {
    setUsername(username);
  }, []);

  // helper function to obtain new JWT access token 
  const updateToken = async (refreshToken: string) => {
    try {
      if (!refreshToken) {
        throw new Error("no token");
      }
      // get new Access token using refresh token
      const response = await axios.post("/api/users/token/refresh/", {
        "refresh": refreshToken
      });
      // save if response is good
      if (response.status === 200) {
        localStorage.setItem('authTokens', JSON.stringify({
          access: response.data.access,
          refresh: refreshToken
        }))
        setTokens({
          access: response.data.access,
          refresh: refreshToken
        })

      } else {
        throw new Error("Unable to obtain new token. Login again");
      }


    } catch (err) {
      logout();
      // toast({
      //   title: "Something went wrong. Try to login again!",
      //   variant: "destructive",
      // })
    }
    if (loading) {
      setLoading(false);
    }
  }

  // refresh Access token on first login and every hour, because JWT access token lasts 1 hour on backend
  useEffect(() => {
    if (loading && isLoggedIn) {
      updateToken(tokens?.refresh!)
    }

    let interval = setInterval(() => {
      if (isLoggedIn) {
        updateToken(tokens?.refresh!)
      }
    }, 3600000)
    return () => clearInterval(interval);
  }, [tokens, loading])

  return (
    <>
      <AuthContext.Provider value={{ isLoggedIn, role, username, id, tokens, defineRole, setUserId, assignUsername, assignToken, login, logout, updateToken }}>
        <NavBar />
        <Routes>
          <Route path="/" element={<MainLayout />} >
            <Route index element={<Homepage />} />
            <Route path="auction" element={<AuctionPage />} />

            <Route element={<RequireAuth allowedRole={"driver"} />}>
              {/* <Route path="appointments/add" element={<MakeAppointmentPage />} /> */}

              <Route path="driver" element={<PersonalPageLayout />} >
                <Route path="personal_page" element={<PersonalPage />} />
                <Route path="tasks" element={<DriverTasksPage />} />
                <Route path="tasks/:taskId/" element={<ViewTaskPage />} />
                <Route path="routes_history" element={<RoutesHistory />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="report" element={<Report />} />
              </Route>
            </Route>
            <Route path="login" element={<LoginPage />} />
          </Route>

          <Route element={<RequireAuth allowedRole={"admin"} />}>
            <Route path="admin" element={<AdminLayout links={adminLinks} />}>
              <Route path="" element={<Navigate to="personal_data" replace />} />

              <Route path="personal_data" element={<PersonalData />} />
              <Route path="edit" element={<EditAdminData />} />
              <Route path="drivers" element={<DriversListPage />} />
              <Route path="drivers/add" element={<AddDriverPage />} />
              <Route path="drivers/:driverID/edit" element={<EditDriverPage />} />
              <Route path="drivers/:driverID/detail" element={<DriverDetailPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="appointments/:appointmentId" element={<AppointmentDetailPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="tasks/add" element={<AddTaskPage />} />
              <Route path="tasks/:taskId/edit" element={<EditTaskPage />} />
              <Route path="staff" element={<StaffListPage />} />
              <Route path="staff/fueling/:fuelingPersonId/edit" element={<EditFuelingPage />} />
              <Route path="staff/fueling/:fuelingPersonId/detail" element={<FuelingDetailPage />} />
              <Route path="staff/maintenance/:maintenancePersonId/edit" element={<EditMaintenance />} />
              <Route path="staff/maintenance/:maintenancePersonId/detail" element={<MaintenanceDetail />} />
              <Route path="staff/admin/:adminId/detail" element={<AdminDetail />} />
              <Route path="staff/admin/:adminId/edit" element={<EditAdminPage />} />

              <Route path="staff/add/fueling" element={<AddFueling />} />
              <Route path="staff/add/maintenance" element={<AddMaintenance />} />
              <Route path="maintenance/tasks" element={<MaintenanceTasks />} />
              <Route path="maintenance/tasks/add" element={<AddMaintenanceTask />} />
              <Route path="fueling/tasks" element={<FuelingTasks />} />
              <Route path="fueling/tasks/add" element={<AddFuelingTask />} />

              <Route path="vehicles" element={<VehiclesListPage />} />
              <Route path="vehicles/add" element={<VehiclesAddPage />} />
              <Route path="vehicles/:vehicleId/detail" element={<VehicleReport />} />
              <Route path="vehicles/:vehicleId/edit" element={<VehicleEditPage />} />
              <Route path="reports" element={<Reports />} />
              <Route path="auction" element={<Auction />} />
              <Route path="auction/add" element={<AddAuctionVeh />} />

            </Route>
          </Route>

          <Route element={<RequireAuth allowedRole={"fueling"} />}>
            <Route path="fueling" element={<AdminLayout links={fuelingLinks} />}>
              <Route path="" element={<FuelingPersonalPage />} />
              <Route path="vehicles" element={<FuelingVehiclesList />} />
              <Route path="vehicles/:vid/add_fueling_report" element={<AddFuelingReport />} />
              <Route path="reports" element={<FuelingReports />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRole={"maintenance"} />}>
            <Route path="maintenance" element={<AdminLayout links={maintenanceLinks} />}>
              <Route path="" element={<MaintenancePersonalPage />} />
              <Route path="edit" element={<EditPersonalData />} />
              <Route path="vehicles" element={<MaintenanceVehiclesList />} />
              <Route path="vehicles/:vehicleId/edit" element={<EditVehicle />} />
              <Route path="vehicles/:vehicleId/schedule" element={<AddJob />} />
              <Route path="jobs" element={<ScheduledJobs />} />
              <Route path="jobs/:jobId/edit" element={<EditJob />} />
              <Route path="jobs/:jobId/complete" element={<CompleteJob />} />

            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthContext.Provider>
    </>
  );
}

export default App;
