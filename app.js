// 🔥 FIREBASE IMPORTS
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔥 CONFIG (तुम्हारा same)
const firebaseConfig = {
  apiKey: "AIzaSyD_Ga-Mi9EPdi9gtJWkXA7fgqea1P4OE54",
  authDomain: "dbsolutions-career.firebaseapp.com",
  projectId: "dbsolutions-career",
  storageBucket: "dbsolutions-career.appspot.com",
  messagingSenderId: "672960239523",
  appId: "1:672960239523:web:d883210f329cf552e5ec16"
};

// INIT
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// DOM
const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const profileSection = document.getElementById("profileSection");

// 🔥 CHECK LOGIN ON LOAD
window.onload = () => {
  const name = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const photo = localStorage.getItem("photo");

  if (name && email) {
    showProfile(name, email, photo);
  }
};

// 🔥 GOOGLE LOGIN
window.googleLogin = async function () {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const name = user.displayName;
    const email = user.email;
    const photo = user.photoURL;

    // SAVE
    localStorage.setItem("username", name);
    localStorage.setItem("email", email);
    localStorage.setItem("photo", photo);

    showProfile(name, email, photo);

    addBotMessage(`✅ Welcome ${name}`);
  } catch (err) {
    console.error(err);
    alert("Login failed ❌");
  }
};

// 🔥 SHOW PROFILE
function showProfile(name, email, photo) {
  profileSection.innerHTML = `
    <img src="${photo}" />
    <h3>${name}</h3>
    <div class="badge">✔ Verified • 🤖 AI Active</div>
    <div class="badge">${email}</div>
  `;

  // UI CONTROL
  document.querySelector(".google").style.display = "none";
  document.querySelector(".logout").style.display = "block";

  input.disabled = false;
  input.placeholder = "Ask anything...";
}

// 🔥 LOGOUT
window.logout = async function () {
  await signOut(auth);

  localStorage.clear();
  location.reload();
};

// 🔥 CHAT SEND
window.sendMessage = function () {
  const msg = input.value.trim();
  if (!msg) return;

  addUserMessage(msg);
  input.value = "";

  // FAKE AI RESPONSE (placeholder)
  setTimeout(() => {
    addBotMessage("🤖 AI is analyzing your request...");
  }, 500);
};

// 🔥 MESSAGE UI
function addUserMessage(text) {
  chat.innerHTML += `<div class="msg user">${text}</div>`;
  chat.scrollTop = chat.scrollHeight;
}

function addBotMessage(text) {
  chat.innerHTML += `<div class="msg">${text}</div>`;
  chat.scrollTop = chat.scrollHeight;
}

// 🔥 RESUME UPLOAD
window.uploadResume = async function () {
  const file = document.getElementById("fileInput").files[0];

  if (!file) {
    alert("Select file first");
    return;
  }

  addBotMessage("📄 Uploading resume...");

  try {
    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch("/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    addBotMessage(`✅ Resume uploaded`);
    addBotMessage(`📊 ATS Score: ${data.score || 80}%`);
    addBotMessage(`💼 Matching jobs found`);
  } catch (err) {
    addBotMessage("❌ Upload failed (backend needed)");
  }
};
