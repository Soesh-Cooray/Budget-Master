// App.js
import React, { useState } from 'react';
import { Box, CssBaseline, IconButton, Toolbar } from '@mui/material';
import { Routes, Route, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HomePage from './components/homepage';
import SignInPage from './components/signin';
import SignUpPage from './components/signup';
import TransactionsPage from './components/transaction';
import ForgotPasswordPage from './components/forgotpasswordpage';
import Sidebar from './components/sidebar';
import { DRAWER_WIDTH, COLLAPSED_WIDTH } from './constants';

function App() {
    const location = useLocation();
    const showSidebar = ['/transaction', '/budgets', '/reports', '/'].includes(location.pathname);
    const [open, setOpen] = useState(true);

    const handleDrawerToggle = () => {
        setOpen((prev) => !prev);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {showSidebar && (
                <>
                    <Sidebar open={open} onClose={handleDrawerToggle} />
                    
                </>
            )}

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: showSidebar ? `calc(100% - ${open ? DRAWER_WIDTH : COLLAPSED_WIDTH}px)` : '100%',
                    marginLeft: showSidebar ? (open ? DRAWER_WIDTH : COLLAPSED_WIDTH) : 0,
                    transition: (theme) => theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.standard,
                    }),
                    padding: (theme) => theme.spacing(3),
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
