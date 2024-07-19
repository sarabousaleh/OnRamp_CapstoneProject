import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import './WelcomeSection.css';

function WelcomeSection({ imageUrl, title, description, buttonLink }) {
  return (
    <div className="welcome-container">
      <div className="container">
        <div className="box1">
          <img src={imageUrl} alt="Image1" />
        </div>
        <div className="box2">
          <h1>{title}</h1>
          <p>{description}</p>
          <Button variant="contained" color="primary">
            <Link
              to={buttonLink}
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              Learn More
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

WelcomeSection.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonLink: PropTypes.string.isRequired
};

export default WelcomeSection;
