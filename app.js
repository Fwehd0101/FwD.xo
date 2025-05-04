
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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function startGame() {
  const name = document.getElementById("username").value.trim();
  if (name.length === 0) return alert("الرجاء إدخال اسم");
  localStorage.setItem("xo_name", name);
  document.querySelector(".start-screen").style.display = "none";
  document.querySelector(".mode-selection").style.display = "block";
}

function skipName() {
  const name = "user" + Math.floor(Math.random() * 10000);
  localStorage.setItem("xo_name", name);
  document.querySelector(".start-screen").style.display = "none";
  document.querySelector(".mode-selection").style.display = "block";
}

function playAI() {
  alert("سيتم تفعيل اللعب ضد الكمبيوتر قريبًا 🚀");
}

function createRoom() {
  alert("🛠️ Placeholder: إنشاء غرفة خاصة برمز مخصص");
}

function joinRandom() {
  alert("🛠️ Placeholder: البحث عن مواجهة عشوائية");
}

function resetGame() {
  alert("🔄 Placeholder: إعادة اللعبة");
}

function goHome() {
  location.reload();
}

function sendMessage() {
  const input = document.getElementById("chat-input");
  if (input.value.trim()) {
    // Placeholder for sending message
    alert("💬 تم إرسال: " + input.value);
    input.value = "";
  }
}
