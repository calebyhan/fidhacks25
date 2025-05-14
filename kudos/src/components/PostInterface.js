import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { createPost, getSpaceOrder } from "../database";
import { getDatabase, ref, get, child } from "firebase/database";
import "./popup.css";
import "./PostInterface.css";

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
        async function fetchSpaces() {
            if (user) {
                const orderedIds = await getSpaceOrder(user.id);

                const db = getDatabase();
                const dbRef = ref(db);
                const spacesFetched = [];

                for (const id of orderedIds) {
                    const spaceSnapshot = await get(child(dbRef, `spaces/${id}`));
                    if (spaceSnapshot.exists()) {
                        spacesFetched.push({ id: id, ...spaceSnapshot.val() });
                    }
                }

                setAvailableSpaces(spacesFetched);
            } else {
                navigate('/');
            }
        }
        fetchSpaces();
    }, [user, navigate]);

    const handleSpaceSelect = (spaceId) => {
        if (selectedSpaces.includes(spaceId)) {
            setSelectedSpaces(selectedSpaces.filter(id => id !== spaceId));
        } else {
            setSelectedSpaces([...selectedSpaces, spaceId]);
        }
    };

    const handlePostSubmit = async () => {
        if (user && postContent && selectedSpaces.length > 0) {
            const postId = Math.floor(Math.random() * 10000);
            await createPost(user.id, postId, postContent, selectedSpaces);

            setPopupMessage("Post created successfully!");
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
            setPostContent("");
            setSelectedSpaces([]);
        } else {
            setPopupMessage("Please enter post content and select at least one cloud.");
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
        }
    };

    return (
        <div className="postcontainer">
                {showPopup && <div className="popup">{popupMessage}</div>}
                <div className="header">
                    <h2 className="textpost">Create a Post</h2>
                    <div className="underline"></div>
                </div>
            <div className="items">
                <div>
                    Post Content:
                </div>
                <div>
                    <label>
                        <textarea
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                        />
                    </label>
                </div>

                <div>
                    <h3>Select Clouds to Post:</h3>
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
        </div>
    );
}
