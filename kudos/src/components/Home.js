import React, { useState, useEffect } from "react";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { getSpaceOrder } from "../database";
import { getDatabase, ref, get, child } from "firebase/database";

export default function Home() {
    const [cookies, , removeCookie] = useCookies(['user']);
    const [userSpaces, setUserSpaces] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchSpacesAndFavorites() {
            if (cookies.user) {
                const orderedIds = await getSpaceOrder(cookies.user.id);

                if (orderedIds.length > 0) {
                    const topTwoIds = orderedIds.slice(0, 2);

                    const db = getDatabase();
                    const dbRef = ref(db);
                    const favoriteSpaces = [];

                    for (const id of topTwoIds) {
                        const spaceSnapshot = await get(child(dbRef, `spaces/${id}`));
                        if (spaceSnapshot.exists()) {
                            favoriteSpaces.push({ id: id, ...spaceSnapshot.val() });
                        }
                    }

                    setUserSpaces(favoriteSpaces);
                } else {
                    setUserSpaces([]);
                }
            }
        }
        fetchSpacesAndFavorites();
    }, [cookies]);

    const handleLogout = () => {
        removeCookie('user', { path: '/' });
        navigate("/");
    };

    const handleCreateSpace = () => {
        navigate("/create-space");
    };

    const handleViewAllSpaces = () => {
        navigate("/view-spaces");
    };

    const handleGoToSpace = (spaceId) => {
        navigate(`/space/${spaceId}`);
    };

    const handleJoinSpace = () => {
        navigate("/join-space");
    };

    if (!cookies.user) {
        return (
            <div className="Home1">
                <div className="logo">
                    <img src={require('./assets/logo.png')} alt="logo" />
                </div>
                <div className="elements">
                    <div className="submit-container">
                        <div className="submit">
                            <Link to="/login">LOGIN</Link>
                        </div>
                        <div className="submit">
                            <Link to="/signup">SIGN UP</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="Home2">
            <div className="profile-section">
                <img src={require('./assets/generic-avatar.png')} alt="profile" className="large-profile" />
            </div>

            <div className="clouds-container">
                {userSpaces[0] ? (
                    <div className="cloud" onClick={() => handleGoToSpace(userSpaces[0].id)}>
                        <img src={require('./assets/cloud.png')} alt="cloud" className="cloud-image" />
                        <div className="cloud-content">
                            <div className="cloud-name">{userSpaces[0].name}</div>
                        </div>
                    </div>
                ) : (
                    <div className="cloud" onClick={handleCreateSpace}>
                        <img src={require('./assets/cloud.png')} alt="cloud" className="cloud-image" />
                        <div className="cloud-content">
                            <div className="cloud-name">+ Create Cloud</div>
                        </div>
                    </div>
                )}

                {userSpaces[1] ? (
                    <div className="cloud" onClick={() => handleGoToSpace(userSpaces[1].id)}>
                        <img src={require('./assets/cloud.png')} alt="cloud" className="cloud-image" />
                        <div className="cloud-content">
                            <div className="cloud-name">{userSpaces[1].name}</div>
                        </div>
                    </div>
                ) : (
                    <div className="cloud" onClick={handleCreateSpace}>
                        <img src={require('./assets/cloud.png')} alt="cloud" className="cloud-image" />
                        <div className="cloud-content">
                            <div className="cloud-name">+ Create Cloud</div>
                        </div>
                    </div>
                )}
            </div>

            <div className="buttons-container">
                <button onClick={handleJoinSpace} className="home-button">JOIN A CLOUD</button>
                <button onClick={handleViewAllSpaces} className="home-button">VIEW ALL CLOUDS</button>
                <button onClick={handleCreateSpace} className="home-button">CREATE A CLOUD</button>
            </div>

            <div className="logout-button">
                <button onClick={handleLogout}>Log Out</button>
            </div>
        </div>
    );
}
