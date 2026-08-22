import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

       /* if (!userCredential.user.emailVerified) {

            message.style.color = "red";
            message.innerHTML =
                "Please verify your email before login.";

            return;

        }*/

        message.style.color = "lime";

        message.innerHTML =
            "Login Successful";

        setTimeout(() => {

            window.location.href = "feed.html";

        },1500);

    } catch(error){

        message.style.color="red";

        message.innerHTML=error.message;

    }

});