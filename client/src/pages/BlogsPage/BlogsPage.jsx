import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ArrowHeader from '../../components/ArrowHeader/ArrowHeader';
import './BlogsPage.css';

const BlogsPage = () => {
    const navigate = useNavigate();
    const [forums, setForums] = useState([]);
    const [selectedForum, setSelectedForum] = useState(null);
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);

    useEffect(() => {
        fetchForums();
    }, []);

    useEffect(() => {
        if (selectedForum) {
            fetchPosts(selectedForum.forum_id);
        }
    }, [selectedForum]);

    useEffect(() => {
        if (selectedPost) {
            fetchComments(selectedPost.post_id);
            fetchLikes(selectedPost.post_id);
        }
    }, [selectedPost]);

    const fetchForums = async () => {
        try {
            const response = await fetch('http://localhost:5000/forums', {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            setForums(data);
        } catch (error) {
            console.error('Error fetching forums:', error.message);
        }
    };

    const fetchPosts = async (forumId) => {
        try {
            const response = await fetch(`http://localhost:5000/forums/${forumId}/posts`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error.message);
        }
    };

    const fetchComments = async (postId) => {
        try {
            const response = await fetch(`http://localhost:5000/posts/${postId}/comments`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments:', error.message);
        }
    };

    const fetchLikes = async (postId) => {
        try {
            const response = await fetch(`http://localhost:5000/posts/${postId}/likes`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            setLikes(data);
        } catch (error) {
            console.error('Error fetching likes:', error.message);
        }
    };

    const handleLike = async (postId) => {
        try {
            await fetch(`http://localhost:5000/posts/${postId}/like`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            fetchLikes(postId);
        } catch (error) {
            console.error('Error liking post:', error.message);
        }
    };

    const handleComment = async (postId) => {
        try {
            const content = prompt('Enter your comment:');
            if (!content) return;

            await fetch(`http://localhost:5000/posts/${postId}/comment`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });
            fetchComments(postId);
        } catch (error) {
            console.error('Error commenting on post:', error.message);
        }
    };

    return (
        <div className="blogs-container">
            <ArrowHeader title="Forums" />
            <div className="forum-list">
                {forums.map(forum => (
                    <div key={forum.forum_id} className="forum" onClick={() => setSelectedForum(forum)}>
                        <h2>{forum.name}</h2>
                        <p>{forum.description}</p>
                    </div>
                ))}
            </div>
            {selectedForum && (
                <div className="posts-container">
                    <ArrowHeader title={`Posts in ${selectedForum.name}`} />
                    {posts.map(post => (
                        <div key={post.post_id} className="post" onClick={() => setSelectedPost(post)}>
                            <h2>{post.title}</h2>
                            <p>{post.content}</p>
                            <div className="actions">
                                <button onClick={() => handleLike(post.post_id)}>Like ({likes.length})</button>
                                <button onClick={() => handleComment(post.post_id)}>Comment ({comments.length})</button>
                            </div>
                        </div>
                    ))}
                    {selectedPost && (
                        <div className="comments-container">
                            <ArrowHeader title={`Comments on ${selectedPost.title}`} />
                            <ul>
                                {comments.map(comment => (
                                    <li key={comment.comment_id}>
                                        <strong>{comment.user_id}</strong>: {comment.content}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BlogsPage;