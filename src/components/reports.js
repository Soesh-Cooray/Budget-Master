import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Container,
  Paper,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(1),
  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
  padding: theme.spacing(2),
}));

const AmountTypography = styled(Typography)(({ theme, color }) => ({
  fontWeight: 'bold',
  color: color === 'income' ? '#00C853' : color === 'expense' ? '#FF3D00' : '#1E88E5',
  fontSize: '2rem',
  marginTop: theme.spacing(1),
}));

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ marginTop: '20px' }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const Reports = () => {
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('6');
  const [financialData, setFinancialData] = useState({
    totalIncome: 50000,
    totalExpenses: 27000,
    netBalance: 23000,
    incomeVsExpenses: {
      labels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
      income: [0, 0, 0, 0, 48000, 0],
      expenses: [0, 0, 0, 0, 0, 27000]
    },
    expenseBreakdown: {
      labels: ['Dining Out', 'Rent', 'Utilities'],
      values: [20000, 5000, 2000],
      percentages: [74.1, 18.5, 7.4],
      colors: ['#f06292', '#7986cb', '#ff7043']
    },
    categorySpendingOverTime: {
      labels: ['Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025'],
      datasets: [
        {
          label: 'Groceries',
          data: [0, 0, 0, 0, 0, 0],
          backgroundColor: '#ffb74d'
        },
        {
          label: 'Utilities',
          data: [0, 0, 0, 0, 0, 2000],
          backgroundColor: '#ff7043'
        },
        {
          label: 'Rent',
          data: [0, 0, 0, 0, 0, 5000],
          backgroundColor: '#7986cb'
        },
        {
          label: 'Dining Out',
          data: [0, 0, 0, 0, 0, 20000],
          backgroundColor: '#f06292'
        }
      ]
    }
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  // Chart configurations
  const incomeExpenseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f0f0f0',
          borderDash: [5, 5],
        },
        ticks: {
          callback: (value) => `${value}`,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`,
        },
      },
    },
  };

  const incomeExpenseChartData = {
    labels: financialData.incomeVsExpenses.labels,
    datasets: [
      {
        label: 'Income',
        data: financialData.incomeVsExpenses.income,
        backgroundColor: '#00C853',
        barThickness: 20,
      },
      {
        label: 'Expenses',
        data: financialData.incomeVsExpenses.expenses,
        backgroundColor: '#FF3D00',
        barThickness: 20,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${percentage}%`;
          },
        },
      },
    },
    cutout: '70%',
  };

  const expenseBreakdownData = {
    labels: financialData.expenseBreakdown.labels,
    datasets: [
      {
        data: financialData.expenseBreakdown.values,
        backgroundColor: financialData.expenseBreakdown.colors,
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${percentage}%`;
          },
        },
      },
    },
  };


  const categorySpendingOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: '#f0f0f0',
          borderDash: [5, 5],
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => {
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Financial Reports
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Visualize your financial trends and patterns
        </Typography>
      </Box>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="time-range-label">Last</InputLabel>
          <Select
            labelId="time-range-label"
            id="time-range"
            value={timeRange}
            onChange={handleTimeRangeChange}
            label="Last"
          >
            <MenuItem value="1">Last month</MenuItem>
            <MenuItem value="3">Last 3 months</MenuItem>
            <MenuItem value="6">Last 6 months</MenuItem>
            <MenuItem value="12">Last year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <StyledCard>
          <Card sx={{ height: 150, width: 330, padding: 2 }}>
            <Box>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Total Income
              </Typography>
              <AmountTypography color="income">
                ${financialData.totalIncome.toLocaleString()}
              </AmountTypography>
            </Box>
            </Card>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledCard>
          <Card sx={{ height: 150, width: 330, padding: 2 }}>
            <Box>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Total Expenses
              </Typography>
              <AmountTypography color="expense">
                ${financialData.totalExpenses.toLocaleString()}
              </AmountTypography>
            </Box>
            </Card>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledCard>
          <Card sx={{ height: 150, width: 330,padding: 2 }}>
            <Box>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Net Balance
              </Typography>
              <AmountTypography color="balance">
                ${financialData.netBalance.toLocaleString()}
              </AmountTypography>
            </Box>
            </Card>
          </StyledCard>
        </Grid>
      </Grid>

      <Paper sx={{ mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider', borderRadius: 4}}
        >
          <Tab label="Overview" />
          <Tab label="Expenses" />
          <Tab label="Trends" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StyledCard>
              <Card sx={{ height: 500, width: 500}}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Income vs Expenses
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Your financial balance over time
                  </Typography>
                  <Box height={350}>
                    <Bar data={incomeExpenseChartData} options={incomeExpenseChartOptions} />
                  </Box>
                </CardContent>
                </Card>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <Card sx={{ height: 500, width: 550}}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Expense Breakdown
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Your spending by category
                  </Typography>
                  <Box height={350} display="flex" justifyContent="center">
                    <Box width="80%" height="100%">
                      <Doughnut data={expenseBreakdownData} options={doughnutOptions} />
                    </Box>
                  </Box>
                </CardContent>
                </Card>
              </StyledCard>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Expense Categories
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Breakdown of your spending by category
              </Typography>
              <Box height={400} display="flex" justifyContent="center">
                <Box width="70%" height="100%">
                  <Pie data={expenseBreakdownData} options={pieOptions} />
                </Box>
              </Box>
            </CardContent>
          </StyledCard>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Category Spending Over Time
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Track how your spending in top categories changes over time
              </Typography>
              <Box height={400}>
                <Bar 
                  data={{
                    labels: financialData.categorySpendingOverTime.labels,
                    datasets: financialData.categorySpendingOverTime.datasets
                  }} 
                  options={categorySpendingOptions} 
                />
              </Box>
            </CardContent>
          </StyledCard>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Reports;