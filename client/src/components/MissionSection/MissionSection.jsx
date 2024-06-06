import React from 'react';
import PropTypes from 'prop-types';
import './MissionSection.css'; 
import '../../App.css'

function MissionSection({ title, description, contacts }) {
  return (
    <div className='mission-container'>
      <h1 className='h1-design'>{title}</h1>
      <p>{description}</p>
      <div className="container">
        {contacts.map((contact, index) => (
          <div key={index} className="contact">
            <h2>{contact.name}</h2>
            <p>{contact.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

MissionSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      desc: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default MissionSection;
