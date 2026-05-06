# Fleet Management System - Login Documentation

## Login Credentials

**User ID:** `CRMAI@23`  
**Password:** `AI0023`

## System Access Flow

1. **Welcome Page** (`welcome.html`) - Entry point with system overview
2. **Login Page** (`login.html`) - Authentication interface
3. **Main System** (`index.html`) - Fleet Management Dashboard
4. **Dispatch App** (`dispatch-app.html`) - Dispatch Management System

## Features

### Authentication System
- Secure login with predefined credentials
- Session management with 8-hour auto-logout
- Remember me functionality
- Automatic redirect for authenticated users

### Security Features
- Session timeout after 8 hours of inactivity
- Automatic logout on session expiry
- Protected routes - redirects to login if not authenticated
- Secure session storage using localStorage

### User Interface
- Modern teal/turquoise color scheme
- Responsive design for mobile and desktop
- Professional branding and animations
- Loading states and user feedback

## File Structure

```
├── welcome.html          # Entry point / landing page
├── login.html           # Authentication page
├── index.html           # Main fleet management system
├── dispatch-app.html    # Dispatch management system
├── styles.css           # Main system styles
├── dispatch-styles.css  # Dispatch system styles
├── script.js           # Main system JavaScript
└── dispatch-script.js  # Dispatch system JavaScript
```

## Usage Instructions

### For Users
1. Open `welcome.html` in your browser
2. Click "Enter System" to proceed to login
3. Enter credentials:
   - User ID: `CRMAI@23`
   - Password: `AI0023`
4. Access the fleet management system

### For Developers
- All pages include authentication checks
- Session data is stored in localStorage
- Logout functionality available in both systems
- Color scheme is consistent across all pages

## Session Management

- **Login Duration:** 8 hours
- **Auto-logout:** Yes, after session expiry
- **Remember Me:** Optional checkbox for convenience
- **Cross-system:** Login works for both Fleet and Dispatch systems

## Customization

### Changing Credentials
Edit the `VALID_CREDENTIALS` object in `login.html`:
```javascript
const VALID_CREDENTIALS = {
    userId: 'YOUR_USER_ID',
    password: 'YOUR_PASSWORD'
};
```

### Modifying Session Duration
Change the hour check in authentication functions:
```javascript
if (hoursDiff >= 8) { // Change 8 to desired hours
```

### Color Scheme
Both systems use CSS variables for easy color customization:
```css
:root {
    --primary-color: #3AAFA9;      /* Main teal */
    --secondary-color: #2B7A78;    /* Darker teal */
    --accent-color: #17252A;       /* Dark navy */
    --light-color: #DEF2F1;        /* Light teal */
}
```

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Support

For technical issues or questions, contact the system administrator.