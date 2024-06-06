import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation();
  return (
    <AppBar >
      <Toolbar className='NavBar'>
        <Typography variant="h6" component={Link} to="/" sx={{ 
            flexGrow: 1, 
            fontSize: '2.5rem', 
            fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
            color: 'inherit', 
            textDecoration: 'none',
            cursor: 'pointer'
          }}>
          Bloom
        </Typography>
        <Button color="inherit">
          <Link to="/services" style={{ color: 'inherit', textDecoration: 'none', fontSize: '1.1rem' }}>Services</Link>
        </Button>
        <Button color="inherit">
          <Link to="/resources" style={{ color: 'inherit', textDecoration: 'none', fontSize: '1.1rem' }}>Resources</Link>
        </Button>
        <Button color="inherit">
          <Link to="/account" style={{ color: 'inherit', textDecoration: 'none', fontSize: '1.1rem' }}>Account</Link>
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
