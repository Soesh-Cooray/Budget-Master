import React, { useState } from 'react';
import { Box, Card, TextField, Button, Typography, Link } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleResetRequest = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/auth/users/reset_password/', { email });
            setMessage("Password reset email sent. Please check your inbox.");
        } catch (error) {
            setMessage("Error: Could not send reset email. Please try again.");
            console.error("Password reset request error:", error);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#f0f7ff',
            }}
        >
            {/* Logo and Title */}
            <Box textAlign="center" mb={4}>
                <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                    <AttachMoneyIcon sx={{ color: 'blue', fontSize: 30, marginRight: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                        BudgetMaster
                    </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 30 }}>Reset your password</Typography>
            </Box>

            {/* Forgot Password Form */}
            <Card sx={{ padding: 4, width: '350px', borderRadius: 4 }} elevation={5}>
                {message && (
                    <Typography variant="body2" color={message.startsWith("Error") ? "error" : "success"} gutterBottom textAlign="center">
                        {message}
                    </Typography>
                )}
                <Typography variant="h6" gutterBottom textAlign="center">
                    Forgot Password
                </Typography>
                <Typography variant="body2" gutterBottom textAlign="center">
                    Enter your email to receive a password reset link
                </Typography>
                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                    variant="contained"
                    fullWidth
                    sx={{ marginTop: 2, borderRadius: 4 }}
                    onClick={handleResetRequest}
                >
                    Send Reset Link
                </Button>
                <Typography variant="body2" align="center" mt={2}>
                    Remember your password? <Link href="/signin">Sign in</Link>
                </Typography>
            </Card>
        </Box>
    );
}

export default ForgotPasswordPage;