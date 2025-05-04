import React, { useState } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    LinearProgress,
    Box,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Select,
    MenuItem,
    Button,
    FormControl,
    InputLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

function BudgetsPage() {
    // Replace with your actual budget data array, fetched from an API or state
    const [budgets, setBudgets] = useState([
        {
            id: 1,
            category: 'Utilities',
            budgetType: 'Monthly Budget',
            startDate: '2025-05-04', // YYYY-MM-DD format for input type="date"
            allocated: 1000,
            spent: 0,
        },
        // Add more budget objects here
    ]);

    const [isAddBudgetDialogOpen, setIsAddBudgetDialogOpen] = useState(false);

    const handleAddBudgetOpen = () => {
        setIsAddBudgetDialogOpen(true);
    };

    const handleAddBudgetClose = () => {
        setIsAddBudgetDialogOpen(false);
    };

    const handleAddNewBudget = (newBudget) => {
        // Generate a unique ID (replace with your actual ID generation logic)
        newBudget.id = budgets.length + 1;
        setBudgets([...budgets, newBudget]);
    };

    const handleEditBudget = (id, updatedBudget) => {
        // Implement your edit logic here (e.g., update state or send API request)
        console.log(`Edit budget with ID: ${id}`, updatedBudget);
    };

    const handleDeleteBudget = (id) => {
        // Implement your delete logic here (e.g., update state or send API request)
        console.log(`Delete budget with ID: ${id}`);
        const updatedBudgets = budgets.filter(budget => budget.id !== id);
        setBudgets(updatedBudgets);
    };

    return (
        <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} marginTop={2}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Budgets
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Set and track your spending limits
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddBudgetOpen}>
                    Add Budget
                </Button>
            </Box>


            <Grid container spacing={2}>
                {budgets.map((budget) => (
                    <Grid item xs={12} sm={6} md={4} key={budget.id}>
                        <Card>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} borderRadius={2} >
                                    <Typography variant="h6">{budget.category}</Typography>
                                    <Box>
                                        <IconButton aria-label="edit" onClick={() => handleEditBudget(budget.id, budget)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton aria-label="delete" onClick={() => handleDeleteBudget(budget.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="textSecondary" mb={0.5}>
                                    {budget.budgetType}
                                </Typography>
                                <Typography variant="caption" color="textSecondary" mb={1}>
                                    Started {new Date(budget.startDate).toLocaleDateString()}
                                </Typography>

                                <LinearProgress
                                    variant="determinate"
                                    value={(budget.spent / budget.allocated) * 100}
                                    sx={{ mb: 1 }}
                                />

                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                                    <Typography>${budget.spent.toFixed(2)}</Typography>
                                    <Typography color="textSecondary">of ${budget.allocated.toFixed(2)}</Typography>
                                </Box>

                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2" color="textSecondary">
                                        Remaining ${(budget.allocated - budget.spent).toFixed(2)}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {budget.allocated === 0 ? '0%' : ((budget.spent / budget.allocated) * 100).toFixed(0)}%
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                {budgets.length === 0 && (
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center" color="textSecondary">
                            No budgets set up yet
                        </Typography>
                        {/* You can add a "Create Your First Budget" button here */}
                    </Grid>
                )}
            </Grid>

            <AddBudgetDialog open={isAddBudgetDialogOpen} onClose={handleAddBudgetClose} onAddBudget={handleAddNewBudget} />
        </Container>
    );
}

function AddBudgetDialog({ open, onClose, onAddBudget }) {
    const [category, setCategory] = useState('');
    const [budgetAmount, setBudgetAmount] = useState(0);
    const [period, setPeriod] = useState('monthly');
    const [startDate, setStartDate] = useState(new Date().toLocaleDateString('en-CA')); // YYYY-MM-DD for input type="date"

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

    const handleAddBudget = () => {
        // Call the onAddBudget function passed from the parent component
        onAddBudget({ category, budgetAmount, period, startDate });
        onClose(); // Close the dialog after adding
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Add Budget
                <IconButton aria-label="close" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="category-label">Category</InputLabel>
                            <Select
                                labelId="category-label"
                                id="category"
                                value={category}
                                onChange={handleCategoryChange}
                            >
                                <MenuItem value="">
                                    <em>Select category</em>
                                </MenuItem>
                                <MenuItem value="groceries">Groceries</MenuItem>
                                <MenuItem value="utilities">Utilities</MenuItem>
                                <MenuItem value="rent">Rent</MenuItem>
                                {/* Add more categories here */}
                            </Select>
                        </FormControl>
                        <Box mt={1}>
                            <Button size="small">+ Add custom category</Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Budget Amount"
                            type="number"
                            value={budgetAmount}
                            onChange={handleBudgetAmountChange}
                            inputProps={{ min: 0, step: 0.01 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="period-label">Period</InputLabel>
                            <Select
                                labelId="period-label"
                                id="period"
                                value={period}
                                onChange={handlePeriodChange}
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
                        Add Budget
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default BudgetsPage;