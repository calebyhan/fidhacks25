import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { createPost } from "../database";

export default function PostInterface() {
    const [cookies] = useCookies(['user']); // 👈 get user cookie
    const user = cookies.user;
    const navigate = useNavigate();

    const [postContent, setPostContent] = useState("");

    const handlePostSubmit = () => {
        if (user && postContent) {
        const postId = Math.floor(Math.random() * 10000);
        createPost(user.id, postId, postContent);
        alert("Post created successfully!");
        setPostContent("");
        } else {
        navigate('/');
        }
    };

    return (
        <div>
        <h2>Create a Post</h2>
        <div>
            <label>
            Post Content:
            <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
            />
            </label>
        </div>
        <button onClick={handlePostSubmit}>Submit Post</button>
        </div>
    );
}