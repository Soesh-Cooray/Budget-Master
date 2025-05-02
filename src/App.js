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
                  p: 3,
                  width: showSidebar ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
              }}
          >
              <Toolbar />
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