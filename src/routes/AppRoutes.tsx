import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';

// Layouts
import { CitizenLayout } from '@/layouts/CitizenLayout';
import { OfficerLayout, SupervisorLayout, ManagementLayout } from '@/layouts/DashboardLayouts';
import { FieldTeamLayout, AdminLayout, AuthLayout } from '@/layouts/OtherLayouts';
import { RoleGuard } from './RoleGuard';

// Pages
import { CitizenHome } from '@/pages/citizen/CitizenHome';
import { ReportIssue } from '@/pages/citizen/ReportIssue';
import { MyComplaints } from '@/pages/citizen/MyComplaints';
import { ComplaintDetail } from '@/pages/citizen/ComplaintDetail';
import { ComplaintSuccess } from '@/pages/citizen/ComplaintSuccess';
import { NearbyMap } from '@/pages/citizen/NearbyMap';
import { CitizenNotifications } from '@/pages/citizen/CitizenNotifications';

import { OfficerDashboard } from '@/pages/officer/OfficerDashboard';
import { PriorityQueue } from '@/pages/officer/PriorityQueue';
import { OfficerComplaintDetail } from '@/pages/officer/OfficerComplaintDetail';
import { SupervisorEscalations } from '@/pages/supervisor/SupervisorEscalations';

import { ManagementDashboard } from '@/pages/management/ManagementDashboard';
import { FieldTeamDashboard } from '@/pages/fieldTeam/FieldTeamDashboard';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';

import { Login } from '@/pages/auth/Login';
import { CitizenLogin } from '@/pages/auth/CitizenLogin';
import { AreaOfficerLogin } from '@/pages/auth/AreaOfficerLogin';
import { DeptOfficerLogin } from '@/pages/auth/DeptOfficerLogin';
import { SupervisorLogin } from '@/pages/auth/SupervisorLogin';
import { DistrictManagerLogin } from '@/pages/auth/DistrictManagerLogin';
import { FieldTeamLogin } from '@/pages/auth/FieldTeamLogin';
import { AdminLogin } from '@/pages/auth/AdminLogin';
import { Register } from '@/pages/auth/Register';
import { Profile } from '@/pages/auth/Profile';

