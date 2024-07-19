import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './ArrowHeader.css';

const ArrowHeader = ({ title }) => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="arrow-header">
      <i onClick={goBack} className="back-button">
        <FontAwesomeIcon icon={faArrowLeft} className="arrow-icon" />
      </i>
      <h1 className="h1-design">{title}</h1>
    </div>
  );
};

export default ArrowHeader;
