import { useState } from "react";
import { useCookies } from "react-cookie";
import { createPost } from "../database";

export default function PostInterface() {
  const [cookies] = useCookies(['user']); // 👈 get user cookie
  const user = cookies.user;

  const [postContent, setPostContent] = useState("");

  const handlePostSubmit = () => {
    if (user && postContent) {
      const postId = Math.floor(Math.random() * 10000); // Generate random post ID
      createPost(user.id, postId, postContent); // 👈 use user.id from cookie
      alert("Post created successfully!");
      setPostContent(""); // Clear input field
    } else {
      alert("Please log in and fill in post content.");
    }
  };

  if (!user) {
    return <div>Please log in to create a post.</div>;
  }

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