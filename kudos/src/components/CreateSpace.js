import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { createSpace } from "../database";
import "./CreateSpace.css"; // (optional if you want to style it)

export default function CreateSpacePage() {
    const [cookies] = useCookies(['user']);
    const [spaceName, setSpaceName] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleCreate = async () => {
        if (!spaceName.trim()) {
            setError("Space name cannot be empty.");
            return;
        }

        const user = cookies.user;
        if (!user) {
            navigate("/login");
            return;
        }

        const randomSpaceId = Math.floor(Math.random() * 100000);

        try {
            await createSpace(user.id, randomSpaceId, spaceName);
            navigate("/");
        } catch (err) {
            console.error("Failed to create space:", err);
            setError("Failed to create space.");
        }
    };

    return (
        <div className="CreateSpacePage">
            <h2>Create a New Space</h2>

            <div className="form-group">
                <label>Space Name:</label>
                <input
                    type="text"
                    value={spaceName}
                    onChange={(e) => setSpaceName(e.target.value)}
                    placeholder="Enter space name"
                />
            </div>

            {error && <div className="error">{error}</div>}

            <button onClick={handleCreate} className="create-button">
                Create Space
            </button>
        </div>
    );
}
