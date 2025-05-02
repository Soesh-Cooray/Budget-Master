import React from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './components/homepage';
import SignInPage from './components/signin';
import SignUpPage from './components/signup';
import TransactionsPage from './components/transaction';
import ForgotPasswordPage from './components/forgotpasswordpage';
import Sidebar from './components/sidebar';
import { DRAWER_WIDTH } from './constants';

function App() {
  const location = useLocation();
  const showSidebar = ['/transaction', '/budgets', '/reports'].includes(location.pathname);

  return (
      <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          {showSidebar && <Sidebar />}
          <Box
              component="main"
              sx={{
                  flexGrow: 1,
                  paddingLeft: 1,   // Adjust as needed
                  paddingRight: 1,  // Adjust as needed
                  paddingTop: 0,
                  paddingBottom: 1,
                  width: showSidebar ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
                  
              }}
          >
              <div style={{ height: 5 }} />  {/* Replace Toolbar with div */}
              <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/signin" element={<SignInPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/transaction" element={<TransactionsPage />} />
                  <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
              </Routes>
          </Box>
      </Box>
  );
}

export default App;