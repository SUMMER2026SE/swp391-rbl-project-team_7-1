import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import PublicLayout from './layouts/PublicLayout';

// Pages - Admin
import AdminAnalytics from './pages/Admin/Analytics';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminDisputes from './pages/Admin/Disputes';
import AdminGenerateReport from './pages/Admin/GenerateReport';
import AdminReportHistory from './pages/Admin/ReportHistory';
import AdminReportSuccess from './pages/Admin/ReportSuccess';
import AdminSettings from './pages/Admin/Settings';
import AdminUsers from './pages/Admin/Users';

// Pages - Employer
import EmployerDashboard from './pages/Employer/Dashboard';
import EmployerWallet from './pages/Employer/Wallet';

// Pages - Freelancer
import FreelancerDashboard from './pages/Freelancer/Dashboard';
import FreelancerWallet from './pages/Freelancer/Wallet';

// Pages - Public
import LandingPage from './pages/LandingPage';
import HelpCenter from './pages/HelpCenter';
import ArticleVNPayEscrow from './pages/ArticleVNPayEscrow';
import VNPayGateway from './pages/VNPayGateway';
import PaymentFailed from './pages/PaymentFailed';
import PaymentSuccess from './pages/PaymentSuccess';

// Pages - Standalone/Auth/Other
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import EscrowCheckout from './pages/EscrowCheckout';
import BrowseProjects from './pages/BrowseProjects';
import ManageProposals from './pages/ManageProposals';
import MessagesEmployer from './pages/MessagesEmployer';
import MessagesFreelancer from './pages/MessagesFreelancer';
import PostProject from './pages/PostProject';
import ProjectDetails from './pages/ProjectDetails';
import ReviewSubmission from './pages/ReviewSubmission';
import RevisionRequested from './pages/RevisionRequested';
import SubmitProposal from './pages/SubmitProposal';
import SubmitWork from './pages/SubmitWork';
import Projects from './pages/Projects'; // Original projects list
import Profile from './pages/Profile'; // Public profile page

export default function App() {
  const [token, setToken] = React.useState(() => {
    const rawToken = localStorage.getItem('token');
    return rawToken && rawToken !== 'null' && rawToken !== 'undefined' ? rawToken : null;
  });

  React.useEffect(() => {
    const handleStorageChange = () => {
      const rawToken = localStorage.getItem('token');
      const currentToken = rawToken && rawToken !== 'null' && rawToken !== 'undefined' ? rawToken : null;
      if (currentToken !== token) {
        setToken(currentToken);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [token]);

  return (
    <Router>
      <Routes>
        {/* --- Public Pages with PublicLayout (Header & Footer) --- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/article-vnpay-escrow" element={<ArticleVNPayEscrow />} />
          {!token && (
            <>
              <Route path="/browse-projects" element={<BrowseProjects />} />
              <Route path="/project-details" element={<ProjectDetails />} />
              <Route path="/profile" element={<Profile />} />
            </>
          )}
        </Route>

        {/* --- Dashboard Pages with DashboardLayout (Sidebar & DashboardHeader) --- */}
        <Route element={<DashboardLayout />}>
          {/* Freelancer Dashboard Paths */}
          <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
          <Route path="/freelancer-wallet" element={<FreelancerWallet />} />
          <Route path="/messages-freelancer" element={<MessagesFreelancer />} />
          <Route path="/submit-work" element={<SubmitWork />} />
          <Route path="/submit-proposal" element={<SubmitProposal />} />
          {/* Profile is always accessible when logged in (DashboardLayout handles auth) */}
          <Route path="/profile" element={<Profile />} />
          {token && (
            <>
              <Route path="/browse-projects" element={<BrowseProjects />} />
              <Route path="/project-details" element={<ProjectDetails />} />
            </>
          )}

          {/* Employer Dashboard Paths */}
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/employer-wallet" element={<EmployerWallet />} />
          <Route path="/messages-employer" element={<MessagesEmployer />} />
          <Route path="/manage-proposals" element={<ManageProposals />} />
          <Route path="/review-submission" element={<ReviewSubmission />} />
          <Route path="/revision-requested" element={<RevisionRequested />} />
          <Route path="/post-project" element={<PostProject />} />
          <Route path="/escrow-checkout" element={<EscrowCheckout />} />

          {/* Admin Dashboard Paths */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-users" element={<AdminUsers />} />
          <Route path="/admin-disputes" element={<AdminDisputes />} />
          <Route path="/admin-generate-report" element={<AdminGenerateReport />} />
          <Route path="/admin-report-history" element={<AdminReportHistory />} />
          <Route path="/admin-report-success" element={<AdminReportSuccess />} />
          <Route path="/admin-analytics" element={<AdminAnalytics />} />
          <Route path="/admin-settings" element={<AdminSettings />} />
        </Route>

        {/* --- Standalone Pages (No Shared Layout) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/vnpay-gateway" element={<VNPayGateway />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/projects" element={<Projects />} />

        {/* --- Fallback Redirects --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
