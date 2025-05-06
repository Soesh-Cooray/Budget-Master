import React from 'react';
import { Box, Typography, Paper, Grid, LinearProgress,List,ListItem,ListItemText,Chip,Avatar} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale,LinearScale,BarElement,ArcElement,Title,Tooltip,Legend } from 'chart.js';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import DiningIcon from '@mui/icons-material/RestaurantMenu';
import { ChevronUp, ChevronDown } from 'lucide-react';

// Register the chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  height: '100%'
}));

const StatCard = styled(StyledPaper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 'bold',
  marginBottom: theme.spacing(0.5),
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
}));

const BudgetProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const Dashboard = () => {
  // Sample data
  const user = {
    name: 'soeshcooray',
    currentBalance: 23000.00,
    totalIncome: 50000.00,
    totalExpenses: 27000.00
  };

  // Data for the Income vs Expenses bar chart
  const barChartData = {
    labels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Income',
        data: [0, 0, 0, 0, 50000, 0],
        backgroundColor: '#4caf50',
        barThickness: 30,
      },
      {
        label: 'Expenses',
        data: [0, 0, 0, 0, 0, 27000],
        backgroundColor: '#f44336',
        barThickness: 30,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: '#f0f0f0',
        },
        ticks: {
          stepSize: 15000,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  // Data for the Expense Breakdown doughnut chart
  const doughnutChartData = {
    labels: ['Dining Out', 'Rent', 'Utilities'],
    datasets: [
      {
        data: [74.1, 18.5, 7.4],
        backgroundColor: [
          '#ec407a',
          '#7c4dff',
          '#ff7043',
        ],
        borderWidth: 0,
        cutout: '70%',
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    },
  };

  // Budget data
  const budgetData = {
    category: 'Utilities',
    spent: 2000,
    total: 12000,
    remaining: 10000,
    percentage: 17
  };

  // Recent transactions
  const recentTransactions = [
    {
      id: 1,
      description: 'birthday',
      date: 'May 5, 2023',
      category: 'Dining Out',
      amount: -20000.00,
    }
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#f0f7ff', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
        Good morning, {user.name}
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        Here's an overview of your finances
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <StatCard>
            <Box sx={{ display: 'flex', justifyContent: 'space-between',width: 350, alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" color="textSecondary">Current Balance</Typography>
              <AccountBalanceWalletIcon sx={{color: '#39C8CC'}}/>
            </Box>
            <StatValue>${user.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</StatValue>
            <StatLabel>Total balance across all accounts</StatLabel>
          </StatCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard>
            <Box sx={{ display: 'flex', justifyContent: 'space-between',width: 350, alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" color="textSecondary">Total Income</Typography>
                <ArrowCircleUpIcon  sx={{ color: '#2eb432' }}/>
            </Box>
            <StatValue sx={{ color: '#4caf50' }}>${user.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</StatValue>
            <StatLabel>Total income this period</StatLabel>
          </StatCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard>
            <Box sx={{ display: 'flex', justifyContent: 'space-between',width: 350, alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" color="textSecondary">Total Expenses</Typography>
                <ArrowCircleDownIcon sx={{ color: '#f44336' }}/>
            </Box>
            <StatValue sx={{ color: '#f44336' }}>${user.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</StatValue>
            <StatLabel>Total expenses this period</StatLabel>
          </StatCard>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" sx={{ mb: 0.5 }}>Income vs Expenses</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>Your financial balance over time</Typography>
            <Box sx={{ height: 400, width : 400}}>
              <Bar data={barChartData} options={barChartOptions} />
            </Box>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" sx={{ mb: 0.5 }}>Expense Breakdown</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>Your spending by category</Typography>
            <Box sx={{ height: 300, width:670, display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
              
              {/* Legends for the doughnut chart */}
              <Box sx={{ position: 'absolute',top:350, width: '100%', display: 'flex', justifyContent: 'center',mt: 4,pb: 2 }}>
                <Box sx={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center'}}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ec407a' }} />
                    <Typography variant="caption">Dining Out 74.1%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#7c4dff' }} />
                    <Typography variant="caption">Rent 18.5%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff7043' }} />
                    <Typography variant="caption">Utilities 7.4%</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>

      {/* Budget Progress */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Budget Progress</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>{budgetData.category}</Typography>
            <Typography variant="body2">
              ${budgetData.spent.toLocaleString()} of ${budgetData.total.toLocaleString()}
            </Typography>
            <BudgetProgressBar 
              variant="determinate" 
              value={budgetData.percentage} 
              sx={{ 
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#4caf50',
                },
                backgroundColor: '#e0e0e0'
              }} 
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="textSecondary">
                Remaining: ${budgetData.remaining.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {budgetData.percentage}%
              </Typography>
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>

      {/* Recent Transactions */}
      <StyledPaper>
        <Typography variant="h6" sx={{ mb: 0.5 }}>Recent Transactions</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>Your latest financial activities</Typography>
        
        <List>
          {recentTransactions.map((transaction) => (
            <ListItem
              key={transaction.id}
              sx={{ 
                px: 2, 
                py: 1.5, 
                borderRadius: 1, 
                '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                border: '1px solid #f0f0f0',
                mb: 1
              }}
            >
              <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#ffebee', 
                    color: '#ec407a', 
                    width: 40, 
                    height: 40,
                    mr: 2
                  }}
                >
                  {transaction.category === 'Dining Out' ? '🍽️' : null}
                </Avatar>
                
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {transaction.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Typography variant="caption" color="textSecondary">
                      {transaction.date}
                    </Typography>
                    <Chip 
                      label={transaction.category} 
                      size="small" 
                      sx={{ 
                        height: 20, 
                        fontSize: '0.625rem',
                        bgcolor: '#ffebee',
                        color: '#ec407a',
                      }}
                    />
                  </Box>
                </Box>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: transaction.amount < 0 ? '#f44336' : '#4caf50' 
                  }}
                >
                  {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </StyledPaper>
    </Box>
  );
};

export default Dashboard;