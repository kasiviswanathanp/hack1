import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Legacy combined officer login redirector.
 * Individual dedicated login pages:
 * - Area Officer: /login/area-officer
 * - Department Officer: /login/department-officer
 * - Zonal Supervisor: /login/supervisor
 */
export const OfficerLogin: React.FC = () => {
  return <Navigate to="/login/area-officer" replace />;
};
