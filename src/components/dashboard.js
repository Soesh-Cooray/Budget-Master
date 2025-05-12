import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, LinearProgress, List, ListItem, ListItemText, Chip, Avatar, CircularProgress, Card, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale,LinearScale,BarElement,ArcElement,Title,Tooltip,Legend } from 'chart.js';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import { transactionAPI, budgetAPI, categoryAPI } from '../api';
import { jwtDecode } from 'jwt-decode';

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
  boxShadow: theme.palette.mode === 'dark' ? '0 2px 10px rgba(0, 0, 0, 0.2)' : '0 2px 10px rgba(0, 0, 0, 0.05)',
  height: '100%',
  backgroundColor: theme.palette.background.paper,
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
  color: theme.palette.text.primary,
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
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#f5f5f5',
}));

const BudgetProgressCard = ({ name, spent, amount, remaining, percent }) => {
  const theme = useTheme();
  return (
    <Card sx={{ 
      p: 3, 
      borderRadius: 3, 
      boxShadow: theme.palette.mode === 'dark' ? '0 2px 10px rgba(0, 0, 0, 0.2)' : '0 2px 10px rgba(0,0,0,0.05)', 
      mb: 2, 
      minWidth: 320,
      backgroundColor: theme.palette.background.paper,
    }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: theme.palette.text.primary }}>{name}</Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography sx={{ fontWeight: 500, color: theme.palette.text.primary }}>${spent.toFixed(2)}</Typography>
        <Typography sx={{ fontWeight: 500, color: theme.palette.text.primary }}>of ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={percent} 
        sx={{ 
          height: 8, 
          borderRadius: 4, 
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#f5f5f5', 
          mb: 1 
        }} 
      />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="textSecondary">Remaining: ${Number(remaining).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
        <Typography variant="body2" color="textSecondary">{percent.toFixed(0)}%</Typography>
      </Box>
    </Card>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [financialData, setFinancialData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    currentBalance: 0,
    incomeVsExpenses: {
      labels: [],
      income: [],
      expenses: []
    },
    expenseBreakdown: {
      labels: [],
      values: [],
      percentages: [],
      colors: ['#ec407a', '#7c4dff', '#ff7043', '#4caf50', '#ff9800', '#2196f3']
    }
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentBudgets, setRecentBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Get username from JWT token
  let username = '';
  const token = localStorage.getItem('accessToken');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded.username || decoded.user || decoded.email || '';
    } catch (e) {
      username = '';
    }
  }

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expensesRes, incomesRes, budgetsRes, categoriesRes] = await Promise.all([
        transactionAPI.getExpenses(),
        transactionAPI.getIncomes(),
        budgetAPI.getAll(),
        categoryAPI.getExpenseCategories()
      ]);

      const expenses = expensesRes.data;
      const incomes = incomesRes.data;
      const budgets = budgetsRes.data;
      const allTransactions = [...expenses, ...incomes].sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(allTransactions);
      setCategories(categoriesRes.data);

      // Calculate totals
      const totalIncome = incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
      const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
      const currentBalance = totalIncome - totalExpenses;

      // Process data for charts
      const last6Months = getLast6Months();
      const incomeVsExpenses = processIncomeVsExpensesData(incomes, expenses, last6Months);
      const expenseBreakdown = processExpenseBreakdownData(expenses);

      setFinancialData({
        totalIncome,
        totalExpenses,
        currentBalance,
        incomeVsExpenses,
        expenseBreakdown
      });

      // Set 5 most recent transactions
      setRecentTransactions(allTransactions.slice(0, 5));

      // Set 2 most recently updated budgets (by created_at desc)
      const sortedBudgets = budgets
        .slice()
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setRecentBudgets(sortedBudgets.slice(0, 2));

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const getLast6Months = () => {
    const months = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(date.toLocaleString('default', { month: 'short' }));
    }
    return months;
  };

  const processIncomeVsExpensesData = (incomes, expenses, months) => {
    const incomeData = new Array(6).fill(0);
    const expenseData = new Array(6).fill(0);

    // Process incomes
    incomes.forEach(income => {
      const date = new Date(income.date);
      const monthIndex = months.indexOf(date.toLocaleString('default', { month: 'short' }));
      if (monthIndex !== -1) {
        incomeData[monthIndex] += parseFloat(income.amount);
      }
    });

    // Process expenses
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthIndex = months.indexOf(date.toLocaleString('default', { month: 'short' }));
      if (monthIndex !== -1) {
        expenseData[monthIndex] += parseFloat(expense.amount);
      }
    });

    return {
      labels: months,
      income: incomeData,
      expenses: expenseData
    };
  };

  const processExpenseBreakdownData = (expenses) => {
    const categoryTotals = {};
    let totalExpenses = 0;

    // Calculate totals per category
    expenses.forEach(expense => {
      const category = expense.category_name || 'Uncategorized';
      const amount = parseFloat(expense.amount);
      categoryTotals[category] = (categoryTotals[category] || 0) + amount;
      totalExpenses += amount;
    });

    // Convert to arrays for chart
    const labels = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);
    const percentages = values.map(value => ((value / totalExpenses) * 100).toFixed(1));

    return {
      labels,
      values,
      percentages,
      colors: financialData.expenseBreakdown.colors.slice(0, labels.length)
    };
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

  // Helper to calculate spent for a budget
  const calculateSpent = (budget) => {
    const budgetStart = new Date(budget.start_date);
    let periodEnd;
    if (budget.period === 'monthly') {
      periodEnd = new Date(budgetStart.getFullYear(), budgetStart.getMonth() + 1, budgetStart.getDate());
    } else if (budget.period === 'weekly') {
      periodEnd = new Date(budgetStart);
      periodEnd.setDate(periodEnd.getDate() + 7);
    } else {
      periodEnd = new Date(budgetStart);
      periodEnd.setDate(periodEnd.getDate() + 1);
    }
    // Only consider transactions in the period and category
    return transactions
      .filter(txn =>
        txn.category === budget.category &&
        new Date(txn.date) >= budgetStart &&
        new Date(txn.date) < periodEnd
      )
      .reduce((sum, txn) => sum + parseFloat(txn.amount), 0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5, color: theme.palette.text.primary }}>
        {username ? `${getGreeting()}, ${username}` : getGreeting()}
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        Here's an overview of your finances
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <StatCard>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: 350, alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" color="textSecondary">Current Balance</Typography>
              <AccountBalanceWalletIcon sx={{ color: theme.palette.mode === 'dark' ? '#90caf9' : '#39C8CC' }}/>
            </Box>
            <StatValue>${financialData.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</StatValue>
            <StatLabel>Total balance across all accounts</StatLabel>
          </StatCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: 350, alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" color="textSecondary">Total Income</Typography>
              <ArrowCircleUpIcon sx={{ color: theme.palette.mode === 'dark' ? '#81c784' : '#2eb432' }}/>
            </Box>
            <StatValue sx={{ color: theme.palette.mode === 'dark' ? '#81c784' : '#4caf50' }}>
              ${financialData.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </StatValue>
            <StatLabel>Total income this period</StatLabel>
          </StatCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: 350, alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" color="textSecondary">Total Expenses</Typography>
              <ArrowCircleDownIcon sx={{ color: theme.palette.mode === 'dark' ? '#e57373' : '#f44336' }}/>
            </Box>
            <StatValue sx={{ color: theme.palette.mode === 'dark' ? '#e57373' : '#f44336' }}>
              ${financialData.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </StatValue>
            <StatLabel>Total expenses this period</StatLabel>
          </StatCard>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" sx={{ mb: 0.5, color: theme.palette.text.primary }}>Income vs Expenses</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>Your financial balance over time</Typography>
            <Box sx={{ height: 400, width: 400 }}>
              <Bar 
                data={{
                  labels: financialData.incomeVsExpenses.labels,
                  datasets: [
                    {
                      label: 'Income',
                      data: financialData.incomeVsExpenses.income,
                      backgroundColor: theme.palette.mode === 'dark' ? '#81c784' : '#4caf50',
                      barThickness: 30,
                    },
                    {
                      label: 'Expenses',
                      data: financialData.incomeVsExpenses.expenses,
                      backgroundColor: theme.palette.mode === 'dark' ? '#e57373' : '#f44336',
                      barThickness: 30,
                    },
                  ],
                }} 
                options={{
                  ...barChartOptions,
                  scales: {
                    ...barChartOptions.scales,
                    y: {
                      ...barChartOptions.scales.y,
                      grid: {
                        ...barChartOptions.scales.y.grid,
                        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#f0f0f0',
                      },
                      ticks: {
                        ...barChartOptions.scales.y.ticks,
                        color: theme.palette.text.secondary,
                      },
                    },
                    x: {
                      ...barChartOptions.scales.x,
                      ticks: {
                        color: theme.palette.text.secondary,
                      },
                    },
                  },
                  plugins: {
                    ...barChartOptions.plugins,
                    legend: {
                      ...barChartOptions.plugins.legend,
                      labels: {
                        ...barChartOptions.plugins.legend.labels,
                        color: theme.palette.text.secondary,
                      },
                    },
                  },
                }} 
              />
            </Box>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" sx={{ mb: 0.5, color: theme.palette.text.primary }}>Expense Breakdown</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>Your spending by category</Typography>
            <Box sx={{ height: 300, width: 670, display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <Doughnut 
                data={{
                  labels: financialData.expenseBreakdown.labels,
                  datasets: [{
                    data: financialData.expenseBreakdown.values,
                    backgroundColor: financialData.expenseBreakdown.colors,
                    borderWidth: 0,
                    cutout: '70%',
                  }],
                }} 
                options={{
                  ...doughnutChartOptions,
                  plugins: {
                    ...doughnutChartOptions.plugins,
                    tooltip: {
                      ...doughnutChartOptions.plugins.tooltip,
                      titleColor: theme.palette.text.primary,
                      bodyColor: theme.palette.text.secondary,
                      backgroundColor: theme.palette.background.paper,
                      borderColor: theme.palette.divider,
                      borderWidth: 1,
                    },
                  },
                }} 
              />
              
              {/* Legends for the doughnut chart */}
              <Box sx={{ position: 'absolute', top: 350, width: '100%', display: 'flex', justifyContent: 'center', mt: 4, pb: 2 }}>
                <Box sx={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center'}}>
                  {financialData.expenseBreakdown.labels.map((label, index) => (
                    <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: financialData.expenseBreakdown.colors[index] }} />
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        {label} {financialData.expenseBreakdown.percentages[index]}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>

      {/* Recent Transactions */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.text.primary }}>Recent Transactions</Typography>
      <Paper sx={{ 
        mb: 4, 
        p: 2,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.palette.mode === 'dark' ? '0 2px 10px rgba(0, 0, 0, 0.2)' : '0 2px 10px rgba(0,0,0,0.05)',
      }}>
        <List>
          {recentTransactions.map((transaction) => (
            <ListItem key={transaction.id} divider>
              <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                <Avatar sx={{ 
                  bgcolor: transaction.transaction_type === 'income' 
                    ? theme.palette.mode === 'dark' ? 'rgba(129, 199, 132, 0.1)' : '#e8f5e9'
                    : theme.palette.mode === 'dark' ? 'rgba(229, 115, 115, 0.1)' : '#ffebee',
                  color: transaction.transaction_type === 'income' 
                    ? theme.palette.mode === 'dark' ? '#81c784' : '#4caf50'
                    : theme.palette.mode === 'dark' ? '#e57373' : '#f44336',
                  width: 40, 
                  height: 40, 
                  mr: 2 
                }}>
                  {transaction.transaction_type === 'income' ? '+' : '-'}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                    {transaction.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Typography variant="caption" color="textSecondary">{transaction.date}</Typography>
                    <Chip 
                      label={transaction.category_name || 'Unknown'} 
                      size="small" 
                      sx={{ 
                        height: 20, 
                        fontSize: '0.625rem', 
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#f0f0f0',
                        color: theme.palette.text.secondary
                      }} 
                    />
                  </Box>
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: transaction.transaction_type === 'income'
                      ? theme.palette.mode === 'dark' ? '#81c784' : '#4caf50'
                      : theme.palette.mode === 'dark' ? '#e57373' : '#f44336'
                  }}
                >
                  {transaction.transaction_type === 'income' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Recent Budgets */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.text.primary }}>Budget Progress</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {recentBudgets.map((budget) => {
          const spent = calculateSpent(budget);
          const remaining = Number(budget.amount) - spent;
          const percent = Number(budget.amount) ? Math.min((spent / Number(budget.amount)) * 100, 100) : 0;
          const categoryName = categories.find(cat => cat.id === budget.category)?.name || 'Category';
          return (
            <Grid item xs={12} sm={6} md={4} key={budget.id}>
              <BudgetProgressCard
                name={categoryName}
                spent={spent}
                amount={budget.amount}
                remaining={remaining}
                percent={percent}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Dashboard;