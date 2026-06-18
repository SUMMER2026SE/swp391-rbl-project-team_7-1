import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import PublicLayout from './layouts/PublicLayout';

// Pages - Admin
import AdminAnalytics from './pages/Admin/Analytics';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminDisputes from './pages/Admin/Disputes';
import AdminGenerateReport from './pages/Admin/GenerateReport';
import AdminReportHistory from './pages/Admin/ReportHistory';
import AdminReportManagement from './pages/Admin/ReportManagement';
import AdminReportSuccess from './pages/Admin/ReportSuccess';
import AdminSettings from './pages/Admin/Settings';
import AdminUsers from './pages/Admin/Users';
import ProposalModeration from './pages/Admin/ProposalModeration';
import AdminWithdrawals from './pages/Admin/AdminWithdrawals';

// Pages - Wallet & Payment (Iteration 2)
import TransactionHistoryPage from './pages/Wallet/TransactionHistoryPage';
import VNPayReturnPage from './pages/Wallet/VNPayReturnPage';
import EscrowDepositPage from './pages/Project/EscrowDepositPage';
import WithdrawFunds from './pages/Wallet/WithdrawFunds';

// Pages - Employer
import EmployerDashboard from './pages/Employer/Dashboard';
import EmployerWallet from './pages/Employer/Wallet';

// Pages - Freelancer
import FreelancerDashboard from './pages/Freelancer/Dashboard';
import FreelancerWallet from './pages/Freelancer/Wallet';

// Pages - Public
import LandingPage from './pages/Public/LandingPage';
import HelpCenter from './pages/Public/HelpCenter';
import ArticleVNPayEscrow from './pages/Public/ArticleVNPayEscrow';
import VNPayGateway from './pages/Payment/VNPayGateway';
import PaymentFailed from './pages/Payment/PaymentFailed';
import PaymentSuccess from './pages/Payment/PaymentSuccess';

// Pages - Standalone/Auth/Other
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import VerifyEmail from './pages/Auth/VerifyEmail';
import ForgotPassword from './pages/Auth/ForgotPassword';
import EscrowCheckout from './pages/Employer/EscrowCheckout';
import BrowseProjects from './pages/Freelancer/BrowseProjects';
import ManageProposals from './pages/Employer/ManageProposals';
import MessagesEmployer from './pages/Employer/MessagesEmployer';
import MessagesFreelancer from './pages/Freelancer/MessagesFreelancer';
import PostProject from './pages/Employer/PostProject';
import ProjectDetails from './pages/Public/ProjectDetails';
import ReviewSubmission from './pages/Employer/ReviewSubmission';
import RevisionRequested from './pages/Employer/RevisionRequested';
import SubmitProposal from './pages/Freelancer/SubmitProposal';
import SubmitWork from './pages/Freelancer/SubmitWork';
import Projects from './pages/Public/Projects'; // Original projects list
import Profile from './pages/Public/Profile'; // Public profile page

import { useAuth } from './hooks/useAuth';

export default function App() {
  const { user, loading } = useAuth();
  const token = !!user; // Use user context to determine if logged in

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-10 h-10 border-4 border-[#0F766E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
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
        <Route path="/submit-work/:contractId" element={<SubmitWork />} />
        <Route path="/submit-proposal/:projectId" element={<SubmitProposal />} />
        {/* Profile is always accessible when logged in (DashboardLayout handles auth) */}
        <Route path="/profile" element={<Profile />} />
        {token && (
          <>
            <Route path="/browse-projects" element={<BrowseProjects />} />
            <Route path="/project-details" element={<ProjectDetails />} />
            
            {/* Wallet / Payment / Project Routes */}
            <Route path="/wallet/transactions" element={<TransactionHistoryPage />} />
            <Route path="/vnpay-return" element={<VNPayReturnPage />} />
            <Route path="/project/:projectId/fund" element={<EscrowDepositPage />} />
            <Route path="/withdraw" element={<WithdrawFunds />} />
          </>
        )}

        {/* Employer Dashboard Paths */}
        <Route path="/employer-dashboard" element={<EmployerDashboard />} />
        <Route path="/employer-wallet" element={<EmployerWallet />} />
        <Route path="/messages-employer" element={<MessagesEmployer />} />
        <Route path="/manage-proposals/:projectId" element={<ManageProposals />} />
        <Route path="/review-submission/:contractId" element={<ReviewSubmission />} />
        <Route path="/revision-requested" element={<RevisionRequested />} />
        <Route path="/post-project" element={<PostProject />} />
        <Route path="/edit-project/:id" element={<PostProject editMode={true} />} />
        <Route path="/escrow-checkout" element={<EscrowCheckout />} />

        {/* Admin Dashboard Paths */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-users" element={<AdminUsers />} />
        <Route path="/admin-project-moderation" element={<ProposalModeration />} />
        <Route path="/admin-disputes" element={<AdminDisputes />} />
        <Route path="/admin-generate-report" element={<AdminGenerateReport />} />
        <Route path="/admin-report-history" element={<AdminReportHistory />} />
        <Route path="/admin-report-management" element={<AdminReportManagement />} />
        <Route path="/admin-report-success" element={<AdminReportSuccess />} />
        <Route path="/admin-analytics" element={<AdminAnalytics />} />
        <Route path="/admin-settings" element={<AdminSettings />} />
        <Route path="/admin-withdrawals" element={<AdminWithdrawals />} />
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
  );
}

