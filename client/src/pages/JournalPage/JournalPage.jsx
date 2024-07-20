import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from '../../axiosConfig';
import ArrowHeader from '../../components/ArrowHeader/ArrowHeader';
import './JournalPage.css';

const JournalPage = () => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get(`${backendUrl}/journal_entries`, {
          withCredentials: true
        });
        setEntries(response.data);
      } catch (error) {
        console.error('Error fetching journal entries:', error);
      }
    };
    fetchEntries();
  }, []);

  const handleSaveEntry = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/journal_entries`,
        {
          content: newEntry
        },
        { withCredentials: true }
      );
      setEntries([...entries, response.data]);
      setNewEntry('');
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  };

  const toggleExpandEntry = (id) => {
    setExpandedEntry(expandedEntry === id ? null : id);
  };

  const handleDeleteEntry = async (id) => {
    try {
      await axios.delete(`${backendUrl}/journal_entries/${id}`, {
        withCredentials: true
      });
      setEntries(entries.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error('Error deleting journal entry:', error);
    }
  };

  const handleEditEntry = (id, content) => {
    setEditingEntry(id);
    setEditedContent(content);
  };

  const handleSaveEditedEntry = async () => {
    try {
      const response = await axios.put(
        `${backendUrl}/journal_entries/${editingEntry}`,
        {
          content: editedContent
        },
        { withCredentials: true }
      );
      setEntries(
        entries.map((entry) =>
          entry.id === editingEntry ? response.data : entry
        )
      );
      setEditingEntry(null);
      setEditedContent('');
    } catch (error) {
      console.error('Error editing journal entry:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <ArrowHeader title="My Journal" />
      <p className="p-journal">
        Journaling can help you make sense of how you're feeling about a certain
        person or situation that is troubling or inspiring you. It can also help
        you understand your triggers. The process of writing down your thoughts
        as honestly and with as little judgment as possible allows for
        self-discovery.
      </p>
      <p className="p-journal">
        Write your journal here every day! Write everything whether it was good
        or bad! Express what you are feeling and why you are feeling that way.
      </p>
      <div className="journal-container">
        <div className="journal-content">
          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="Write your journal entry here..."
            className="journal-textarea"
          ></textarea>
          <button onClick={handleSaveEntry} className="save-button">
            Save Entry
          </button>
        </div>
      </div>
      <div className="entry-list-container">
        <div className="entry-list">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`entry-item ${expandedEntry === entry.id ? 'expanded' : ''}`}
              onClick={() => toggleExpandEntry(entry.id)}
            >
              <div className="entry-header">
                <p className="entry-date">{formatDate(entry.created_at)}</p>
                <div className="entry-actions">
                  <FontAwesomeIcon
                    icon={faEdit}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditEntry(entry.id, entry.content);
                    }}
                    style={{
                      cursor: 'pointer',
                      marginRight: '10px',
                      color: '#a14646'
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEntry(entry.id);
                    }}
                    style={{ cursor: 'pointer', color: '#a14646' }}
                  />
                </div>
              </div>
              {editingEntry === entry.id ? (
                <div className="edit-entry">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="edit-textarea"
                  ></textarea>
                  <button
                    onClick={handleSaveEditedEntry}
                    className="save-button"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p
                  className={`entry-content ${expandedEntry === entry.id ? 'expanded' : ''}`}
                >
                  {entry.content
                    .split('\n')
                    .slice(0, expandedEntry === entry.id ? undefined : 4)
                    .join('\n')}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default JournalPage;
