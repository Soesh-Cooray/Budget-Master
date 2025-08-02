# Email Customization for BudgetMaster

This document describes the custom email templates and configuration for the BudgetMaster application.

## Overview

The application uses custom email templates for password reset and password change confirmation emails. These templates provide a professional, branded experience that matches the BudgetMaster application design.

## Email Templates

### 1. Password Reset Email

**Files:**
- `personal_budget_manager/templates/registration/password_reset_email.html` (HTML version)
- `personal_budget_manager/templates/registration/password_reset_email.txt` (Plain text version)

**Features:**
- Modern, responsive design with BudgetMaster branding
- Gradient header with logo
- Clear call-to-action button
- Security warnings and instructions
- Fallback text link for email clients that don't support HTML
- Professional footer with contact information

### 2. Password Change Confirmation Email

**Files:**
- `personal_budget_manager/templates/registration/password_changed_email.html` (HTML version)
- `personal_budget_manager/templates/registration/password_changed_email.txt` (Plain text version)

**Features:**
- Success-themed design with green gradient
- Confirmation message with checkmark
- Direct link to sign in
- Security notice for unauthorized changes

## Custom Email Classes

### Location: `accounts/emails.py`

**Classes:**
1. `CustomPasswordResetEmail` - Handles password reset emails
2. `CustomPasswordChangedEmail` - Handles password change confirmation emails

**Features:**
- Extends Djoser's email functionality
- Supports both HTML and plain text versions
- Automatic subject line generation
- Proper email headers and formatting

## Configuration

### Django Settings (`personal_budget_manager/settings.py`)

The DJOSER configuration has been updated to use custom email classes:

```python
DJOSER = {
    'EMAIL': {
        'password_reset': 'accounts.emails.CustomPasswordResetEmail',
        'password_changed_confirmation': 'accounts.emails.CustomPasswordChangedEmail',
    },
    # ... other settings
}
```

### Email Backend Configuration

The application uses Gmail SMTP for sending emails:

```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'budgetmaster2025@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
```

## Template Features

### Design Elements
- **Responsive Design**: Works on desktop and mobile email clients
- **Brand Colors**: Uses BudgetMaster's blue and purple gradient theme
- **Typography**: Clean, readable fonts (Segoe UI, Tahoma, Geneva, Verdana, sans-serif)
- **Visual Hierarchy**: Clear sections with proper spacing and contrast

### Security Features
- **24-hour expiration notice**: Informs users about link expiration
- **Security warnings**: Clear messaging about unauthorized requests
- **Fallback links**: Text versions for email clients that don't support HTML

### User Experience
- **Clear call-to-action**: Prominent buttons for password reset
- **Helpful instructions**: Step-by-step guidance for users
- **Contact information**: Support team contact details
- **Professional tone**: Friendly yet professional messaging

## Customization Options

### Colors and Branding
To change the color scheme, modify the CSS variables in the HTML templates:
- Primary gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Success gradient: `linear-gradient(135deg, #28a745 0%, #20c997 100%)`

### Content
To modify the email content:
1. Edit the HTML templates for visual changes
2. Edit the text templates for plain text versions
3. Update the email classes in `accounts/emails.py` for subject lines

### Styling
The templates use inline CSS for maximum email client compatibility. Key styling features:
- Mobile-responsive design
- Gradient backgrounds
- Box shadows and hover effects
- Proper spacing and typography

## Testing

To test the email templates:

1. Start the Django development server
2. Navigate to the password reset page in your React app
3. Enter an email address and submit
4. Check the email inbox for the custom template

## File Structure

```
personal_budget_manager/
├── templates/
│   └── registration/
│       ├── password_reset_email.html
│       ├── password_reset_email.txt
│       ├── password_changed_email.html
│       └── password_changed_email.txt
└── accounts/
    └── emails.py
```

## Troubleshooting

### Common Issues

1. **Templates not loading**: Ensure the templates directory is properly configured in `settings.py`
2. **Email not sending**: Check Gmail app password and SMTP settings
3. **Styling issues**: Some email clients may not support all CSS features - test in multiple clients

### Debugging

To debug email issues:
1. Check Django logs for email sending errors
2. Verify SMTP settings in `settings.py`
3. Test with a different email backend (e.g., console backend for development)

## Future Enhancements

Potential improvements for the email system:
- Email tracking and analytics
- A/B testing for different email designs
- Dynamic content based on user preferences
- Multi-language support
- Email templates for other notifications (welcome, account updates, etc.) 