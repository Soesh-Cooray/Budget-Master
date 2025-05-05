import React, { useState } from 'react';
import { Box, Card, TextField, Button, Typography, Link } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function SignInPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async () => {
      try {
          const response = await axios.post('http://127.0.0.1:8000/auth/jwt/create/', { // Updated endpoint
              username,
              password,
          });

          localStorage.setItem('accessToken', response.data.access); // Store access token
          localStorage.setItem('refreshToken', response.data.refresh); // Store refresh token (if present)
          navigate('/transaction');
        } catch (error) {
          if (error.response && error.response.data) {
              if (error.response.data.detail === "No active account found with the given credentials") {
                  setErrorMessage("Incorrect email or password. Please try again.");
              } else {
                  // For other errors, you can display the raw error or a generic message
                  setErrorMessage(JSON.stringify(error.response.data));
              }
          } else {
              setErrorMessage('Login failed. Please check your connection.');
          }
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
        backgroundColor: '#f0f7ff', // Optional: background color
      }}
    >
      {/* Logo and Title */}
      <Box textAlign="center" mb={4}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <AttachMoneyIcon sx={{ color: 'blue', fontSize: 30, marginRight: 1 }} />
          <Typography variant="h5" fontWeight="bold">
            BudgetMaster
          </Typography>
        </Box>
        <Typography variant="body1">Your Personal Finance Tracker</Typography>
      </Box>

      {/* Sign-in Form */}
     
      <Card sx={{ padding: 4, width: '350px',borderRadius: 4 }} elevation={5}>
      {errorMessage && (
          <Typography variant="body2" color="error" gutterBottom textAlign="center">
            {errorMessage}
          </Typography>
         )}
        <Typography variant="h6" gutterBottom textAlign="center">
          Welcome Back!
        </Typography>
        <Typography variant="body2" gutterBottom textAlign="center">
          Enter your signin details to access your account
        </Typography>
        <TextField label="Enter Your Email" fullWidth margin="normal" value={username} onChange={(e) => setUsername(e.target.value)}/>
        <TextField label="Enter Your Password" type="password" fullWidth margin="normal"  value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button component={Link} to="/dashboard" variant="contained" fullWidth sx={{ marginTop: 2 ,borderRadius: 4}}onClick={handleSignIn}>
          Sign In
        </Button>
        <Typography variant="body2" align="center" mt={2}>
          <Link href="/forgotpassword">Forgot Password?</Link>
        </Typography>
        <Typography variant="body2" align="center" mt={2}>
          Don't have an account? <Link href="/signup">Sign up</Link>
        </Typography>
      </Card>

      {/* Back to Home Link */}
      <Typography variant="body2" mt={4}>
        <Link href="/">Back to Home</Link>
      </Typography>
    </Box>
  );
}

export default SignInPage;
