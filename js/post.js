import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function createPost(currentUser, postText, loadPosts) {

    const text = postText.value.trim();

    if (text === "") {
        alert("Write something first.");
        return;
    }

    try {

        await addDoc(collection(db, "posts"), {

            uid: currentUser.uid,
            username: currentUser.displayName || "User",
            text: text,
            likes: 0,
            likedBy: [],
            createdAt: serverTimestamp()

        });

        postText.value = "";

        loadPosts();

    } catch (error) {

        console.error(error);
        alert(error.message);

    }

}