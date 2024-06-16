import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import ArrowHeader from '../../components/ArrowHeader/ArrowHeader';
import './BlogsPage.css'; // Import CSS file for styling

const BlogsPage = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await fetch('http://localhost:5000/blogs', {
                method: 'GET',
                credentials: 'include', // Send cookies
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch blogs');
            }
            const data = await response.json();
            setBlogs(data);
        } catch (error) {
            console.error('Error fetching blogs:', error.message);
            // Handle error (e.g., show error message)
        }
    };

    const handleLike = async (blogId) => {
        try {
            const response = await fetch(`http://localhost:5000/blogs/like/${blogId}`, {
                method: 'POST',
                credentials: 'include', // Send cookies
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to like blog');
            }
            // Refresh blogs after successful like
            fetchBlogs();
        } catch (error) {
            console.error('Error liking blog:', error.message);
            // Handle error (e.g., show error message)
        }
    };

    const handleComment = async (blogId) => {
        try {
            const comment = prompt('Enter your comment:');
            if (!comment) return;

            const response = await fetch(`http://localhost:5000/blogs/comment/${blogId}`, {
                method: 'POST',
                credentials: 'include', // Send cookies
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ comment })
            });
            if (!response.ok) {
                throw new Error('Failed to add comment');
            }
            // Refresh blogs after successful comment
            fetchBlogs();
        } catch (error) {
            console.error('Error commenting on blog:', error.message);
            // Handle error (e.g., show error message)
        }
    };

    const handleShare = async (blogId) => {
        try {
            const response = await fetch(`http://localhost:5000/blogs/share/${blogId}`, {
                method: 'POST',
                credentials: 'include', // Send cookies
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to share blog');
            }
            // Refresh blogs after successful share
            fetchBlogs();
        } catch (error) {
            console.error('Error sharing blog:', error.message);
            // Handle error (e.g., show error message)
        }
    };

    return (
        <div className="blogs-container">
            <ArrowHeader title="Blogs" />
            {blogs.map(blog => (
                <div key={blog.id} className="blog">
                    <h2>{blog.title}</h2>
                    <p>{blog.content}</p>
                    <div className="actions">
                        <button onClick={() => handleLike(blog.id)}>Like ({blog.likes})</button>
                        <button onClick={() => handleComment(blog.id)}>Comment ({blog.comments.length})</button>
                        <button onClick={() => handleShare(blog.id)}>Share</button>
                    </div>
                    <div className="comments">
                        <h3>Comments:</h3>
                        <ul>
                            {blog.comments.map(comment => (
                                <li key={comment.id}>
                                    <strong>{comment.author}</strong>: {comment.comment}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BlogsPage;
