// sidebar.js
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SavingsIcon from '@mui/icons-material/Savings';
import BarChartIcon from '@mui/icons-material/BarChart';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate, useLocation } from 'react-router-dom';
import { DRAWER_WIDTH } from '../constants';

const COLLAPSED_WIDTH = 56;

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
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
                    boxSizing: 'border-box',
                    overflowX: 'hidden',
                    transition: (theme) =>
                        theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.standard,
                        }),
                },
            }}
        >
            <Toolbar>
                <Typography
                    variant="h6"
                    noWrap
                    sx={{
                        opacity: open ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                    }}
                >
                    BudgetMaster
                </Typography>
            </Toolbar>
            <List>
                <ListItem
                    button
                    key="Dashboard"
                    onClick={() => handleNavigation('/')}
                    sx={{ backgroundColor: isActive('/') ? 'rgba(0, 0, 0, 0.08)' : 'transparent' }}
                >
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} />
                </ListItem>
                <ListItem
                    button
                    key="Transactions"
                    onClick={() => handleNavigation('/transaction')}
                    sx={{ backgroundColor: isActive('/transaction') ? 'rgba(0, 0, 0, 0.08)' : 'transparent' }}
                >
                    <ListItemIcon>
                        <AttachMoneyIcon />
                    </ListItemIcon>
                    <ListItemText primary="Transactions" sx={{ opacity: open ? 1 : 0 }} />
                </ListItem>
                <ListItem
                    button
                    key="Budgets"
                    onClick={() => handleNavigation('/budgets')}
                    sx={{ backgroundColor: isActive('/budgets') ? 'rgba(0, 0, 0, 0.08)' : 'transparent' }}
                >
                    <ListItemIcon>
                        <SavingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Budgets" sx={{ opacity: open ? 1 : 0 }} />
                </ListItem>
                <ListItem
                    button
                    key="Reports"
                    onClick={() => handleNavigation('/reports')}
                    sx={{ backgroundColor: isActive('/reports') ? 'rgba(0, 0, 0, 0.08)' : 'transparent' }}
                >
                    <ListItemIcon>
                        <BarChartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Reports" sx={{ opacity: open ? 1 : 0 }} />
                </ListItem>
                <ListItem button key="Logout" onClick={handleLogout}>
                    <ListItemIcon>
                        <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
                </ListItem>
            </List>
        </Drawer>
    );
}

export default Sidebar;
