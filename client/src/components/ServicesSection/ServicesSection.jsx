import React from 'react';
import { Link } from 'react-router-dom';
import './ServicesSection.css'; 
import Button from '../Button/Button'; 

function ServicesSection({ services }) {
  return (
    <div className="services-container">
      {services.map((service, index) => (
        <div key={index} className="service-item">
          <div className="service-left">
            <img src={service.imageUrl} alt={service.name} />     
            <Button variant="contained" color="primary">
              <Link to={service.link} style={{ color: 'inherit', textDecoration: 'none' }}>Learn More</Link>
            </Button>
          </div>
          <div className="service-right">
            <h2>{service.name}</h2>
            <p>{service.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ServicesSection;
