import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

function Button({ onClick, children }) {
  return (
    <div className="button-container">
      <button className="custom-button" onClick={onClick}>
        {children}
      </button>
    </div>
  );
}

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  onClick: null,
};

export default Button;
