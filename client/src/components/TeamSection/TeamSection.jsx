import React from 'react';
import PropTypes from 'prop-types';
import Contact from '../Contact/Contact';
import './TeamSection.css'; 

class TeamSection extends React.Component {
  render() {
    const { team } = this.props;

    return (
      <div className='team-container'>
        <h1 className='h1-design'>Our Team</h1>
        <div className="container">
          {team.map((member, index) => (
            <div key={index} className="team-member">
              <img src={member.imageUrl} alt={member.name} />
              <Contact name={member.name} desc={`${member.role}: ${member.bio}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

TeamSection.propTypes = {
  team: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      bio: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TeamSection;
