import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { joinSpace } from "../database";
import "./JoinSpace.css"; // optional for styling

export default function JoinSpace() {
    const [cookies] = useCookies(['user']);
    const [spaceCode, setSpaceCode] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleJoin = async () => {
        if (!spaceCode.trim()) {
            setError("Space code cannot be empty.");
            return;
        }

        const user = cookies.user;
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            await joinSpace(user.id, spaceCode, spaceCode); // assuming spaceId = code
            navigate("/"); // back to home after success
        } catch (err) {
            console.error("Failed to join space:", err);
            setError("Failed to join space. Check the code.");
        }
    };

    return (
        <div className="JoinSpacePage">
            <h2>Join a Space</h2>

            <div className="form-group">
                <label>Enter Space Code:</label>
                <input
                    type="text"
                    value={spaceCode}
                    onChange={(e) => setSpaceCode(e.target.value)}
                    placeholder="Space ID or code"
                />
            </div>

            {error && <div className="error">{error}</div>}

            <button onClick={handleJoin} className="join-button">
                Join Space
            </button>
        </div>
    );
}
