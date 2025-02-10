import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { Suspense, lazy } from "react";
import NotFound from "./pages/notFound";

const Login = lazy(() => import("./pages/auth/login"));
const Dashboard = lazy(() => import("./pages/layout/dashboard"));
const Subscription = lazy(() => import("./pages/subscription"));
const AdminDashboard = lazy(() => import("./pages/layout/adminDashboard"));

function App() {
  const accessToken = useSelector((state) => state?.auth?.accessToken);
  const admin = useSelector((state) => state?.auth?.usr_cde);

  return (
    <Router>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            Loading...
          </div>
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              !accessToken || accessToken === "" ? (
                <Navigate to="/login" />
              ) : (
                <Navigate to="/plans" />
              )
            }
          />
          <Route
            path="/login"
            element={
              accessToken && accessToken !== "" ? (
                <Navigate to="/plans" />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/plans"
            element={
              !accessToken || accessToken === "" ? (
                <Navigate to="/login" />
              ) : admin === 2 ? (
                <Navigate to="/admin-dashboard" />
              ) : (
                <Dashboard />
              )
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              admin === 2 ? <AdminDashboard /> : <Navigate to="/login" />
            }
          />
          <Route path="/subscription-plans" element={<Subscription />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
