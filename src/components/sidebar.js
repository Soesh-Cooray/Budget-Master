import React from 'react';
import {Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar,Typography, IconButton} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SavingsIcon from '@mui/icons-material/Savings';
import BarChartIcon from '@mui/icons-material/BarChart';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { DRAWER_WIDTH } from '../constants';

const COLLAPSED_WIDTH = 60;

function Sidebar({ open, onClose }) {
    const navigate = useNavigate();
    const location = useLocation();

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
                flexShrink: 1,
                '& .MuiDrawer-paper': {
                    width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
                    boxSizing: 'border-box',
                    overflowX: 'hidden',
                    paddingRight: open ? '8px' : 0,
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
                    px: 20,
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
                        ml: 'auto',  
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
                    '& .MuiListItem-root': {
                        borderRadius: '8px',
                        ml: 1,
                        mr: 0,
                        my: 0,
                        transition: 'background-color 0.3s ease',
                    },
                    '& .MuiListItem-root:hover': {
                        backgroundColor: '#4caf50',
                        color: '#fff',
                    },
                    '& .MuiListItem-root:hover .MuiListItemIcon-root': {
                        color: '#fff',
                    },
                }}
            >
                <ListItem
                    button
                    key="Dashboard"
                    onClick={() => handleNavigation('/')}
                    sx={{
                        backgroundColor: isActive('/') ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                    }}
                >
                    <ListItemIcon><DashboardIcon /></ListItemIcon>
                    <ListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} />
                </ListItem>

                <ListItem
                    button
                    key="Transactions"
                    onClick={() => handleNavigation('/transaction')}
                    sx={{
                        backgroundColor: isActive('/transaction') ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                    }}
                >
                    <ListItemIcon><AttachMoneyIcon /></ListItemIcon>
                    <ListItemText primary="Transactions" sx={{ opacity: open ? 1 : 0 }} />
                </ListItem>

                <ListItem
                    button
                    key="Budgets"
                    onClick={() => handleNavigation('/budgets')}
                    sx={{
                        backgroundColor: isActive('/budgets') ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                    }}
                >
                    <ListItemIcon><SavingsIcon /></ListItemIcon>
                    <ListItemText primary="Budgets" sx={{ opacity: open ? 1 : 0 }} />
                </ListItem>

                <ListItem
                    button
                    key="Reports"
                    onClick={() => handleNavigation('/reports')}
                    sx={{
                        backgroundColor: isActive('/reports') ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                    }}
                >
                    <ListItemIcon><BarChartIcon /></ListItemIcon>
                    <ListItemText primary="Reports" sx={{ opacity: open ? 1 : 0 }} />
                </ListItem>

                <ListItem
                    button
                    key="Logout"
                    onClick={handleLogout}
                >
                    <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                    <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
                </ListItem>
            </List>
        </Drawer>
    );
}

export default Sidebar;
