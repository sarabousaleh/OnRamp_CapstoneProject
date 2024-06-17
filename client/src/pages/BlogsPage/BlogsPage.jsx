import React, { useState, useEffect } from 'react';
import ArrowHeader from '../../components/ArrowHeader/ArrowHeader';
import './BlogsPage.css';

const BlogsPage = () => {
    const [forums, setForums] = useState([]);
    const [selectedForum, setSelectedForum] = useState(null);
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState({});
    const [likedPosts, setLikedPosts] = useState(new Set());

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
            checkIfLiked(selectedPost.post_id);
        }
    }, [selectedPost]);

    const fetchForums = async () => {
        try {
            const response = await fetch('http://localhost:5000/forums', {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                throw new Error(`Error fetching forums: ${response.statusText}`);
            }
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
            if (!response.ok) {
                throw new Error(`Error fetching posts: ${response.statusText}`);
            }
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error.message);
        }
    };

    const fetchComments = async (postId) => {
        try {
            const response = await fetch(`http://localhost:5000/posts/${postId}/comments`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Error fetching comments: ${error.error}`);
            }
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
            if (!response.ok) {
                throw new Error(`Error fetching likes: ${response.statusText}`);
            }
            const data = await response.json();
            setLikes(prevLikes => ({ ...prevLikes, [postId]: data.length }));
        } catch (error) {
            console.error('Error fetching likes:', error.message);
        }
    };

    const checkIfLiked = async (postId) => {
        try {
            const response = await fetch(`http://localhost:5000/posts/${postId}/liked`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                throw new Error(`Error checking if liked: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.liked) {
                setLikedPosts(prev => new Set(prev.add(postId)));
            }
        } catch (error) {
            console.error('Error checking if liked:', error.message);
        }
    };

    const handleLike = async (postId, userId) => {
        try {
            const response = await fetch(`http://localhost:5000/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Error liking post: ${error.error}`);
            }
            const data = await response.json();
            setLikes(prevLikes => ({ ...prevLikes, [postId]: (prevLikes[postId] || 0) + 1 }));
            setLikedPosts(prev => new Set(prev.add(postId)));
            console.log('Post liked:', data);
        } catch (error) {
            console.error('Error liking post:', error.message);
        }
    };

    const handleComment = async (postId, userId, content) => {
        try {
            const response = await fetch(`http://localhost:5000/posts/${postId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, content }),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Error commenting on post: ${error.error}`);
            }
            const data = await response.json();
            setComments(prevComments => [data, ...prevComments]);
            console.log('Comment posted:', data);
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
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLike(post.post_id, 1); // Replace 1 with the actual userId
                                    }} 
                                    disabled={likedPosts.has(post.post_id)}
                                >
                                    {likedPosts.has(post.post_id) ? `Liked (${likes[post.post_id] || 0})` : `Like (${likes[post.post_id] || 0})`}
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleComment(post.post_id, 1, 'Great post!'); // Replace 1 and 'Great post!' with actual userId and comment
                                    }}
                                >
                                    Comment ({comments.length})
                                </button>
                            </div>
                        </div>
                    ))}
                    {selectedPost && (
                        <div className="comments-container">
                            <ArrowHeader title={`Comments on ${selectedPost.title}`} />
                            <ul>
                                {comments.map(comment => (
                                    <li key={comment.comment_id}>
                                        <strong>{comment.username}</strong>: {comment.content}
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