export const AppRoutes: React.FC = () => {
  const { currentUser } = useAuth();

  // Root redirector based on current user role
  const getDefaultHome = () => {
    if (!currentUser) return '/citizen';
    switch (currentUser.role) {
      case 'AREA_OFFICER':
      case 'DEPARTMENT_OFFICER':
        return '/officer';
      case 'SUPERVISOR':
        return '/supervisor/escalations';
      case 'DISTRICT_MANAGER':
        return '/management/dashboard';
      case 'FIELD_TEAM':
        return '/field-team';
      case 'ADMIN':
        return '/admin';
      default:
        return '/citizen';
    }
  };

  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to={getDefaultHome()} replace />} />

      {/* Auth routes: Dedicated Separate Login Pages */}
      <Route element={<AuthLayout />}>
        {/* Master Portal Directory */}
        <Route path="/portals" element={<Login />} />
        <Route path="/login/portals" element={<Login />} />

        {/* 1. Citizen Login */}
        <Route path="/login" element={<CitizenLogin />} />
        <Route path="/login/citizen" element={<CitizenLogin />} />

        {/* 2. Area Officer Login */}
        <Route path="/login/officer" element={<AreaOfficerLogin />} />
        <Route path="/login/area-officer" element={<AreaOfficerLogin />} />

        {/* 3. Department Officer Login */}
        <Route path="/login/department-officer" element={<DeptOfficerLogin />} />

        {/* 4. Zonal Supervisor Login */}
        <Route path="/login/supervisor" element={<SupervisorLogin />} />

        {/* 5. District Manager Login */}
        <Route path="/login/management" element={<DistrictManagerLogin />} />
        <Route path="/login/manager" element={<DistrictManagerLogin />} />

        {/* 6. Field Team Login */}
        <Route path="/login/field-team" element={<FieldTeamLogin />} />

        {/* 7. System Admin Login */}
        <Route path="/login/admin" element={<AdminLogin />} />

        {/* Registration */}
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Citizen routes */}
      <Route path="/citizen" element={<CitizenLayout />}>
        <Route index element={<CitizenHome />} />
        <Route path="report" element={<ReportIssue />} />
        <Route path="complaints" element={<MyComplaints />} />
        <Route path="complaints/:id" element={<ComplaintDetail />} />
        <Route path="complaints/:id/success" element={<ComplaintSuccess />} />
        <Route path="map" element={<NearbyMap />} />
        <Route path="notifications" element={<CitizenNotifications />} />
      </Route>

      {/* Profile available everywhere */}
      <Route path="/profile" element={<CitizenLayout />}>
        <Route index element={<Profile />} />
      </Route>

      {/* Officer routes */}
      <Route element={<RoleGuard allowedRoles={['AREA_OFFICER', 'DEPARTMENT_OFFICER', 'ADMIN']} />}>
        <Route path="/officer" element={<OfficerLayout />}>
          <Route index element={<OfficerDashboard />} />
          <Route path="complaints" element={<MyComplaints />} />
          <Route path="complaints/:id" element={<OfficerComplaintDetail />} />
          <Route path="priority" element={<PriorityQueue />} />
          <Route path="escalations" element={<SupervisorEscalations />} />
          <Route path="map" element={<NearbyMap />} />
          <Route path="field-teams" element={<FieldTeamDashboard />} />
          <Route path="analytics" element={<ManagementDashboard />} />
          <Route path="notifications" element={<CitizenNotifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Supervisor routes */}
      <Route element={<RoleGuard allowedRoles={['SUPERVISOR', 'ADMIN']} />}>
        <Route path="/supervisor" element={<SupervisorLayout />}>
          <Route index element={<SupervisorEscalations />} />
          <Route path="escalations" element={<SupervisorEscalations />} />
          <Route path="complaints" element={<MyComplaints />} />
          <Route path="complaints/:id" element={<OfficerComplaintDetail />} />
          <Route path="priority" element={<PriorityQueue />} />
          <Route path="map" element={<NearbyMap />} />
          <Route path="field-teams" element={<FieldTeamDashboard />} />
          <Route path="analytics" element={<ManagementDashboard />} />
          <Route path="notifications" element={<CitizenNotifications />} />
        </Route>
      </Route>

      {/* Management routes */}
      <Route element={<RoleGuard allowedRoles={['DISTRICT_MANAGER', 'ADMIN']} />}>
        <Route path="/management" element={<ManagementLayout />}>
          <Route index element={<ManagementDashboard />} />
          <Route path="dashboard" element={<ManagementDashboard />} />
          <Route path="hotspots" element={<NearbyMap />} />
          <Route path="map" element={<NearbyMap />} />
          <Route path="complaints" element={<MyComplaints />} />
          <Route path="complaints/:id" element={<OfficerComplaintDetail />} />
          <Route path="priority" element={<PriorityQueue />} />
          <Route path="escalations" element={<SupervisorEscalations />} />
          <Route path="field-teams" element={<FieldTeamDashboard />} />
          <Route path="analytics" element={<ManagementDashboard />} />
          <Route path="notifications" element={<CitizenNotifications />} />
        </Route>
      </Route>

      {/* Field Team routes */}
      <Route element={<RoleGuard allowedRoles={['FIELD_TEAM', 'ADMIN']} />}>
        <Route path="/field-team" element={<FieldTeamLayout />}>
          <Route index element={<FieldTeamDashboard />} />
          <Route path="work-orders" element={<FieldTeamDashboard />} />
          <Route path="work-orders/:id" element={<FieldTeamDashboard />} />
          <Route path="notifications" element={<CitizenNotifications />} />
        </Route>
      </Route>

      {/* System Admin routes */}
      <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="notifications" element={<CitizenNotifications />} />
        </Route>
      </Route>


      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
