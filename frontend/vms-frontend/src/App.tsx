import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
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
import StaffListPage from "./admin/pages/StaffList";
import VehiclesListPage from "./admin/pages/VehiclesListPage";
import MakeAppointmentPage from "./driver/pages/MakeAppointmentPage";
import MainLayout from "./shared/MainLayout";
import LoginPage from "./shared/LoginPage";
import { AuthContext } from "./shared/contex/auth-context.tsx";
import { useState, useCallback, useEffect } from "react";
import NotFoundPage from "./shared/components/NotFoundPage.tsx";

import RequireAuth from "./shared/components/RequireAuth.tsx";
import jwt_decode from "jwt-decode";
import axios from "./shared/hooks/axios";
// import { useToast } from "./shared/shad-ui/ui/use-toast.ts";
import AddTaskPage from "./admin/pages/AddTaskPage.tsx";
interface tokenInt {
  refresh: string,
  access: string,
}

function App() {
  // global state holders for currently logged in user
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("default");
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
      setRole(decodedData.role);
      setIsLoggedIn(true);
    }
  }, [])

  // helper functions to set auth state
  const defineRole = useCallback((userRole: string) => {
    setRole(userRole);
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
      <AuthContext.Provider value={{ isLoggedIn, role, username, tokens, defineRole, assignUsername, assignToken, login, logout, updateToken }}>
        <NavBar />
        <Routes>
          <Route path="/" element={<MainLayout />} >
            <Route index element={<Homepage />} />

            <Route element={<RequireAuth allowedRole={"driver"} />}>
              <Route path="appointments/add" element={<MakeAppointmentPage />} />
            </Route>

            <Route path="login" element={<LoginPage />} />
          </Route>

          <Route element={<RequireAuth allowedRole={"admin"} />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route path="" element={<MainDashboard />} />

              <Route path="drivers" element={<DriversListPage />} />
              <Route path="drivers/add" element={<AddDriverPage />} />
              <Route path="drivers/:driverID/detail" element={<DriverDetailPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="appointments/:appointmentId" element={<AppointmentDetailPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="tasks/add" element={<AddTaskPage />} />
              <Route path="staff" element={<StaffListPage />} />
              <Route path="vehicles" element={<VehiclesListPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthContext.Provider>
    </>
  );
}

export default App;
