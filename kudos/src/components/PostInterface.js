import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { createPost, spaces } from "../database";
import "./popup.css"

export default function PostInterface() {
    const [cookies] = useCookies(['user']);
    const user = cookies.user;
    const navigate = useNavigate();

    const [postContent, setPostContent] = useState("");
    const [availableSpaces, setAvailableSpaces] = useState([]);
    const [selectedSpaces, setSelectedSpaces] = useState([]);
    const [popupMessage, setPopupMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);


    useEffect(() => {
        if (user) {
            spaces(user.id).then((spaceList) => {
                setAvailableSpaces(spaceList);
            });
        } else {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSpaceSelect = (spaceId) => {
        if (selectedSpaces.includes(spaceId)) {
            setSelectedSpaces(selectedSpaces.filter(id => id !== spaceId));
        } else {
            setSelectedSpaces([...selectedSpaces, spaceId]);
        }
    };

    const handlePostSubmit = () => {
        if (user && postContent && selectedSpaces.length > 0) {
            const postId = Math.floor(Math.random() * 10000);
            createPost(user.id, postId, postContent, selectedSpaces);
            setPopupMessage("Post created successfully!");
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
            setPostContent("");
            setSelectedSpaces([]);
        } else {
            setPopupMessage("Please enter post content and select at least one space.");
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
        }
    };


    return (
        <div>
            {showPopup && (
                <div className="popup">
                    {popupMessage}
                </div>
            )}
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

            <div>
                <h3>Select Spaces to Post:</h3>
                {availableSpaces.length > 0 ? (
                    availableSpaces.map((space) => (
                        <div key={space.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    value={space.id}
                                    checked={selectedSpaces.includes(space.id)}
                                    onChange={() => handleSpaceSelect(space.id)}
                                />
                                {space.name}
                            </label>
                        </div>
                    ))
                ) : (
                    <div>Loading spaces...</div>
                )}
            </div>

            <button onClick={handlePostSubmit}>Submit Post</button>
        </div>
    );
}
