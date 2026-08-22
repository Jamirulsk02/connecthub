import { auth, db } from "./firebase.js";
import { createPost } from "./post.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    query,
    orderBy,
    where,
    serverTimestamp,
    deleteDoc,
    updateDoc,
    increment,
    arrayUnion,
    arrayRemove,
    doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const postBtn = document.getElementById("postBtn");
postBtn.addEventListener("click", () => {
    createPost(currentUser, postText, loadPosts);
});

const postText = document.getElementById("postText");
const posts = document.getElementById("posts");

let currentUser = null;

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    loadPosts();

});






async function loadPosts() {

    posts.innerHTML = "";

    const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    snapshot.forEach((docItem) => {

        const data = docItem.data();

        const post = document.createElement("div");

        post.className = "post";

        post.innerHTML = `
              <div class="post-header">

    <div class="post-user">

        <img src="images/profile.png" class="post-profile">

        <div>

            <h3>${data.username}</h3>

            <small>Just now</small>

        </div>

    </div>

    <div class="menu-container">

        <button class="menu-btn">
            <i class="fa-solid fa-ellipsis"></i>
        </button>

       <div class="menu-dropdown">

${data.uid === currentUser.uid ? `

<button class="edit-btn">
    <i class="fa-solid fa-pen"></i>
    Edit Post
</button>

<button class="privacy-btn">
    <i class="fa-solid fa-earth-asia"></i>
    Privacy
</button>

<button class="delete-btn">
    <i class="fa-solid fa-trash"></i>
    Delete Post
</button>

` : `

<button class="report-btn">
    <i class="fa-solid fa-flag"></i>
    Report Post
</button>

<button class="copy-btn">
    <i class="fa-solid fa-link"></i>
    Copy Link
</button>

<button class="block-btn">
    <i class="fa-solid fa-ban"></i>
    Block User
</button>

`}

</div>

    </div>

</div>

<p class="post-text">${data.text}</p>

<div class="post-buttons">

   <button class="likeBtn">
    <i class="fa-heart ${data.likedBy?.includes(currentUser.uid) ? 'fa-solid' : 'fa-regular'}"
       style="${data.likedBy?.includes(currentUser.uid) ? 'color:red;' : ''}">
    </i>

    <span>${data.likes || 0}</span>
</button>

  <div class="comment-wrapper">

    <button class="commentBtn">
        <i class="fa-regular fa-comment"></i>
        Comment
    </button>

    <div class="comment-input-box">

        <img src="images/profile.png" class="comment-profile">

        <input
            type="text"
            class="commentInput"
            placeholder="Write a comment...">

        <button class="sendComment">
            <i class="fa-solid fa-paper-plane"></i>
        </button>

        <button class="cancelComment">
            <i class="fa-solid fa-xmark"></i>
        </button>

    </div>

</div>



    <button class="shareBtn">
        <i class="fa-solid fa-share"></i>
        Share
    </button>

</div>
        `;

        posts.appendChild(post);
 const deleteBtn = post.querySelector(".delete-btn");

if (deleteBtn) {

    deleteBtn.addEventListener("click", async () => {

        const confirmDelete = confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmDelete) return;

        try {

            await deleteDoc(doc(db, "posts", docItem.id));

            loadPosts();

        } catch (error) {

            alert(error.message);
            console.error(error);

        }

    });

  
    //edit button 

    const editBtn = post.querySelector(".edit-btn");

if (editBtn) {

    editBtn.addEventListener("click", async () => {

        const newText = prompt("Edit your post:", data.text);

        if (newText === null) return;

        if (newText.trim() === "") {
            alert("Post cannot be empty.");
            return;
        }

        try {

            await updateDoc(doc(db, "posts", docItem.id), {

                text: newText.trim()

            });

            loadPosts();

        } catch (error) {

            console.error(error);
            alert(error.message);

        }

    });

}

}
        const menuBtn = post.querySelector(".menu-btn");
const menu = post.querySelector(".menu-container");

menuBtn.addEventListener("click", (e) => {
                             e.stopPropagation();
                              document.querySelectorAll(".menu-container").forEach((item) =>
                                                      {
                                                        if (item !== menu){
                                                            item.classList.remove("active");
                                                        }
                                                      });
    menu.classList.toggle("active");
});

        // like functions   
            const likeBtn = post.querySelector(".likeBtn");

likeBtn.addEventListener("click", async () => {

    try {

        const postRef = doc(db, "posts", docItem.id);

        // Get the latest post data
        const postSnap = await getDoc(postRef);

        const postData = postSnap.data();

        const liked = (postData.likedBy || []).includes(currentUser.uid);

        if (liked) {

            await updateDoc(postRef, {
                likes: increment(-1),
                likedBy: arrayRemove(currentUser.uid)
            });

        } else {

            await updateDoc(postRef, {
                likes: increment(1),
                likedBy: arrayUnion(currentUser.uid)
            });

        }

        loadPosts();

    } catch (error) {

        console.error(error);
        alert(error.message);

    }

          });

const commentBtn = post.querySelector(".commentBtn");
const commentBox = post.querySelector(".comment-input-box");
const cancelBtn = post.querySelector(".cancelComment");
const commentInput = post.querySelector(".commentInput");

commentBtn.addEventListener("click", () => {

    commentBtn.style.display = "none";

    commentBox.classList.add("active");

    commentInput.focus();

});

const sendComment = post.querySelector(".sendComment");

sendComment.addEventListener("click", async () => {

    const text = commentInput.value.trim();

    if (text === "") return;

    try {

        await addDoc(collection(db, "comments"), {

            postId: docItem.id,

            uid: currentUser.uid,

            username: currentUser.displayName || "User",

            text: text,

            createdAt: serverTimestamp()

        });

        commentInput.value = "";

        commentBox.classList.remove("active");

        commentBtn.style.display = "inline-flex";

        loadPosts();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});

cancelBtn.addEventListener("click", () => {

    commentBox.classList.remove("active");

    commentBtn.style.display = "inline-flex";

    commentInput.value = "";

});

    });



   

}

document.addEventListener("click", () =>{
    document.querySelectorAll(".menu-container").forEach((menu) => {
        menu.classList.remove("active");
    });
});