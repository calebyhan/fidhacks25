import React, { useState, useEffect } from "react";
import "./Space.css";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { getPostsForSpace } from "../database";

export default function Space() {
    const [cookies, removeCookie] = useCookies(['user']);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const { spaceId } = useParams();

    useEffect(() => {
        async function fetchPosts() {
            if (cookies.user && spaceId) {
                const postsList = await getPostsForSpace(spaceId);
                setPosts(postsList);
            }
        }
        fetchPosts();
    }, [cookies, spaceId]);

    if (!cookies.user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="Space">
            <div className="post-container">
                {posts.length > 0 ? (
                    posts.map((post, index) => (
                        <div className="post" key={index}>
                            <img src={require('./assets/generic-avatar.png')} alt="profile" className="profile-icon" />
                            <div className="post-content">{post.content}</div>
                            <div className="like-icon">
                                <img src={require('./assets/like.png')} alt="like" />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-posts">No posts yet!</div>
                )}
            </div>
        </div>
    );
}
