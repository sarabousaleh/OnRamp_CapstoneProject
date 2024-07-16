import React from 'react';
import WelcomeSection from '../../components/WelcomeSection/WelcomeSection';
import MissionSection from '../../components/MissionSection/MissionSection';
import StorySection from '../../components/StorySection/StorySection';
import TeamSection from '../../components/TeamSection/TeamSection';

function HomePage({ count, setCount, YOURNAME, CURRENTYEAR, customestyle }) {
  const contacts = [
    { name: 'Self-Assessment Tools', desc: 'Discover your mental health status with interactive quizzes covering stress, anxiety, depression, and more. Get personalized recommendations, including therapist matches based on your results.', link: '/assessments' },
    { name: 'Therapy Sessions', desc: 'Access secure online therapy sessions with options for individual, group, or family therapy. Chat with your therapist and choose from a range of experienced professionals.', link: '/therapy-sessions' },
    { name: 'Blogs', desc: 'Explore engaging blogs where you can like, comment, and share insights on mental health topics, personal experiences, and professional advice.', link: '/blogs' },
    { name: 'Journal', desc: 'Reflect and track your thoughts, feelings, and experiences with a personal journaling feature. Write daily entries to promote self-awareness and emotional expression.', link: '/MyJournal' },
    { name: 'Workshops & Events', desc: 'Join live workshops and events focused on stress management, resilience building, and emotional intelligence. Participate in interactive sessions to enhance your mental well-being.', link: '/workshops&events' },
    { name: 'Educational Resource Library', desc: 'Access a large library of articles, videos, and podcasts covering diverse mental health topics. Stay informed with updates on research, tips for well-being, understand mental health disorders.', link: '/library' }
  ];

  const team = [
    { name: 'John Doe', role: 'Developer', bio: 'Lorem ipsum dolor sit amet.', imageUrl: 'https://i.pinimg.com/564x/8b/08/ed/8b08ed0cb7a60f9372a160fcbacb47b1.jpg' },
    { name: 'Jane Smith', role: 'Designer', bio: 'Consectetur adipiscing elit.', imageUrl: 'https://i.pinimg.com/564x/cf/07/71/cf077191fe133661b8cb73e0292e50fe.jpg' },
    { name: 'Angela', role: 'Therapist', bio: 'Consectetur adipiscing elit.', imageUrl: 'https://i.pinimg.com/564x/68/b5/77/68b577ba7cb013903567b3537fd73747.jpg' },
   
  ];
  
  return (
    <>
      <WelcomeSection 
        imageUrl="https://i.pinimg.com/564x/c2/29/c0/c229c079b01a00382a53a6a1a2775340.jpg"
        title="Nurturing your path to mental health & well-being"
        description="Start improving your mental health and well-being today. Bloom shows you how"
        buttonLink="/services"
      />
      
      <MissionSection 
        title="Our Mission"
        description="Discover the pathway to enhanced mental well-being through our empowering resources and personalized support. With tailored guidance and practical tools at your disposal, embark on a journey of self-discovery and growth. Let us empower you to thrive, nurturing a resilient mindset and fostering a profound sense of inner peace and fulfillment."
        contacts={contacts}
      /> 

      <StorySection
        title="Our Story"
        description="Our journey wasn't without challenges. We've faced our own battles with mental health and witnessed the struggles of those close to us. These personal experiences ignited a fire within us to make a difference. We've overcome hurdles, learned from setbacks, and emerged stronger, driven by the belief that everyone deserves access to quality mental health support. Our goal is to make that happen by sharing what we've learned and making mental health care accessible to all. Together, we can create a world where mental well-being is a priority for everyone."
        imageUrl="https://i.pinimg.com/564x/f7/a4/9b/f7a49badb3788a0ed3e35fda6ff637c3.jpg"
      />

      <TeamSection team={team} /> 
      
    </>
  );
}

export default HomePage;
