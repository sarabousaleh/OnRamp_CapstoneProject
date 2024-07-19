import React, { useState } from 'react';
import './CollapsibleContainer.css';

const CollapsibleContainer = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`collapsible-container ${isExpanded ? 'expanded' : 'collapsed'}`}
    >
      <div className="header">
        <h2 className="h2-design">{title}</h2>
        <button onClick={toggleExpand}>
          {isExpanded ? (
            <i className="fas fa-chevron-up"></i>
          ) : (
            <i className="fas fa-chevron-down"></i>
          )}
        </button>
      </div>
      <div
        className={`content ${isExpanded ? 'expanded-content' : 'collapsed-content'}`}
      >
        {children}
      </div>
    </div>
  );
};

export default CollapsibleContainer;
