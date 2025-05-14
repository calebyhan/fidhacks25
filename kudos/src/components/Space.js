import React, { useState, useEffect } from "react";
import "./Space.css";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { getPostsForSpace, getSpaceOrder, toggleKudos, getSpaceInfo } from "../database";
import { getFormattedTime } from "../timehelper";

export default function Space() {
    const [cookies] = useCookies(['user']);
    const [posts, setPosts] = useState([]);
    const [accessAllowed, setAccessAllowed] = useState(false);
    const navigate = useNavigate();
    const { spaceId } = useParams();
    const [spaceInfo, setSpaceInfo] = useState(null);


    const user = cookies.user;

    useEffect(() => {
        async function checkAccessAndFetch() {
            if (!user) {
                navigate('/login');
                return;
            }

            const userSpaceIds = await getSpaceOrder(user.id);
            console.log("User Cloud IDs:", userSpaceIds);

            if (userSpaceIds.includes(Number(spaceId))) {
                setAccessAllowed(true);

                const postsList = await getPostsForSpace(spaceId, user.id);
                setPosts(postsList);

                const info = await getSpaceInfo(spaceId);
                setSpaceInfo(info);
            } else {
                setAccessAllowed(false);
                navigate('/');
            }
        }


        checkAccessAndFetch();
    }, [user, spaceId, navigate]);

    async function handleToggleLike(postId) {
        if (!user) return;

        try {
            const result = await toggleKudos(postId, user.id);
            const { updatedKudos, isLiked } = result;

            setPosts(prevPosts =>
                prevPosts.map(p =>
                    p.id === postId ? { ...p, kudos: updatedKudos, isLiked: isLiked, animateKudos: true } : p
                )
            );

            setTimeout(() => {
                setPosts(prevPosts =>
                    prevPosts.map(p =>
                        p.id === postId ? { ...p, animateKudos: false } : p
                    )
                );
            }, 300);
        } catch (error) {
            console.error("Failed to toggle kudos:", error);
        }
    }

    if (!user || !accessAllowed) {
        return null;
    }

    return (
        <div className="Space">
            {spaceInfo && (
                <div className="space-summary">
                    <h2>{spaceInfo.name}</h2>
                    <p><strong>Code:</strong> {spaceInfo.code}</p>
                    <p><strong>Members:</strong> {Object.keys(spaceInfo.members).length}</p>
                </div>
            )}

            <div className="post-container">
                {posts.length > 0 ? (
                    posts.map((post, index) => (
                        <div className="post" key={index}>
                            <img src={require('./assets/generic-avatar.png')} alt="profile" className="profile-icon" />
                            <div className="post-content">
                                <div className="post-author">{post.author}</div>
                                <div className="post-text">{post.content}</div>
                                
                                <div className="post-info">
                                    <div className="post-time">{getFormattedTime(post.timestamp)}</div>
                                    |
                                    <div className={`kudos-count ${post.animateKudos ? 'bump' : ''}`}>
                                        {post.kudos} Kudos
                                    </div>
                                </div>
                            </div>
                            <div className="like-section">
                                <div
                                    className={`like-icon ${post.isLiked ? 'liked' : ''}`}
                                    onClick={() => handleToggleLike(post.id)}
                                >
                                    <img src={require('./assets/like.png')} alt="like" />
                                </div>
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
