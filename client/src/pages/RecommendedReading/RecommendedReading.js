// src/components/RecommendedReading/RecommendedReading.js

import React from 'react';
import PropTypes from 'prop-types';
import './RecommendedReading.css';

const RecommendedReading = ({ title, author, imageUrl }) => {
    return (
        <div className="recommended-reading">
            <img src={imageUrl} alt={`${title} cover`} className="book-image"/>
            <div className="book-info">
                <h3>{title}</h3>
                <p>by {author}</p>
            </div>
        </div>
    );
};

RecommendedReading.propTypes = {
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
};

export default RecommendedReading;
