import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_Ga-Mi9EPdi9gtJWkXA7fgqea1P4OE54",
  authDomain: "dbsolutions-career.firebaseapp.com",
  projectId: "dbsolutions-career",
  appId: "1:672960239523:web:d883210f329cf552e5ec16"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// LOGIN
window.googleLogin = async function(){
  try{
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const data = {
      name: user.displayName,
      email: user.email,
      photo: user.photoURL
    };

    localStorage.setItem("user", JSON.stringify(data));

    showProfile(data);
    enableChat();

    document.getElementById("chat").innerHTML = "";
    addMsg("✅ Welcome " + data.name);

    document.getElementById("logoutBtn").style.display = "block";

  }catch(err){
    alert("Login failed ❌");
  }
};

// ENABLE CHAT
function enableChat(){
  document.getElementById("chat").classList.remove("disabled");

  const input = document.getElementById("messageInput");
  input.disabled = false;
  input.placeholder = "Ask anything...";
}

// PROFILE
function showProfile(user){
  document.getElementById("profileSection").innerHTML = `
    <div class="profile glass">
      <img src="${user.photo}">
      <div class="profile-name">${user.name}</div>
      <div class="badge">✔ Verified • 🤖 AI Active</div>
      <div class="badge">${user.email}</div>
    </div>
  `;
}

// MESSAGE
function addMsg(text,type="ai"){
  const chat = document.getElementById("chat");
  chat.innerHTML += `<div class="msg ${type}">${text}</div>`;
  chat.scrollTop = chat.scrollHeight;
}

// SEND MESSAGE
window.sendMessage = function(){
  if(!localStorage.getItem("user")) return;

  const input = document.getElementById("messageInput");

  if(!input.value.trim()) return;

  addMsg(input.value,"user");
  input.value = "";

  setTimeout(()=>{
    addMsg("🤖 AI is analyzing your request...");
  },800);
};

// ENTER KEY FIX
document.addEventListener("DOMContentLoaded", ()=>{
  const input = document.getElementById("messageInput");

  input.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
      sendMessage();
    }
  });
});

// UPLOAD
window.uploadResume = function(){

  if(!localStorage.getItem("user")){
    alert("Login first");
    return;
  }

  const file = document.getElementById("fileInput").files[0];
  if(!file) return alert("Select file");

  addMsg("📄 Resume received");

  setTimeout(()=>{
    addMsg("📊 ATS Score: 82%");
    addMsg("🎯 Top Roles: Customer Support, Sales Executive");
    addMsg("💼 Matching jobs found");
  },1000);
};

// LOGOUT
document.getElementById("logoutBtn").onclick = function(){
  localStorage.removeItem("user");
  location.reload();
};

// AUTO LOAD
window.onload = function(){
  const user = JSON.parse(localStorage.getItem("user"));

  if(user){
    showProfile(user);
    enableChat();

    document.getElementById("logoutBtn").style.display = "block";

    document.getElementById("chat").innerHTML = "";
    addMsg("👋 Welcome back " + user.name);
  }
};