import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";
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
    const db = getDatabase(app);
    set(ref(db, "users/" + userId), {
        username: username,
        name: name,
        email: email,
        password: password,
        posts: {},
        spaces: {},
    });
}

function createPost(userId, postId, postContent, spaces) {
  const db = getDatabase(app);

  set(ref(db, "posts/" + postId), {
    author: userId,
    content: postContent,
    kudos: 0,
    spaces: spaces,
    timestamp: getCurrentTimestamp(),
  });

  spaces.forEach((spaceId) => {
    const spacePostsRef = ref(db, "spaces/" + spaceId + "/posts/" + postId);
    set(spacePostsRef, postId); 
  });

  set(ref(db, "users/" + userId + "/posts/" + postId), postId);
}

function createSpace(userId, spaceId, spaceName) {
    const db = getDatabase(app);
    set(ref(db, "spaces/" + spaceId), {
        name: spaceName,
        posts: {}
    });

    set(ref(db, "users/" + userId + "/spaces/" + spaceId), spaceId);
}

async function login(email, password) {
    const db = getDatabase(app);
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

async function spaces(userId) {
    const db = getDatabase();
    const dbRef = ref(db);

    try {
        const userSnapshot = await get(child(dbRef, `users/${userId}/spaces`));
        if (!userSnapshot.exists()) {
        console.log("User has no spaces");
        return [];
        }

        const spaceIdsObj = userSnapshot.val();
        const spaceIds = Object.values(spaceIdsObj);

        const spaceList = [];

        for (const spaceId of spaceIds) {
        const spaceSnapshot = await get(child(dbRef, `spaces/${spaceId}`));
        if (spaceSnapshot.exists()) {
            const spaceData = spaceSnapshot.val();
            spaceList.push({
            id: spaceId,
            name: spaceData.name
            });
        }
        }

        return spaceList;
    } catch (error) {
        console.error("Error fetching spaces:", error);
        return [];
    }
}

export { db, createUser, createPost, createSpace, login, spaces };