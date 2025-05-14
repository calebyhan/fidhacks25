import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { uploadProfilePicture, updateUserProfile } from "../database";
import "./Profile.css";
import "./popup.css"; // 🔥 use your popup styling

export default function Profile() {
    const [cookies] = useCookies(['user']);
    const user = cookies.user;
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewImage, setPreviewImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/');
        } else {
            setName(user.name || "");
            setEmail(user.email || "");
            setPreviewImage(user.profilePicture || "");
        }
    }, [user, navigate]);

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let profilePictureUrl = previewImage;

            if (profilePicture) {
                profilePictureUrl = await uploadProfilePicture(user.id, profilePicture);
            }

            const updateData = {
                name: name,
                email: email,
                profilePicture: profilePictureUrl,
            };

            await updateUserProfile(user.id, updateData);

            setPopupMessage("Profile updated successfully!");
            setShowPopup(true);

            // Refresh cookie (better way: fetch updated user info)
            document.cookie = `user=${JSON.stringify({ ...user, name, email, profilePicture: profilePictureUrl })}; path=/`;
            setTimeout(() => {
                window.location.reload();
            }, 2000); // wait a bit to show popup
        } catch (error) {
            console.error("Error updating profile:", error);
            setPopupMessage("Error updating profile!");
            setShowPopup(true);
        } finally {
            setLoading(false);
            setTimeout(() => setShowPopup(false), 2500);
        }
    };

    return (
        <div className="profile-container">
            {showPopup && <div className="popup">{popupMessage}</div>}

            <h2>Edit Profile</h2>
            <div className="underline"></div>

            <form onSubmit={handleFormSubmit} className="profile-form">
                <div className="profile-picture-container">
                    <img
                        src={previewImage || require("./assets/generic-avatar.png")}
                        alt="Profile Preview"
                        className="profile-picture"
                    />
                    <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
                </div>

                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
