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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let userId, currentRoom, isPlayerX = true, gameActive = true;

// ============== إدارة الاتصال ==============
firebase.auth().signInAnonymously().then((userCredential) => {
  userId = userCredential.user.uid;
  db.ref(`presence/${userId}`).set(true);
  db.ref(`presence/${userId}`).onDisconnect().remove();
});

// تحديث عدد المتصلين
db.ref("presence").on("value", (snapshot) => {
  document.querySelector("#online-users span").textContent = snapshot.numChildren();
});

// ============== نظام المباريات ==============
function createPrivateRoom() {
  currentRoom = Math.random().toString(36).slice(2, 7).toUpperCase();
  db.ref(`rooms/${currentRoom}`).set({
    players: { [userId]: localStorage.getItem("xo_name") || "مجهول" },
    board: ["", "", "", "", "", "", "", "", ""],
    currentPlayer: "X",
    status: "waiting"
  });
  joinRoom(currentRoom);
  alert(`🔒 كود الغرفة: ${currentRoom}\nشاركه مع الخصم!`);
}

function joinRandomMatch() {
  db.ref("rooms").orderByChild("status").equalTo("waiting").once("value", (snapshot) => {
    const rooms = snapshot.val();
    if (rooms) {
      const roomId = Object.keys(rooms)[0];
      joinRoom(roomId);
    } else {
      createPrivateRoom();
    }
  });
}

function joinRoom(roomId) {
  currentRoom = roomId;
  const roomRef = db.ref(`rooms/${roomId}`);
  
  roomRef.on("value", (snapshot) => {
    const room = snapshot.val();
    if (!room) return;

    // تحديث اللوحة
    updateBoardUI(room.board);
    
    // إدارة الأدوار
    const players = Object.keys(room.players);
    isPlayerX = (players[0] === userId);
    document.getElementById("player-info").textContent = 
      `لاعب ${isPlayerX ? 'X' : 'O'} - ${room.players[userId]}`;

    // التحكم في الدور
    if (room.currentPlayer === (isPlayerX ? "X" : "O") && gameActive) {
      document.getElementById("status-bar").textContent = "دورك!";
    } else {
      document.getElementById("status-bar").textContent = "انتظر الخصم...";
    }

    // التحقق من الفوز
    if (room.status === "ended") {
      gameActive = false;
      document.getElementById("status-bar").textContent = 
        room.winner ? `الفائز: ${room.winner}` : "تعادل!";
    }
  });

  // إظهار لوحة اللعبة
  document.querySelector(".mode-selection").style.display = "none";
  document.querySelector(".game-board").style.display = "block";
  document.querySelector(".chat-section").style.display = "block";
}

// ============== ذكاء اصطناعي (Minimax) ==============
function playAI() {
  currentRoom = "AI_MATCH";
  isPlayerX = true;
  gameActive = true;
  const board = Array(9).fill("");
  
  document.querySelector(".mode-selection").style.display = "none";
  document.querySelector(".game-board").style.display = "block";
  document.getElementById("player-info").textContent = "أنت ضد الذكاء الاصطناعي!";
  
  // تهيئة الأحداث
  document.querySelectorAll("#board div").forEach((cell, index) => {
    cell.onclick = () => makeMove(index, "X");
  });
}

function makeMove(index, player) {
  if (!gameActive || (player === "X" && !isPlayerX)) return;
  
  const cell = document.querySelector(`#board div:nth-child(${index + 1})`);
  if (cell.textContent !== "") return;
  
  cell.textContent = player;
  if (checkWin()) {
    gameActive = false;
    document.getElementById("status-bar").textContent = player === "X" ? "فزت!" : "خسرت!";
    return;
  }
  
  if (player === "X") aiMove();
}

function aiMove() {
  const bestMove = minimax([...document.querySelectorAll("#board div")].map(c => c.textContent), "O").index;
  setTimeout(() => makeMove(bestMove, "O"), 500);
}

function minimax(board, player) {
  const availSpots = board.reduce((acc, val, idx) => val === "" ? [...acc, idx] : acc, []);
  
  if (checkWin(board, "X")) return { score: -10 };
  if (checkWin(board, "O")) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];
  for (const spot of availSpots) {
    const newBoard = [...board];
    newBoard[spot] = player;
    const result = minimax(newBoard, player === "O" ? "X" : "O");
    moves.push({ index: spot, score: result.score });
  }

  return player === "O" ? 
    Math.max(...moves.map(m => m.score)) : 
    Math.min(...moves.map(m => m.score));
}

function checkWin(board = [...document.querySelectorAll("#board div")].map(c => c.textContent), player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];
  return winPatterns.some(pattern => pattern.every(idx => board[idx] === player));
}

// ============== دوال مساعدة ==============
function startGame() {
  const name = document.getElementById("username").value.trim() || `User${Math.floor(Math.random() * 1000)}`;
  localStorage.setItem("xo_name", name);
  document.querySelector(".start-screen").style.display = "none";
  document.querySelector(".mode-selection").style.display = "block";
}

function skipName() { startGame(); }

function resetGame() {
  if (currentRoom === "AI_MATCH") {
    document.querySelectorAll("#board div").forEach(cell => cell.textContent = "");
    gameActive = true;
    document.getElementById("status-bar").textContent = "";
  } else if (currentRoom) {
    db.ref(`rooms/${currentRoom}`).update({ board: ["", "", "", "", "", "", "", "", ""], status: "playing" });
  }
}

function goHome() { location.reload(); }

// ============== نظام الدردشة ==============
db.ref("messages").on("child_added", (snapshot) => {
  const { sender, text } = snapshot.val();
  const chatDiv = document.getElementById("chat-messages");
  chatDiv.innerHTML += `<div><b>${sender}:</b> ${text}</div>`;
  chatDiv.scrollTop = chatDiv.scrollHeight;
});

function sendMessage() {
  const input = document.getElementById("chat-input");
  const message = input.value.trim();
  if (message) {
    db.ref("messages").push().set({
      sender: localStorage.getItem("xo_name") || "مجهول",
      text: message,
      timestamp: Date.now()
    });
    input.value = "";
  }
}
