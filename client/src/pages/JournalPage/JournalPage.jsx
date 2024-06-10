import React from "react";
import { Link, useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const JournalPage = () => {
    const navigate = useNavigate();
  
    const goBack = () => {
      navigate(-1);
    };

    return(
        <div className="arrow-header">
            <button onClick={goBack} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '36px', color:'#bb5a5a', marginRight: '10px' }} />
            </button>
            <h1 className="h1-design">My Journal</h1>
        </div>
    );
}

export default JournalPage;