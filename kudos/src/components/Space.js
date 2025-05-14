import React, { useState, useEffect } from "react";
import "./Space.css";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { getPostsForSpace, getSpaceOrder } from "../database";

export default function Space() {
    const [cookies] = useCookies(['user']);
    const [posts, setPosts] = useState([]);
    const [accessAllowed, setAccessAllowed] = useState(false);
    const navigate = useNavigate();
    const { spaceId } = useParams();

    useEffect(() => {
        async function checkAccessAndFetch() {
            if (!cookies.user) {
                navigate('/login');
                return;
            }

            const userSpaces = await getSpaceOrder(cookies.user.id);
            const allowedSpaceIds = userSpaces.map(space => String(space.id));

            if (allowedSpaceIds.includes(spaceId)) {
                setAccessAllowed(true); 
                const postsList = await getPostsForSpace(spaceId);
                setPosts(postsList);
            } else {
                setAccessAllowed(false);
                navigate('/');
            }
        }

        checkAccessAndFetch();
    }, [cookies, spaceId, navigate]);

    if (!cookies.user || !accessAllowed) {
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
