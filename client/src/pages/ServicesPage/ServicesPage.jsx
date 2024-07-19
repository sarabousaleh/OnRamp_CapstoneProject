import React from 'react';
import './ServicesPage.css';
import ServicesSection from '../../components/ServicesSection/ServicesSection';

function ServicesPage() {
  const services = [
    {
      name: 'Self-Assessment Tools',
      desc: 'Interactive quizzes and assessments to help users identify their mental health status, including stress levels, anxiety, depression, and other mental health conditions. These tools provide users with a starting point for understanding their own mental health needs. At the end, users receive recommendations for therapists if needed.',
      link: '/assessments',
      imageUrl:
        'https://i.pinimg.com/564x/ed/91/8b/ed918b001f68e44e39fef7c655425993.jpg'
    },
    {
      name: 'Therapy Sessions',
      desc: 'Choose from online or local therapists. Our secure video conferencing feature allows users to attend therapy sessions online. This includes individual, group, or family therapy options. Users can chat with their therapists.',
      link: '/therapy-sessions',
      imageUrl:
        'https://i.pinimg.com/564x/91/be/de/91bede62b8fa28f9b6d92916765cd191.jpg'
    }
  ];

  return (
    <>
      <h1 className="h1-design">Services</h1>
      <ServicesSection services={services} />
    </>
  );
}

export default ServicesPage;
