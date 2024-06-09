import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserWorkshops = () => {
    const [userWorkshops, setUserWorkshops] = useState([]);

    useEffect(() => {
        const fetchUserWorkshops = async () => {
            try {
                const response = await axios.get('http://localhost:5000/user-workshops', { withCredentials: true });
                setUserWorkshops(response.data);
            } catch (error) {
                console.error('Error fetching user workshops:', error);
            }
        };

        fetchUserWorkshops();
    }, []);

    const handleWithdraw = async (workshopId) => {
        try {
            await axios.delete(`http://localhost:5000/withdraw-workshop/${workshopId}`, { withCredentials: true });
            setUserWorkshops(userWorkshops.filter(workshop => workshop.workshop_id !== workshopId));
        } catch (error) {
            console.error('Error withdrawing from workshop:', error);
        }
    };

    return (
        <div className="user-workshops">
            <h2>My Workshops</h2>
            {userWorkshops.map((workshop, index) => (
                <div key={index} className="workshop">
                    <h3>{workshop.title}</h3>
                    <p>{workshop.description}</p>
                    <p><strong>Enrolled At:</strong> {workshop.enrolled_at}</p>
                    <button onClick={() => handleWithdraw(workshop.workshop_id)}>Withdraw</button>
                </div>
            ))}
        </div>
    );
};

export default UserWorkshops;
