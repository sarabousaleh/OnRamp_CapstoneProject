import React, { useState } from "react";
import axios from 'axios';
import './CreateArea.css';

function CreateArea(props) {
  const [note, setNote] = useState({
    title: "",
    content: ""
  });
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  function handleChange(event) {
    const { name, value } = event.target;
    setNote(prevNote => ({
      ...prevNote,
      [name]: value
    }));
  }

  async function submitNote(event) {
    event.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/notes`, note, { withCredentials: true });
      props.onAdd(response.data); 
      setNote({
        title: "",
        content: ""
      });
    } catch (error) {
      console.error('Error adding note:', error);
    }
  }

  return (
    <div>
      <form className="note-form">
        <input
          name="title"
          onChange={handleChange}
          value={note.title}
          placeholder="Title"
        />
        <textarea
          name="content"
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows="3"
        />
        <button onClick={submitNote}>Add</button>
      </form>
    </div>
  );
}

export default CreateArea;
