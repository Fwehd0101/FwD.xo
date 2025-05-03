
let playerName = '';
function startGame() {
  const name = document.getElementById("playerName").value.trim();
  if (name) {
    playerName = name;
    document.querySelector(".container").style.display = "none";
    document.getElementById("gameModes").style.display = "block";
  } else {
    alert("يرجى إدخال اسمك أو استخدام خيار التخطي.");
  }
}

function skipName() {
  playerName = "user" + Math.floor(Math.random() * 10000);
  document.querySelector(".container").style.display = "none";
  document.getElementById("gameModes").style.display = "block";
}

function startVsAI() {
  document.getElementById("gameModes").style.display = "none";
  document.getElementById("gameBoard").style.display = "block";
  document.getElementById("playerInfo").textContent = `👤 اللاعب: ${playerName}`;
  createBoard();
}

function createBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.addEventListener("click", () => handleClick(cell), { once: true });
    board.appendChild(cell);
  }
}

function handleClick(cell) {
  cell.textContent = "X";
  cell.style.background = "#d4ffd4";
  // AI bot placeholder: move after delay
  setTimeout(() => aiMove(), 500);
}

function aiMove() {
  const cells = document.querySelectorAll("#board div");
  const empty = [...cells].filter(c => !c.textContent);
  if (empty.length === 0) return;
  const choice = empty[Math.floor(Math.random() * empty.length)];
  choice.textContent = "O";
  choice.style.background = "#ffd4d4";
}

function resetGame() {
  createBoard();
}

function goBack() {
  document.getElementById("gameBoard").style.display = "none";
  document.getElementById("gameModes").style.display = "block";
}
