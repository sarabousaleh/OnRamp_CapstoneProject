import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import Note from '../../components/Note/Note';
import CreateArea from '../../components/CreateArea/CreateArea';
import ArrowHeader from '../../components/ArrowHeader/ArrowHeader';
import './ToDoPage.css';

function ToDoPage() {
  const [notes, setNotes] = useState([]);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`${backendUrl}/notes`, {
          withCredentials: true
        });
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
    fetchNotes();
  }, []);

  const addNote = (newNote) => {
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${backendUrl}/notes/${id}`, {
        withCredentials: true
      });
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="journal-page-container">
      <ArrowHeader title="Your To Do List" />
      <CreateArea onAdd={addNote} />
      {notes.map((note) => (
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
