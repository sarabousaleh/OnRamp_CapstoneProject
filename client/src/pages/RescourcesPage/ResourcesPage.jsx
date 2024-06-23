import React from 'react';
import '../ServicesPage/ServicesPage.css';
import ServicesSection from '../../components/ServicesSection/ServicesSection';

function ResourcesPage() {
    const services = [
        {
          name: 'Blogs',
          desc: 'Explore engaging blogs where you can like, comment, and share insights on mental health topics, personal experiences, and professional advice.',
          link: '/blogs',
          imageUrl:'https://i.pinimg.com/564x/9b/5f/83/9b5f838e98496a86fcb21dff27c19403.jpg'
        },
        {
          name: 'Workshops & Events',
          desc: 'Join live workshops and events focused on stress management, resilience building, and emotional intelligence. Participate in interactive sessions to enhance your mental well-being.',
          link: '/workshops&events',
          imageUrl:'https://i.pinimg.com/564x/68/0e/7e/680e7efdfa136047e7f29fde5b54ecd0.jpg'
        },
        {
          name: 'Educational Resource Library',
          desc: 'Access a comprehensive library of articles, videos, podcasts, and webinars covering diverse mental health topics. Stay informed with updates on research, tips for well-being, and understanding mental health disorders.',
          link: '/library',
          imageUrl:'https://i.pinimg.com/564x/54/a2/8b/54a28b406194781770ce72c423516fc7.jpg'
        }
      ];
    
      return (
        <>
        <h1 className='h1-design'>Resources</h1>
        <ServicesSection services={services} />
        </>
        
      );
    }    

export default ResourcesPage;
