import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage/LandingPage";
import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";
import JobSeekerDashbord from "./pages/JobSeeker/JobSeekerDashbord";
import JobDetails from "./pages/JobSeeker/JobDetails";
import SavedJobs from "./pages/JobSeeker/SavedJobs";
import UserProfile from "./pages/JobSeeker/UserProfile";
import ProtectedRoute from "./routes/ProtectedRoute";
import EmployerDashbord from "./pages/Employer/EmployerDashbord";
import JobPostingForm from "./pages/Employer/JobPostingForm";
import EmployerProfilePage from "./pages/Employer/EmployerProfilePage";
import ManageJobs from "./pages/Employer/ManageJobs";
import ApplicationViewer from "./pages/Employer/ApplicationViewer";
import axios from 'axios';
import { AuthProvider } from "./Context/AuthContext";

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

export default function App() {
  return (
    <div>
      <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/find-jobs" element={<ProtectedRoute requiredRole="jobseeker"><JobSeekerDashbord /></ProtectedRoute>} />
          <Route path="/job/:jobId" element={<ProtectedRoute requiredRole="jobseeker"><JobDetails /></ProtectedRoute>} />
          <Route path="/saved-jobs" element={<ProtectedRoute requiredRole="jobseeker"> <SavedJobs /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute requiredRole="jobseeker"><UserProfile /></ProtectedRoute>} />

          <Route element={<ProtectedRoute requiredRole="employer" />}>
            <Route path="/employer-dashbord" element={<EmployerDashbord />} />
            <Route path="/post-job" element={<JobPostingForm />} />
            <Route path="/company-profile" element={<EmployerProfilePage />} />
            <Route path="/manage-jobs" element={<ManageJobs />} />
            <Route path="/applicants" element={<ApplicationViewer />} />
          </Route>

          <Route path="/jobseeker-dashboard" element={<Navigate to="/find-jobs" replace />} />
          <Route path="/employer-dashboard" element={<Navigate to="/employer-dashbord" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </AuthProvider>

      {/* Popup messages */}
      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </div>
  );
}