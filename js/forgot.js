import { auth } from "./firebase.js";

import {
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const form = document.getElementById("forgotForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    try {

        await sendPasswordResetEmail(auth, email);

        message.style.color = "lime";
        message.innerHTML = "✅ Password reset email sent. Please check your inbox.";

    } catch (error) {

        message.style.color = "red";
        message.innerHTML = error.message;

    }

});