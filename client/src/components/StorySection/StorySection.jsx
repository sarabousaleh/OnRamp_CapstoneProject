import React from 'react';
import PropTypes from 'prop-types';
import './StorySection.css'; 

class StorySection extends React.Component {
  render() {
    const { title, description, imageUrl } = this.props;

    return (
      <div className='story-container'>
        <div className='box1'>
          <h1 className='h1-design'>{title}</h1>
          <p>{description}</p>
        </div>
        <div className='box2'>
          <img src={imageUrl} alt="Image1" />
        </div>
      </div>
    );
  }
}

StorySection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export default StorySection;
