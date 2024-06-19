import React, { useState, useEffect, useCallback } from 'react';
import ArrowHeader from '../../components/ArrowHeader/ArrowHeader';
import './BlogsPage.css';

const BlogsPage = () => {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [commentsMap, setCommentsMap] = useState({});
    const [likes, setLikes] = useState({});
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [newComment, setNewComment] = useState({});
    const [currentUser, setCurrentUser] = useState(null); // Add currentUser state

    useEffect(() => {
        fetchPosts();
        fetchCurrentUser(); // Fetch the current user
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:5000/posts', {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                throw new Error(`Error fetching posts: ${response.statusText}`);
            }
            const data = await response.json();
            setPosts(data);
            setFilteredPosts(data); // Initially show all posts
        } catch (error) {
            console.error('Error fetching posts:', error.message);
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const response = await fetch('http://localhost:5000/user', {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                throw new Error(`Error fetching current user: ${response.statusText}`);
            }
            const data = await response.json();
            setCurrentUser(data);
        } catch (error) {
            console.error('Error fetching current user:', error.message);
        }
    };

    useEffect(() => {
        if (selectedPost) {
            fetchComments(selectedPost.post_id);
            fetchLikes(selectedPost.post_id);
            checkIfLiked(selectedPost.post_id);
        }
    }, [selectedPost]);

    const fetchComments = async (postId) => {
        try {
            const response = await fetch(`http://localhost:5000/posts/${postId}/comments`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Error fetching comments: ${error.error}`);
            }
            const data = await response.json();
            setCommentsMap(prevCommentsMap => ({
                ...prevCommentsMap,
                [postId]: data
            }));
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

    const handleLike = async (postId) => {
        try {
            const response = await fetch(`http://localhost:5000/posts/${postId}/like`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: likedPosts.has(postId) ? false : true }), // Toggle like status
            });
            if (!response.ok) {
                throw new Error(`Error liking post: ${response.statusText}`);
            }
            // Update likes state locally after successful like
            setLikes(prevLikes => ({
                ...prevLikes,
                [postId]: (prevLikes[postId] || 0) + (likedPosts.has(postId) ? +1 : 1) // Increment or decrement based on toggle
            }));
            // Toggle likedPosts Set for UI update
            if (likedPosts.has(postId)) {
                likedPosts.delete(postId);
            } else {
                likedPosts.add(postId);
            }
            console.log('Post liked successfully');
        } catch (error) {
            console.error('Error liking post:', error.message);
        }
    };
    
    
    const handleComment = async (postId, content) => {
        try {
            const response = await fetch(`http://localhost:5000/posts/${postId}/comment`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
            });
            if (!response.ok) {
                throw new Error(`Error commenting on post: ${response.statusText}`);
            }
            const data = await response.json();
            // Update commentsMap state locally after successful comment
            setCommentsMap(prevCommentsMap => ({
                ...prevCommentsMap,
                [postId]: [data, ...prevCommentsMap[postId]]
            }));
            console.log('Comment posted:', data);
        } catch (error) {
            console.error('Error commenting on post:', error.message);
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        try {
            const response = await fetch(`http://localhost:5000/posts/${postId}/comments/${commentId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Error deleting comment: ${response.statusText}`);
            }
            // Update commentsMap state locally after successful deletion
            setCommentsMap(prevCommentsMap => ({
                ...prevCommentsMap,
                [postId]: prevCommentsMap[postId].filter(comment => comment.comment_id !== commentId)
            }));
            console.log('Comment deleted successfully');
        } catch (error) {
            console.error('Error deleting comment:', error.message);
        }
    };
    

    const handleNewCommentChange = (postId, content) => {
        setNewComment(prev => ({
            ...prev,
            [postId]: content
        }));
    };

    const handleNewCommentSubmit = (postId) => {
        const content = newComment[postId];
        if (content) {
            handleComment(postId, content);
            setNewComment(prev => ({
                ...prev,
                [postId]: ''
            }));
        }
    };

    const handleSearch = useCallback(() => {
        // Filter posts based on search term
        const filtered = posts.filter(post =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPosts(filtered);
    }, [posts, searchTerm]);

    useEffect(() => {
        handleSearch();
    }, [handleSearch]);

    return (
        <div className="blogs-container">
            <ArrowHeader title="Blogs" />
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>
                    <i className="fa fa-search"></i>
                </button>
            </div>
            <p className='p-blogs'>Press on each Blog to expand the comments.</p>
            <div className="posts-container">
                {filteredPosts.map(post => (
                    <div key={post.post_id} className="post" onClick={() => setSelectedPost(post)}>
                        <div className='image-blog'>
                            <img src={post.image_url} alt={post.title} className="post-image" />
                        </div>
                        <div className='content-blog'>
                            <h2>{post.title}</h2>
                            <h3>{post.username}</h3> {/* Add this line */}
                            <p>{post.content}</p>

                        </div>
                        <div className="actions">
                            <button
                                className='like-button'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLike(post.post_id);
                                }}
                                disabled={likedPosts.has(post.post_id)}
                            >
                                {likedPosts.has(post.post_id) ? `Liked (${likes[post.post_id] || 0})` : `Like (${likes[post.post_id] || 0})`}
                            </button>
                            <div className="comment-input-container">
                                <input
                                    type="text"
                                    placeholder="Write a comment..."
                                    value={newComment[post.post_id] || ''}
                                    onChange={(e) => handleNewCommentChange(post.post_id, e.target.value)}
                                />
                                <button
                                    className='comment-button'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNewCommentSubmit(post.post_id);
                                    }}
                                >
                                    <i className="fa fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                        
                        {selectedPost && selectedPost.post_id === post.post_id && (
                            <div className="comments-container">
                                <h3>Comments:</h3>
                                <ul>
                                    {commentsMap[post.post_id]?.map((comment) => (
                                        <li key={comment.comment_id}>
                                            <strong>{comment.username}</strong>: {comment.content}
                                            {currentUser && comment.user_id === currentUser.user_id && (
                                                <button
                                                className="delete-comment-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteComment(post.post_id, comment.comment_id);
                                                }}
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
                                            
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogsPage;