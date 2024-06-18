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

    useEffect(() => {
        fetchPosts();
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
            setCommentsMap(prevCommentsMap => ({
                ...prevCommentsMap,
                [postId]: [data, ...prevCommentsMap[postId]]
            }));
            console.log('Comment posted:', data);
        } catch (error) {
            console.error('Error commenting on post:', error.message);
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
            <div className="posts-container">
                {filteredPosts.map(post => (
                    <div key={post.post_id} className="post" onClick={() => setSelectedPost(post)}>
                        <div className='image-blog'>
                            <img src={post.image_url} alt={post.title} className="post-image" />
                        </div>
                        <div className='content-blog'>
                            <h2>{post.title}</h2>
                            <h3></h3>
                            <p>{post.content}</p>
                        </div>
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
                                Comment ({commentsMap[post.post_id] ? commentsMap[post.post_id].length : 0})
                            </button>
                        </div>
                        {selectedPost && selectedPost.post_id === post.post_id && commentsMap[post.post_id] && (
                            <div className="comments-container">
                                <h3>Comments:</h3>
                                <ul>
                                    {commentsMap[post.post_id].map(comment => (
                                        <li key={comment.comment_id}>
                                            <strong>{comment.username}</strong>: {comment.content}
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