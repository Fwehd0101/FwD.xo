// Retrieve or set username
let username = localStorage.getItem('xoUsername') || '';
let playerSymbol, gameMode, roomRef, boardRef, chatRef, friendsRef;
const board = Array(9).fill('');

function saveUsername(){
  const inp = document.getElementById('usernameInput').value.trim();
  if(inp){username=inp; localStorage.setItem('xoUsername',username);}
  showMode();
}
function skipUsername(){username='user'+Math.floor(Math.random()*10000);localStorage.setItem('xoUsername',username);showMode();}
function showMode(){
  document.getElementById('welcome-screen').classList.add('hidden');
  document.getElementById('mode-screen').classList.remove('hidden');
}
function backToMenu(){
  if(roomRef) roomRef.off(); if(chatRef) chatRef.off();
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('mode-screen').classList.remove('hidden');
}
function startAIGame(){
  gameMode='ai'; playerSymbol='X';
  document.getElementById('mode-screen').classList.add('hidden');
  startGame();
}
function createRoom(){
  gameMode='room'; playerSymbol='X';
  const code=Math.random().toString(36).substr(2,6).toUpperCase();
  roomRef=db.ref('rooms/'+code);
  roomRef.set({board:Array(9).fill(''),turn:'X',players:{X:username}});
  joinRoomListeners(code);
  document.getElementById('roomCodeInput').value=code;
  startGame();
}
function joinRoom(){
  const code=document.getElementById('roomCodeInput').value.trim();
  roomRef=db.ref('rooms/'+code);
  roomRef.once('value',snap=>{
    if(snap.exists()&& !snap.val().players.O){
      gameMode='room'; playerSymbol='O';
      roomRef.update({['players/O']:username});
      joinRoomListeners(code);
      startGame();
    } else alert('رمز غير صالح أو الغرفة ممتلئة');
  });
}
function randomMatch(){
  gameMode='random';
  document.getElementById('waiting').classList.remove('hidden');
  const queueRef=db.ref('queue');
  const myRef=queueRef.push(username);
  queueRef.on('value',snap=>{
    const q=snap.val();
    const keys=Object.keys(q||{});
    if(keys.length>=2){
      const [a,b]=keys; const room=a+b;
      queueRef.remove();
      roomRef=db.ref('rooms/'+room);
      roomRef.set({board:Array(9).fill(''),turn:'X',players:{X:q[a],O:q[b]}});
      playerSymbol = q[a]===username?'X':'O';
      joinRoomListeners(room);
      document.getElementById('waiting').classList.add('hidden');
      startGame();
    }
  });
}
function joinRoomListeners(room){
  boardRef=db.ref('rooms/'+room+'/board');
  turnRef=db.ref('rooms/'+room+'/turn');
  chatRef=db.ref('rooms/'+room+'/chat');
  friendsRef=db.ref('rooms/'+room+'/friends');
  boardRef.on('value',snap=>{Object.assign(board,snap.val()); renderBoard();});
  turnRef.on('value',snap=>document.getElementById('turnIndicator').innerText=snap.val());
  chatRef.on('child_added',snap=> {
    const m=snap.val(); const d=document.createElement('div');
    d.textContent=`${m.user}: ${m.text}`;document.getElementById('messages').append(d);
  });
  friendsRef.on('child_added',snap=>alert('Friend request from '+snap.val()));
}
function startGame(){
  document.getElementById('mode-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  document.getElementById('playerName').innerText=username;
  renderBoard();
}
function renderBoard(){
  const br=document.getElementById('board'); br.innerHTML='';
  board.forEach((v,i)=>{const c=document.createElement('div');c.textContent=v;c.onclick=()=>move(i);br.append(c);});
}
function move(i){
  if(gameMode==='ai'){
    if(!board[i]){board[i]=playerSymbol;checkEnd(); setTimeout(aiMove,500);}
  } else {
    if(!board[i] && playerSymbol===document.getElementById('turnIndicator').innerText){
      board[i]=playerSymbol; boardRef.set(board); turnRef.set(playerSymbol==='X'?'O':'X'); checkEnd();
    }
  }
}
function aiMove(){
  const empty=board.map((v,i)=>v===''?i:null).filter(v=>v!=null);
  const choice=empty[Math.floor(Math.random()*empty.length)];
  board[choice]=playerSymbol==='X'?'O':'X'; renderBoard(); checkEnd();
}
function checkEnd(){
  const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  let win=wins.find(c=>c.every(i=>board[i]&&board[i]===board[c[0]]));
  if(win){alert('Winner '+board[win[0]]); return;}
  if(board.every(v=>v)) alert('Draw');
}
function resetGame(){roomRef && roomRef.set({board:Array(9).fill(''),turn:'X',players:roomRef.key}); renderBoard();}
function sendMessage(){const t=document.getElementById('chatInput').value; chatRef.push({user:username,text:t});document.getElementById('chatInput').value='';}
function sendFriendRequest(){friendsRef.push(username);}
