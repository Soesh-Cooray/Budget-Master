import React from 'react';
import {
    Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar,
    Typography, IconButton, Box, useTheme, Switch
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SavingsIcon from '@mui/icons-material/Savings';
import BarChartIcon from '@mui/icons-material/BarChart';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useNavigate, useLocation } from 'react-router-dom';
import { DRAWER_WIDTH } from '../constants';
import { useTheme as useCustomTheme } from '../context/ThemeContext';

const COLLAPSED_WIDTH = 69;

function Sidebar({ open, onClose }) {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const { mode, toggleColorMode } = useCustomTheme();

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/signin');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
                flexShrink: 0,
                position: 'fixed',
                '& .MuiDrawer-paper': {
                    width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
                    boxSizing: 'border-box',
                    overflowX: 'hidden',
                    paddingRight: 0,
                    borderRight: 0,
                    position: 'fixed',
                    transition: (theme) =>
                        theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.standard,
                        }),
                },
            }}
        >
            <Toolbar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: open ? 'space-between' : 'center',
                    px: open ? 2 : 1,
                }}
            >
                {open && (
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
                    >
                        BudgetMaster
                    </Typography>
                )}
                <IconButton
                    onClick={onClose}
                    sx={{
                        borderRadius: '8px',
                        ml: open ? 'auto' : 0,
                        transition: 'background-color 0.3s ease',
                        '&:hover': {
                            backgroundColor: '#4caf50',
                            color: '#fff',
                        },
                        '&:hover svg': {
                            color: '#fff',
                        },
                    }}
                >
                    <MenuIcon />
                </IconButton>
            </Toolbar>

            <List
                sx={{
                    width: '100%',
                    '& .MuiListItem-root': {
                        borderRadius: '8px',
                        mx: 1,
                        width: 'calc(100% - 16px)',
                        my: 0.5,
                        transition: 'background-color 0.3s ease',
                        cursor: 'pointer',
                    },
                    '& .MuiListItem-root:not(.logout-item):hover': {
                        backgroundColor: '#4caf50',
                        color: '#fff',
                    },
                    '& .MuiListItem-root:not(.logout-item):hover .MuiListItemIcon-root': {
                        color: '#fff',
                    },
                }}
            >
                <ListItem
                    button
                    key="Dashboard"
                    onClick={() => handleNavigation('/dashboard')}
                    sx={{
                        backgroundColor: isActive('/dashboard') ? 'rgba(128, 128, 128, 0.68)' : 'transparent',
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 0, mr: 3, justifyContent: open ? 'flex-start' : 'center' }}>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} />
                </ListItem>

                <ListItem
                    button
                    key="Transactions"
                    onClick={() => handleNavigation('/transaction')}
                    sx={{
                        backgroundColor: isActive('/transaction') ? 'rgba(128, 128, 128, 0.68)' : 'transparent',
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 0, mr: 3, justifyContent: open ? 'flex-start' : 'center' }}>
                        <AttachMoneyIcon />
                    </ListItemIcon>
                    <ListItemText primary="Transactions" sx={{ opacity: open ? 1 : 0 }} />
                </ListItem>

                <ListItem
                    button
                    key="Budgets"
                    onClick={() => handleNavigation('/budgets')}
                    sx={{
                        backgroundColor: isActive('/budgets') ? 'rgba(128, 128, 128, 0.68)' : 'transparent',
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 0, mr: 3, justifyContent: open ? 'flex-start' : 'center' }}>
                        <SavingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Budgets" sx={{ opacity: open ? 1 : 0 }} />
                </ListItem>

                <ListItem
                    button
                    key="Reports"
                    onClick={() => handleNavigation('/reports')}
                    sx={{
                        backgroundColor: isActive('/reports') ? 'rgba(128, 128, 128, 0.68)' : 'transparent',
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 0, mr: 3, justifyContent: open ? 'flex-start' : 'center' }}>
                        <BarChartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Reports" sx={{ opacity: open ? 1 : 0 }} />
                </ListItem>

                <ListItem
                    button
                    key="Logout"
                    onClick={handleLogout}
                    className="logout-item"
                    sx={{
                        '&:hover': {
                            backgroundColor: '#f44336', // red
                            color: '#fff',
                        },
                        '&:hover .MuiListItemIcon-root': {
                            color: '#fff',
                        },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 0, mr: 3, justifyContent: open ? 'flex-start' : 'center' }}>
                        <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
                </ListItem>
            </List>

            <Box sx={{ mt: 'auto', p: 2 }}>
                <ListItem
                    sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                    }}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                        }}
                    >
                        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </ListItemIcon>
                    {open && (
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Typography sx={{ flexGrow: 1 }}>Dark Mode</Typography>
                            <Switch
                                edge="end"
                                onChange={toggleColorMode}
                                checked={mode === 'dark'}
                            />
                        </Box>
                    )}
                </ListItem>
            </Box>
        </Drawer>
    );
}

export default Sidebar;