import React, { useEffect } from 'react';
import Dashboard from './dashboard';
import { useLocation } from 'react-router-dom';

const DebugDashboard = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('Dashboard component mounted');
    console.log('Current location:', location);
  }, [location]);

  return <Dashboard />;
};

export default DebugDashboard;