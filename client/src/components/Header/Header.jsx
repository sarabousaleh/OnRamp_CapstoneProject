import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <AppBar>
      <Toolbar className='NavBar'>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            fontSize: '2.6rem',
            fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
            color: 'inherit',
            textDecoration: 'none',
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            }
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Bloom
        </Typography>
        <div className={`nav-links ${isHovered ? 'show-links' : ''}`}>
          <Button color="inherit">
            <Link to="/services" className="nav-link">Services</Link>
          </Button>
          <Button color="inherit">
            <Link to="/resources" className="nav-link">Resources</Link>
          </Button>
          <Button color="inherit">
            <Link to="/account" className="nav-link">Account</Link>
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;