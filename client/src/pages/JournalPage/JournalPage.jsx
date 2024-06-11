import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './JournalPage.css';  // Import your CSS file

const JournalPage = ({ username }) => {
    const [entries, setEntries] = useState([]);
    const [newEntry, setNewEntry] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Username:', username); // Debugging
        const fetchEntries = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/journal_entries?username=${username}`);
                setEntries(response.data);
            } catch (error) {
                console.error('Error fetching journal entries:', error);
            }
        };
    
        fetchEntries();
    }, [username]);

    const handleSaveEntry = async () => {
        try {
            console.log('Username in handleSaveEntry:', username); // Debugging
            const response = await axios.post('http://localhost:5000/journal_entries', {
                username: username,
                date: new Date().toISOString().split('T')[0], 
                content: newEntry
            });
            console.log('Response from server:', response.data); // Debugging
            setEntries([...entries, response.data]); 
            setNewEntry(''); 
        } catch (error) {
            console.error('Error saving journal entry:', error);
        }
    };
    return (
        <>
        <div className="arrow-header">
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '36px', color:'#bb5a5a', marginRight: '10px' }} />
            </button>
            <h1 className="h1-design">My Journal</h1>
        </div>
        <p className="p-journal">Journaling can help you make sense of how you're feeling about a certain person or situation that is troubling
             or inspiring you. It can also help you understand your triggers. The process of writing down your thoughts as honestly
              and with as little judgment as possible allows for self-discovery.</p>
        <div className="journal-container">
            
            <div className="journal-content">
                <textarea
                    value={newEntry}
                    onChange={(e) => setNewEntry(e.target.value)}
                    placeholder="Write your journal entry here..."
                    className="journal-textarea"
                ></textarea>
                <button onClick={handleSaveEntry} className="save-button">Save Entry</button>
                <div className="entry-list">
                    {entries.map(entry => (
                        <div key={entry.id} className="entry-item">
                            <p className="entry-date">{new Date(entry.date).toLocaleDateString()}</p>
                            <p className="entry-content">{entry.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    );
};

export default JournalPage;