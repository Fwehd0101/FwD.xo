import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, onValue, push, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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

let playerName = '';
let currentPlayer = 'X';
let board = Array(9).fill('');
let opponentType = '';
let difficulty = 'easy';

window.startGame = function() {
  const name = document.getElementById("playerName").value.trim();
  if (name) {
    playerName = name;
    document.getElementById("screen-start").style.display = "none";
    document.getElementById("screen-mode").style.display = "block";
  }
}
window.skipName = function() {
  playerName = "user" + Math.floor(Math.random() * 10000);
  document.getElementById("screen-start").style.display = "none";
  document.getElementById("screen-mode").style.display = "block";
}
window.selectAIMode = function() {
  document.getElementById("screen-mode").style.display = "none";
  document.getElementById("screen-difficulty").style.display = "block";
}
window.startAI = function(level) {
  difficulty = level;
  opponentType = 'ai';
  initGame();
}
window.createRoom = function() { alert("🚧 قيد التطوير: ميزة الغرف الخاصة"); }
window.joinRoom = function() { alert("🚧 قيد التطوير: الانضمام برمز"); }
window.randomMatch = function() { alert("🚧 قيد التطوير: المواجهة العشوائية"); }
window.goHome = function() { location.reload(); }
window.resetGame = function() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  renderBoard();
  updateStatus();
}

function initGame() {
  document.getElementById("screen-difficulty").style.display = "none";
  document.getElementById("screen-game").style.display = "block";
  renderBoard();
  updateStatus();
}
function renderBoard() {
  const grid = document.getElementById("grid");
  grid.innerHTML = '';
  board.forEach((cell, index) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.textContent = cell;
    div.onclick = () => makeMove(index);
    grid.appendChild(div);
  });
}
function makeMove(index) {
  if (board[index] !== '') return;
  board[index] = currentPlayer;
  renderBoard();
  if (checkWin(currentPlayer)) {
    document.getElementById("gameStatus").textContent = `🏆 فاز ${playerName}!`;
    highlightWin();
  } else if (board.every(cell => cell)) {
    document.getElementById("gameStatus").textContent = "تعادل! 🤝";
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
    if (opponentType === 'ai' && currentPlayer === 'O') {
      setTimeout(aiMove, 500);
    }
  }
}
function updateStatus() {
  document.getElementById("gameStatus").textContent = `دور: ${currentPlayer}`;
}
function aiMove() {
  const move = getBestMove(difficulty);
  makeMove(move);
}
function getBestMove(level) {
  const empty = board.map((val, idx) => val === '' ? idx : null).filter(v => v !== null);
  if (level === 'easy') return empty[Math.floor(Math.random() * empty.length)];
  if (level === 'medium') return empty.length > 4 ? empty[Math.floor(Math.random() * empty.length)] : minimax(board, 'O').index;
  return minimax(board, 'O').index;
}
function minimax(newBoard, player) {
  const availSpots = newBoard.map((val, idx) => val === '' ? idx : null).filter(v => v !== null);
  const winner = checkWinner();
  if (winner === 'X') return { score: -10 };
  if (winner === 'O') return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };
  const moves = [];
  for (let i of availSpots) {
    const move = { index: i };
    newBoard[i] = player;
    const result = minimax(newBoard, player === 'O' ? 'X' : 'O');
    move.score = result.score;
    newBoard[i] = '';
    moves.push(move);
  }
  const best = player === 'O'
    ? moves.reduce((a, b) => a.score > b.score ? a : b)
    : moves.reduce((a, b) => a.score < b.score ? a : b);
  return best;
}
function checkWin(player) {
  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return wins.some(combo => combo.every(i => board[i] === player));
}
function highlightWin() {
  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (let combo of wins) {
    if (combo.every(i => board[i] === currentPlayer)) {
      document.querySelectorAll('.cell').forEach((c, i) => {
        if (combo.includes(i)) c.classList.add("win");
      });
    }
  }
}
window.sendMessage = function() {
  alert("🚧 ميزة الشات قيد التطوير");
}
