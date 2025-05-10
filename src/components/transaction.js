import React, { useState } from 'react';
import {
  Box,Typography,Button,TextField,Select,Dialog,DialogTitle,DialogContent,DialogActions,ThemeProvider,
  createTheme,Table,TableHead,TableBody,TableRow,TableCell,IconButton,FormControl,InputLabel,
} from '@mui/material';

import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { MenuItem, styled } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 'bold',
          fontSize: 16,
        },
      },
    },
  },
});

const HoverMenuItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: 5,
  '&:hover': {
    backgroundColor: '#16a34a',
    color: '#f9fafb',
  },
}));

function TransactionsPage() {
  const navigate = useNavigate();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  // Form state
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // Optionally clear other user-related data from localStorage or state
    navigate('/signin'); // Redirect to the signin page
  };



  const handleOpenAddDialog = () => {
      setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
      setOpenAddDialog(false);
  };

  
  
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: '#f0f7ff', padding: 2 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Transactions
            </Typography>
            <Typography variant="body1">Manage your income and expenses</Typography>
          </Box>
          
        </Box>

        {/* Filters */}
        <Box display="flex" alignItems="center" mb={2} justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <TextField
              label="Search transactions...  "
              size="small"
              sx={{ mr: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 },width: 200, }}
            />
            <Select
              value="all"
              size="small"
              sx={{ mr: 1, borderRadius: 2 }}
              MenuProps={{
                PaperProps: {
                  style: {
                    borderRadius: 2,
                  },
                },
              }}  
            >
              <HoverMenuItem value="all">All Types</HoverMenuItem>
              <HoverMenuItem value="income">Income</HoverMenuItem>
              <HoverMenuItem value="expense">Expense</HoverMenuItem>
            </Select>
            <Select
              value="all"
              size="small"
              sx={{ borderRadius: 2 }}
              MenuProps={{
                PaperProps: {
                  style: {
                    borderRadius: 2,
                  },
                },
              }}
            > 
            <HoverMenuItem value="all">All Categories</HoverMenuItem>
            <HoverMenuItem value="housing">Housing</HoverMenuItem>
            <HoverMenuItem value="food">Food</HoverMenuItem>
            <HoverMenuItem value="transpotation">Transportation</HoverMenuItem>
            <HoverMenuItem value="entertainment">Entertainment</HoverMenuItem>
            <HoverMenuItem value="shopping">Shopping</HoverMenuItem>
            <HoverMenuItem value="healthcare">Healthcare</HoverMenuItem>
            <HoverMenuItem value="utilities">Utilities</HoverMenuItem>
            </Select>
          </Box>
          <Button variant="contained" sx={{ borderRadius: 2 }} onClick={handleOpenAddDialog}>
          + Add Transaction
          </Button>
        </Box>

        {/* Transactions Table or Clean State */}
        {expenses.length > 0 || incomes.length > 0 ?  ( 
    <Table>
        <TableHead>
            <TableRow sx={{ backgroundColor: '#e0f7fa' }}>
                <TableCell>Description</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Actions</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {[...expenses.map(exp => ({ ...exp, type: 'Expense' })), ...incomes.map(inc => ({ ...inc, type: 'Income' }))].map((transaction) => (
                <TableRow key={transaction.id}>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{categories.find(cat => cat.id === transaction.category)?.name || 'Unknown'}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell
                        sx={{
                            color: transaction.type === 'Income' ? 'green' : 'red',
                            fontWeight: 'bold',
                        }}
                    >
                        {transaction.type === 'Income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                        <IconButton>
                            <EditIcon />
                        </IconButton>
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
    ) : (
          // Clean state when no transactions are available
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="50vh">
            <MonetizationOnIcon sx={{ fontSize: 200, color: '#0EA9FF' }} />
            <Typography variant="h6" gutterBottom>
              No transactions yet
            </Typography>
            <Typography variant="body2" gutterBottom>
              Start by adding your first transaction to track your income and expenses
            </Typography>

            {/* Add Transaction Button (Centered) */}
            <Button variant="contained" onClick={handleOpenAddDialog} sx={{ mt: 2, borderRadius: 2 }}>
              + Add Transaction
            </Button>
          </Box>
        )}

        {/* Add Transaction Dialog */}
        <Dialog
          open={openAddDialog}
          onClose={handleCloseAddDialog}
          PaperProps={{
            style: {
              borderRadius: 10,
            },
          }}
        >
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogContent>
            <TextField label="What was this transaction for" fullWidth margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
            <TextField fullWidth margin="normal" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Category</InputLabel>
              <Select value={category} onChange={(e) => setCategory(e.target.value)} >
                {categories.map((cat) => (
                  <HoverMenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </HoverMenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select value={type} onChange={(e) => setType(e.target.value)}>
                <HoverMenuItem value="income">Income</HoverMenuItem>
                <HoverMenuItem value="expense">Expense</HoverMenuItem>
              </Select>
            </FormControl>
            <TextField label="Amount" fullWidth margin="normal" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseAddDialog}
              sx={{ borderRadius: 4, '&:hover': { backgroundColor: '#FF0C0C', color: '#f9fafb' } }}
            >
              Cancel
            </Button>
            <Button variant="contained"  sx={{ borderRadius: 4, '&:hover': { backgroundColor: '#16a34a', color: '#f9fafb' } }}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default TransactionsPage;