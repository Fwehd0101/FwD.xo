
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDB8NoMrvM9dSyND1CASAFImysYYkIuJFQ",
  authDomain: "xo-game-98dd9.firebaseapp.com",
  databaseURL: "https://xo-game-98dd9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "xo-game-98dd9",
  storageBucket: "xo-game-98dd9.appspot.com",
  messagingSenderId: "682663768536",
  appId: "1:682663768536:web:42c950c94d01ffc72d42ad",
  measurementId: "G-WGMLSX68GK"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let username = "";

window.startWithName = function () {
  const input = document.getElementById("usernameInput").value;
  if (input.trim() !== "") {
    username = input.trim();
  } else {
    alert("الرجاء إدخال اسم.");
    return;
  }
  document.querySelector(".welcome-screen").style.display = "none";
  document.getElementById("gameModes").style.display = "block";
}

window.skipName = function () {
  username = "user" + Math.floor(Math.random() * 10000);
  document.querySelector(".welcome-screen").style.display = "none";
  document.getElementById("gameModes").style.display = "block";
}

window.startAIGame = function () {
  document.getElementById("gameModes").style.display = "none";
  document.getElementById("gameBoard").style.display = "block";
  document.getElementById("statusBar").innerText = "الدور: " + username;
}

window.restartGame = function () {
  alert("سيتم إعادة تعيين اللعبة.");
}

window.goHome = function () {
  location.reload();
}

window.addFriend = function () {
  alert("سيتم تفعيل ميزة الأصدقاء قريباً.");
}
