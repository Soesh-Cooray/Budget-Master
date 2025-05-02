import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SavingsIcon from '@mui/icons-material/Savings';
import BarChartIcon from '@mui/icons-material/BarChart';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate, useLocation } from 'react-router-dom';
import { DRAWER_WIDTH } from '../constants';

function Sidebar() {
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
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar sx={{ display: 'flex', alignItems: 'center', pl: 2 }}>
                <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                    BudgetMaster
                </Typography>
                {/* You could add a hamburger menu icon here for smaller screens if needed */}
            </Toolbar>
            <List>
                <ListItem button key="Dashboard" onClick={() => handleNavigation('/')} sx={{ backgroundColor: isActive('/') ? 'rgba(0, 0, 0, 0.08)' : 'transparent' }}>
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button key="Transactions" onClick={() => handleNavigation('/transaction')} sx={{ backgroundColor: isActive('/transaction') ? 'rgba(0, 0, 0, 0.08)' : 'transparent' }}>
                    <ListItemIcon>
                        <AttachMoneyIcon />
                    </ListItemIcon>
                    <ListItemText primary="Transactions" />
                </ListItem>
                <ListItem button key="Budgets" onClick={() => handleNavigation('/budgets')} sx={{ backgroundColor: isActive('/budgets') ? 'rgba(0, 0, 0, 0.08)' : 'transparent' }}>
                    <ListItemIcon>
                        <SavingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Budgets" />
                </ListItem>
                <ListItem button key="Reports" onClick={() => handleNavigation('/reports')} sx={{ backgroundColor: isActive('/reports') ? 'rgba(0, 0, 0, 0.08)' : 'transparent' }}>
                    <ListItemIcon>
                        <BarChartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Reports" />
                </ListItem>
                <ListItem button key="Logout" onClick={handleLogout}>
                    <ListItemIcon>
                        <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </Drawer>
    );
}

export default Sidebar;