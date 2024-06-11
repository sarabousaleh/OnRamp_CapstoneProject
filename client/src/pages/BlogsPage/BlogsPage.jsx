import React from "react";
import { Link, useNavigate } from 'react-router-dom'; 
import ArrowHeader from '../../components/ArrowHeader/ArrowHeader';
import './BlogsPage.css'; // Import CSS file for styling

const BlogsPage = () => {
    const navigate = useNavigate();
  
    const goBack = () => {
      navigate(-1);
    };

    // Simulated data for a blog
    const blog = {
        id: 1,
        title: 'Sample Blog Title',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium, justo nec congue commodo, lorem libero congue justo, at lacinia lorem dui nec dolor. Nulla eget justo vel enim tristique aliquet sit amet quis justo. Nam feugiat mi in est convallis, ac tempus neque tempor. Integer facilisis euismod enim non eleifend.',
        likes: 10,
        comments: [
            { id: 1, author: 'User1', comment: 'Great blog!' },
            { id: 2, author: 'User2', comment: 'Awesome content!' }
        ]
    };

    const handleLike = () => {
        // Implement logic to handle liking a blog
    };

    const handleComment = () => {
        // Implement logic to handle commenting on a blog
    };

    const handleShare = () => {
        // Implement logic to handle sharing a blog
    };

    return(
        <div className="blogs-container">
            <ArrowHeader title="Blogs" />
            <div className="blog">
                <h2>{blog.title}</h2>
                <p>{blog.content}</p>
                <div className="actions">
                    <button onClick={handleLike}>Like ({blog.likes})</button>
                    <button onClick={handleComment}>Comment ({blog.comments.length})</button>
                    <button onClick={handleShare}>Share</button>
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
        </div>
    );
}

export default BlogsPage;
