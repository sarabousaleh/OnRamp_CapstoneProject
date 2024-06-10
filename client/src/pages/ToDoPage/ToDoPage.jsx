import React, { useState, useEffect } from "react";
import axios from 'axios';
import Note from "../../components/Note/Note";
import CreateArea from "../../components/CreateArea/CreateArea";
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './ToDoPage.css'; // Ensure you have appropriate styling

function ToDoPage() {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/notes', { withCredentials: true });
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
    fetchNotes();
  }, []);

  function addNote(newNote) {
    setNotes(prevNotes => [...prevNotes, newNote]);
  }

  async function deleteNote(id) {
    try {
      await axios.delete(`http://localhost:5000/notes/${id}`, { withCredentials: true });
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }

  const goBack = () => {
    navigate(-1); // Define the goBack function
  };

  return (
    <div className="journal-page-container">
      <div className="arrow-header">
        <button onClick={goBack} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '36px', color:'#bb5a5a', marginRight: '10px' }} />
        </button>
        <h1 className="h1-design">Your To Do List</h1>
      </div>
      <CreateArea onAdd={addNote} />
      {notes.map(note => (
        <Note
          key={note.id}
          id={note.id}
          title={note.title}
          content={note.content}
          onDelete={deleteNote}
        />
      ))}
    </div>
  );
}

export default ToDoPage;
