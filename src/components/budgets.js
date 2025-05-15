import React, { useState, useEffect } from 'react';
import { Container,Typography,Card,Grid,LinearProgress,Box,IconButton,Dialog,DialogTitle,DialogContent,TextField,Select,
    MenuItem,Button,FormControl,InputLabel,Paper,CircularProgress,Snackbar,Alert} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SavingsIcon from '@mui/icons-material/Savings';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { categoryAPI, budgetAPI, transactionAPI,getCurrencySymbol } from '../api';

function BudgetsPage() {
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddBudgetDialogOpen, setIsAddBudgetDialogOpen] = useState(false);
    const [currencySymbol, setCurrencySymbol] = useState(getCurrencySymbol());
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [editingBudget, setEditingBudget] = useState(null);

    useEffect(() => {
        fetchBudgetsCategoriesTransactions();
        const updateCurrency = () => setCurrencySymbol(getCurrencySymbol());
        window.addEventListener('currencyChange', updateCurrency);
        return () => window.removeEventListener('currencyChange', updateCurrency);
    }, []);

    const fetchBudgetsCategoriesTransactions = async () => {
        try {
            setLoading(true);
            const [budgetsRes, categoriesRes, transactionsRes] = await Promise.all([
                budgetAPI.getAll(),
                categoryAPI.getExpenseCategories(),
                transactionAPI.getExpenses()
            ]);
            setBudgets(budgetsRes.data);
            setCategories(categoriesRes.data);
            setTransactions(transactionsRes.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching budgets, categories, or transactions:', err);
            setError('Failed to load budgets, categories, or transactions');
            setLoading(false);
        }
    };

    const handleAddBudgetOpen = () => {
        setIsAddBudgetDialogOpen(true);
    };

    const handleAddBudgetClose = () => {
        setIsAddBudgetDialogOpen(false);
        setEditingBudget(null);
    };

    const handleEditBudget = (id, budget) => {
        setEditingBudget(budget);
        setIsAddBudgetDialogOpen(true);
    };

    const handleAddNewBudget = async (newBudget) => {
        try {
            const categoryObj = categories.find(cat => cat.name === newBudget.category);
            if (!categoryObj) throw new Error('Category not found');
            const payload = {
                category: categoryObj.id,
                amount: newBudget.budgetAmount,
                period: newBudget.period,
                start_date: newBudget.startDate
            };
            if (editingBudget) {
                // Update existing budget
                const res = await budgetAPI.update(editingBudget.id, payload);
                setBudgets(budgets.map(b => b.id === editingBudget.id ? res.data : b));
                setSnackbar({
                    open: true,
                    message: 'Budget updated successfully',
                    severity: 'success'
                });
            } else {
                // Create new budget
                const res = await budgetAPI.create(payload);
                setBudgets([...budgets, res.data]);
                setSnackbar({
                    open: true,
                    message: 'Budget added successfully',
                    severity: 'success'
                });
            }
        } catch (err) {
            setSnackbar({
                open: true,
                message: editingBudget ? 'Failed to update budget' : 'Failed to add budget',
                severity: 'error'
            });
        }
    };

    const handleDeleteBudget = async (id) => {
        try {
            await budgetAPI.delete(id);
            setBudgets(budgets.filter(budget => budget.id !== id));
            setSnackbar({
                open: true,
                message: 'Budget deleted successfully',
                severity: 'success'
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Failed to delete budget',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Helper to calculate spent for a budget
    const calculateSpent = (budget) => {
        const budgetStart = new Date(budget.start_date);
        const now = new Date();
        let periodEnd;
        if (budget.period === 'monthly') {
            periodEnd = new Date(budgetStart.getFullYear(), budgetStart.getMonth() + 1, budgetStart.getDate());
        } else if (budget.period === 'weekly') {
            periodEnd = new Date(budgetStart);
            periodEnd.setDate(periodEnd.getDate() + 7);
        } else {
            // 'once' or any other value
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
        <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} marginTop={2}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Budgets
                    </Typography>
                    <Typography variant="subtitle1">
                        Set and track your spending limits
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddBudgetOpen}>
                    Add Budget
                </Button>
            </Box>

            <Grid container spacing={3} alignItems="flex-start">
                {budgets.map((budget) => {
                    const spent = calculateSpent(budget);
                    const remaining = Number(budget.amount) - spent;
                    const percent = Number(budget.amount) ? Math.min((spent / Number(budget.amount)) * 100, 100) : 0;
                    const categoryName = categories.find(cat => cat.id === budget.category)?.name || 'Category';
                    return (
                        <Grid item xs={12} sm={6} md={4} key={budget.id}>
                            <BudgetProgressCard
                                name={categoryName}
                                period={budget.period}
                                startDate={budget.start_date}
                                spent={spent}
                                amount={budget.amount}
                                remaining={remaining}
                                percent={percent}
                                onEdit={() => handleEditBudget(budget.id, budget)}
                                onDelete={() => handleDeleteBudget(budget.id)}
                                currencySymbol={currencySymbol}
                            />
                        </Grid>
                    );
                })}
                {budgets.length === 0 && (
                    <Grid item xs={12} sx={{ textAlign: 'center', mt: 4 }}>
                        <Paper elevation={10} sx={{ padding: 5, width: 1150, height: 350, borderRadius: 2, backgroundColor: '#FFFFFF', borderColor: 'primary.main', borderStyle: 'dashed' }}>
                            <SavingsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h6" color="textSecondary" mb={1}>
                                No budgets set up yet
                            </Typography>
                            <Typography variant="body2" color="textSecondary" mb={2}>
                                Create your first budget to start tracking your spending and
                                stay on top of your financial goals.
                            </Typography>
                            <Button variant="contained" color="primary" onClick={handleAddBudgetOpen}>
                                Create Your First Budget
                            </Button>
                        </Paper>
                    </Grid>
                )}
            </Grid>

            <AddBudgetDialog 
                open={isAddBudgetDialogOpen} 
                onClose={handleAddBudgetClose} 
                onAddBudget={handleAddNewBudget}
                categories={categories}
                onAddCustomCategory={fetchBudgetsCategoriesTransactions}
                editingBudget={editingBudget}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

function AddBudgetDialog({ open, onClose, onAddBudget, categories, onAddCustomCategory, editingBudget }) {
    const [category, setCategory] = useState('');
    const [budgetAmount, setBudgetAmount] = useState(0);
    const [period, setPeriod] = useState('monthly');
    const [startDate, setStartDate] = useState(new Date().toLocaleDateString('en-CA').split('/').reverse().join('-'));
    const [isAddingCustomCategory, setIsAddingCustomCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (editingBudget) {
            setCategory(categories.find(cat => cat.id === editingBudget.category)?.name || '');
            setBudgetAmount(Number(editingBudget.amount));
            setPeriod(editingBudget.period);
            setStartDate(editingBudget.start_date);
        } else {
            setCategory('');
            setBudgetAmount(0);
            setPeriod('monthly');
            setStartDate(new Date().toLocaleDateString('en-CA').split('/').reverse().join('-'));
        }
    }, [editingBudget, categories]);

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleBudgetAmountChange = (event) => {
        setBudgetAmount(parseFloat(event.target.value) || 0);
    };

    const handlePeriodChange = (event) => {
        setPeriod(event.target.value);
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleAddCustomCategory = async () => {
        if (!newCategoryName.trim()) {
            setError('Category name is required');
            return;
        }

        try {
            await categoryAPI.create({
                name: newCategoryName,
                transaction_type: 'expense'
            });
            
            setNewCategoryName('');
            setIsAddingCustomCategory(false);
            onAddCustomCategory(); // Refresh categories
            setError('');
        } catch (err) {
            console.error('Error creating category:', err);
            setError('Failed to create category');
        }
    };

    const handleAddBudget = () => {
        if (!category) {
            setError('Please select a category');
            return;
        }
        onAddBudget({
            category,
            budgetAmount,
            period,
            startDate,
            spent: 0,
            allocated: budgetAmount
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {editingBudget ? 'Edit Budget' : 'Add Budget'}
                <IconButton aria-label="close" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {!isAddingCustomCategory ? (
                            <>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="category-label" shrink>Category</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        id="category"
                                        value={category}
                                        onChange={handleCategoryChange}
                                        error={!!error}
                                        label="Category"
                                    >
                                        <MenuItem value="">
                                            <em>Select category</em>
                                        </MenuItem>
                                        {categories.map((cat) => (
                                            <MenuItem key={cat.id} value={cat.name}>
                                                {cat.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Box mt={1}>
                                    <Button size="small" onClick={() => setIsAddingCustomCategory(true)}>
                                        + Add custom category
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <Box>
                                <TextField
                                    fullWidth
                                    label="New Category Name"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    error={!!error}
                                    helperText={error}
                                />
                                <Box mt={1} display="flex" gap={1}>
                                    <Button 
                                        size="small" 
                                        onClick={handleAddCustomCategory}
                                        variant="contained"
                                    >
                                        Add Category
                                    </Button>
                                    <Button 
                                        size="small" 
                                        onClick={() => {
                                            setIsAddingCustomCategory(false);
                                            setNewCategoryName('');
                                            setError('');
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Budget Amount"
                            type="number"
                            value={budgetAmount}
                            onChange={handleBudgetAmountChange}
                            inputProps={{ min: 0, step: 0.01 }}
                            InputLabelProps={{ shrink: true }}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="period-label" shrink>Period</InputLabel>
                            <Select
                                labelId="period-label"
                                id="period"
                                value={period}
                                onChange={handlePeriodChange}
                                label="Period"
                            >
                                <MenuItem value="monthly">Monthly</MenuItem>
                                <MenuItem value="weekly">Weekly</MenuItem>
                                <MenuItem value="once">Once</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Start Date"
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                </Grid>
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button onClick={onClose} sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleAddBudget}>
                        {editingBudget ? 'Update Budget' : 'Add Budget'}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

const BudgetProgressCard = ({ name, period, startDate, spent, amount, remaining, percent, onEdit, onDelete, currencySymbol }) => (
    <Card sx={{ 
        p: 3, 
        borderRadius: 3, 
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        mb: 2, 
        minWidth: 320,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.18)'
        }
    }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{name}</Typography>
            <Box>
                <IconButton aria-label="edit" onClick={onEdit}><EditIcon /></IconButton>
                <IconButton aria-label="delete" onClick={onDelete}><DeleteIcon /></IconButton>
            </Box>
        </Box>
        <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 0.5 }}>
            {period.charAt(0).toUpperCase() + period.slice(1)} Budget
        </Typography>
        <Box display="flex" alignItems="center" color="text.secondary" sx={{ mb: 1 }}>
            <CalendarTodayIcon sx={{ fontSize: 18, mr: 1 }} />
            <Typography variant="body2">Started {new Date(startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography sx={{ fontWeight: 500 }}>{currencySymbol}{spent.toFixed(2)}</Typography>
            <Typography sx={{ fontWeight: 500 }}>of {currencySymbol}{Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
        </Box>
        <LinearProgress variant="determinate" value={percent} sx={{ height: 8, borderRadius: 4, backgroundColor: '#f5f5f5', mb: 1 }} />
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="textSecondary">Remaining: {currencySymbol}{Number(remaining).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
            <Typography variant="body2" color="textSecondary">{percent.toFixed(0)}%</Typography>
        </Box>
    </Card>
);

export default BudgetsPage;