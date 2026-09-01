import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";

import Landing from "@/pages/Landing";
import CareerExplorer from "@/pages/CareerExplorer";
import CareerProfile from "@/pages/CareerProfile";
import CareerPathway from "@/pages/CareerPathway";
import CareerCompare from "@/pages/CareerCompare";
import Assessment from "@/pages/Assessment";
import AssessmentResults from "@/pages/AssessmentResults";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import MyPathway from "@/pages/MyPathway";
import Opportunities from "@/pages/Opportunities";
import OpportunityDetail from "@/pages/OpportunityDetail";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

import AdminOverview from "@/pages/admin/AdminOverview";
import AdminCareers from "@/pages/admin/AdminCareers";
import AdminPathways from "@/pages/admin/AdminPathways";
import AdminResources from "@/pages/admin/AdminResources";
import AdminOpportunities from "@/pages/admin/AdminOpportunities";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/careers" element={<CareerExplorer />} />
          <Route path="/careers/:slug" element={<CareerProfile />} />
          <Route path="/careers/:slug/pathway" element={<CareerPathway />} />
          <Route path="/compare" element={<CareerCompare />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/assessment/results" element={<AssessmentResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-pathway" element={<MyPathway />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/opportunities/:id" element={<OpportunityDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="careers" element={<AdminCareers />} />
          <Route path="pathways" element={<AdminPathways />} />
          <Route path="resources" element={<AdminResources />} />
          <Route path="opportunities" element={<AdminOpportunities />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
