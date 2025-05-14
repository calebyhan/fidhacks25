import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import './Profile.css';  

export default function EditProfile() {
    const [cookies] = useCookies(['user']);
    const user = cookies.user;
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/');
        } else {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user, navigate]);

    const handleProfilePictureChange = (event) => {
        setProfilePicture(event.target.files[0]);
    };

    const handleFormSubmit = async (event) => {
        setLoading(true);

        try {
            // CHANGE DATABASE INFO
            console.log("Success")
        } catch (error) {
            console.log("Error")
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Edit Profile</h2>
            <div className="underline"></div>
            <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="profilePicture">Profile Picture</label>
                    <input
                        type="file"
                        id="profilePicture"
                        onChange={handleProfilePictureChange}
                    
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}