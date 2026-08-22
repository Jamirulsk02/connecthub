import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userBio = document.getElementById("userBio");

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    userName.textContent = user.displayName || "ConnectHub User";
    userEmail.textContent = user.email;

    try {

        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {

            const data = userSnap.data();

            userName.textContent = data.fullname || user.displayName;
            userEmail.textContent = data.email;
            userBio.textContent = data.bio || "Welcome to ConnectHub.";

        }

    } catch (error) {

        console.error(error);

    }

});