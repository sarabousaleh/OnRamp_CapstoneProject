import React, { useState, useEffect } from 'react';
import Contact from '../Contact/Contact';
import './TeamSection.css'; 

function TeamSection() {
  const [team, setTeam] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('http://localhost:5000/team-members');
        if (!response.ok) {
          throw new Error('Failed to fetch team members');
        }
        const data = await response.json();
        setTeam(data);
      } catch (error) {
        console.error('Error fetching team members:', error);
        setError('Error fetching team members');
      }
    };

    fetchTeamMembers();
  }, []);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className='team-container'>
      <h1 className='h1-design'>Our Team</h1>
      <div className="container">
        {team.map((member, index) => (
          <div key={index} className="team-member">
            <img src={member.pic} alt={member.name} />
            <Contact name={member.name} desc={member.description} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamSection;
