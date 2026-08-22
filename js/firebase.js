import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCNR1EBQAJLIY3sz9-2jgT72_Sf7eE4a7I",
  authDomain: "my-social-media-45f52.firebaseapp.com",
  projectId: "my-social-media-45f52",
  storageBucket: "my-social-media-45f52.firebasestorage.app",
  messagingSenderId: "441505615713",
  appId: "1:441505615713:web:18cf7eec24a984e43c3f20",
  measurementId: "G-S9ZDTR0L9S"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

