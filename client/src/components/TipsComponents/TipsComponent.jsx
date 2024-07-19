import React from 'react';

const TipsComponent = ({ title, tips, photoUrl }) => {
  return (
    <div className="dual-container">
      <div className="text-container">
        <h2 className="h2-detail">{title}</h2>
        <ul>
          {tips.map((tip, index) => (
            <li key={index}>
              <p>{tip}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="photo-container">
        <img src={photoUrl} alt="" />
      </div>
    </div>
  );
};

export default TipsComponent;
