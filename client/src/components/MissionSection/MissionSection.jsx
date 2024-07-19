import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './MissionSection.css';
import '../../App.css';

function MissionSection({ title, description, contacts }) {
  return (
    <div className="mission-container">
      <h1 className="h1-design">{title}</h1>
      <p>{description}</p>
      <div className="contact-container">
        {contacts.map((contact, index) => (
          <Link key={index} to={contact.link} className="contact-link">
            <div className="contact">
              <h2>{contact.name}</h2>
              <p>{contact.desc}</p>
            </div>
          </Link>
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
      link: PropTypes.string.isRequired // Add link as a required prop
    })
  ).isRequired
};

export default MissionSection;
