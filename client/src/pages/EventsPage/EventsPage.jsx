import React from "react";
import { Link, useNavigate } from 'react-router-dom'; 
import ArrowHeader from '../../components/ArrowHeader/ArrowHeader';

const EventsPage= () => {
    const navigate = useNavigate();
  
    const goBack = () => {
      navigate(-1);
    };

    return(
        <div>
            <ArrowHeader title="Workshops & Events" />
        </div>
    );
}

export default EventsPage;
