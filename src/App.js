import React, { useState, useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Routes, Route, useLocation,Navigate     } from 'react-router-dom';
import HomePage from './components/homepage';
import SignInPage from './components/signin';
import SignUpPage from './components/signup';
import TransactionsPage from './components/transaction';
import ForgotPasswordPage from './components/forgotpasswordpage';
import BudgetsPage from './components/budgets';
import Dashboard from './components/dashboard';
import Sidebar from './components/sidebar';
import DebugDashboard from './components/DebugDashboard';

import { DRAWER_WIDTH, COLLAPSED_WIDTH } from './constants';

function App() {
    const location = useLocation();
    const showSidebar = ['/transaction', '/budgets', '/reports','/dashboard'].includes(location.pathname);
    const [open, setOpen] = useState(true);

    const handleDrawerToggle = () => {
        setOpen((prev) => !prev);
    };
    
    // Add this to set the global box-sizing to border-box and enable scrolling
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            html, body {
                overflow-y: auto;
                overflow-x: hidden;
                width: 100%;
                height: auto;
                min-height: 100vh;
            }
            #root {
                height: auto;
                min-height: 100vh;
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    useEffect(() => {
        console.log("Current location:", location.pathname);
    }, [location]);

    return (
        <Box sx={{ 
            display: 'flex',
            margin: 0,
            padding: 0,
            width: '100%',
            height: 'auto',
            minHeight: '100vh',
            overflow: 'auto',
            backgroundColor: '#f0f7ff'
        }}>
            <CssBaseline />

            {showSidebar && (
                <Sidebar open={open} onClose={handleDrawerToggle} />
            )}

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: showSidebar ? 
                        `calc(100% - ${open ? DRAWER_WIDTH : COLLAPSED_WIDTH}px)` : 
                        '100%',
                    marginLeft: showSidebar ? 
                        `${open ? DRAWER_WIDTH : COLLAPSED_WIDTH}px` : 
                        0,
                    transition: (theme) =>
                        theme.transitions.create(['width', 'margin'], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.standard,
                        }),
                    padding: 0,
                    overflow: 'visible',
                    backgroundColor: '#f0f7ff',
                }}
            >
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/transaction" element={<TransactionsPage />} />
                    <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
                    <Route path="/budgets" element={<BudgetsPage />} />
                    <Route path="/reports" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard" element={<DebugDashboard />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                    
                </Routes>
            </Box>
        </Box>
    );
}

export default App;