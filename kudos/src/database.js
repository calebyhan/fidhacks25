import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, update } from "firebase/database";
import { getCurrentTimestamp } from "./timehelper";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function createUser(userId, username, name, email, password) {
    set(ref(db, "users/" + userId), {
        username: username,
        name: name,
        email: email,
        password: password,
    });
}

function createPost(userId, postId, postContent, spaces) {
    set(ref(db, "posts/" + postId), {
        author: userId,
        content: postContent,
        kudos: 0,
        spaces: spaces,
        timestamp: getCurrentTimestamp(),
    });

    spaces.forEach((spaceId) => {
        set(ref(db, "spaces/" + spaceId + "/posts/" + postId), postId); 
    });

    set(ref(db, "users/" + userId + "/posts/" + postId), postId);
}

async function createSpace(userId, spaceId, spaceName) {
    set(ref(db, "spaces/" + spaceId), {
        name: spaceName,
        code: Math.floor(Math.random() * 1000000),
        members: {
            [userId]: true
        },
        posts: {}
    });

    const userRef = ref(db, "users/" + userId);
    const userSnapshot = await get(userRef);
    if (userSnapshot.exists()) {
        const currentSpaceOrder = userSnapshot.val().spaceOrder || [];
        await update(userRef, {
            spaceOrder: [...currentSpaceOrder, spaceId]
        });
    }
}

async function login(email, password) {
    const dbRef = ref(db);

    try {
        const snapshot = await get(child(dbRef, "users"));
        if (snapshot.exists()) {
            let foundUser = null;
            snapshot.forEach((childSnapshot) => {
                const user = childSnapshot.val();
                const userId = childSnapshot.key;
                if (user.email === email && user.password === password) {
                    console.log("Login successful");
                    foundUser = { id: userId, ...user };
                }
            });
            if (!foundUser) {
                console.log("Login failed");
            }
            return foundUser;
        } else {
            console.log("No users found");
            return null;
        }
    } catch (error) {
        console.error("Login error:", error);
        return null;
    }
}

async function getPostsForSpace(spaceId, userId) {
    const db = getDatabase();
    const dbRef = ref(db);

    try {
        const spaceSnapshot = await get(child(dbRef, `spaces/${spaceId}/posts`));
        if (!spaceSnapshot.exists()) {
            return [];
        }

        const postIdsObj = spaceSnapshot.val();
        const postIds = Object.values(postIdsObj);

        const postList = [];

        for (const postId of postIds) {
            const postSnapshot = await get(child(dbRef, `posts/${postId}`));
            if (postSnapshot.exists()) {
                const postData = postSnapshot.val();

                let authorName = "Unknown User";
                try {
                    const userSnapshot = await get(child(dbRef, `users/${postData.author}`));
                    if (userSnapshot.exists()) {
                        const userData = userSnapshot.val();
                        authorName = userData.username || "Unknown User";
                    }
                } catch (err) {
                    console.error("Error fetching username:", err);
                }

                const isLiked = postData.kudosByUser && postData.kudosByUser[userId];

                postList.push({
                    id: postId,
                    content: postData.content,
                    author: authorName,
                    kudos: postData.kudos || 0,
                    isLiked: !!isLiked,
                    timestamp: postData.timestamp || Date.now()
                });
            }
        }

        postList.sort((a, b) => b.timestamp - a.timestamp);

        return postList;
    } catch (error) {
        console.error("Error fetching posts for space:", error);
        return [];
    }
}

async function joinSpace(userId, spaceId, code) {
    const spaceSnapshot = await get(ref(db, `spaces/${spaceId}`));
    if (!spaceSnapshot.exists()) {
        console.log("Space does not exist");
        return false;
    }

    const spaceData = spaceSnapshot.val();
    if (spaceData.code !== code) {
        console.log("Invalid code");
        return false;
    }

    const userRef = ref(db, `users/${userId}`);
    const userSnapshot = await get(userRef);
    if (userSnapshot.exists()) {
        const currentSpaceOrder = userSnapshot.val().spaceOrder || [];
        await update(userRef, {
            spaceOrder: [...currentSpaceOrder, spaceId]
        });
    }

    const spaceRef = ref(db, `spaces/${spaceId}/members/${userId}`);
    await set(spaceRef, true);
    console.log("User joined space successfully");
    return true;
}

async function spaceOrder(userId, orderedSpaceIds) {
    await update(ref(db, `users/${userId}`), {
        spaceOrder: orderedSpaceIds
    });
}

async function getSpaceOrder(userId) {
    const spaceOrderRef = ref(db, `users/${userId}/spaceOrder`);
    const snapshot = await get(spaceOrderRef);

    if (snapshot.exists()) {
        return Object.values(snapshot.val());
    } else {
        return [];
    }
}

async function toggleKudos(postId, userId) {
    const db = getDatabase();
    const postRef = ref(db, `posts/${postId}`);

    try {
        const snapshot = await get(postRef);
        if (snapshot.exists()) {
            const post = snapshot.val();
            const kudosByUser = post.kudosByUser || {};

            const alreadyLiked = kudosByUser[userId] === true;
            const updatedKudos = alreadyLiked ? post.kudos - 1 : post.kudos + 1;

            if (alreadyLiked) {
                delete kudosByUser[userId];
            } else {
                kudosByUser[userId] = true;
            }

            await update(postRef, {
                kudos: updatedKudos,
                kudosByUser: kudosByUser
            });

            return { updatedKudos, isLiked: !alreadyLiked };
        } else {
            throw new Error("Post not found");
        }
    } catch (error) {
        console.error("Error toggling kudos:", error);
        throw error;
    }
}

async function getSpaceInfo(spaceId) {
    const db = getDatabase();
    const dbRef = ref(db);

    try {
        const snapshot = await get(child(dbRef, `spaces/${spaceId}`));
        if (snapshot.exists()) {
            const data = snapshot.val();
            return {
                name: data.name || "Unnamed Space",
                code: data.code || "No Code",
                members: data.members || {} // assuming you track members
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Failed to fetch space info:", error);
        return null;
    }
}

export { 
    db, 
    createUser, 
    createPost, 
    createSpace, 
    login, 
    getPostsForSpace, 
    joinSpace, 
    spaceOrder,
    getSpaceOrder,
    toggleKudos,
    getSpaceInfo,
};
