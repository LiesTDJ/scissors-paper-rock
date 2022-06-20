const player = {
    host: false,
    playedCell: "",
    roomId: null,
    username: "",
    socketId: "",
    turn: true,
    win: false,
    equality: false
}

const enemyPlayerData = {
    host: false,
    playedCell: "",
    roomId: null,
    username: "",
    socketId: "",
    turn: true,
    win: false,
    equality: false
}

const socket = io();

const usernameInput = document.getElementById('username');
const userCard = document.getElementById('user-card');
const waitingArea = document.getElementById('waiting-area');
const roomsCard = document.getElementById('rooms-card');
const roomsList = document.getElementById('rooms-list');
const restartArea = document.getElementById('restart-area');
const gameCard = document.getElementById('game-card');
const turnMessage = document.getElementById('turn-message');

let enemyPlayedCell = "";

socket.emit('get rooms');
socket.on('list rooms', (rooms) => {
    let html = "";

    if (rooms.length > 0) {
        rooms.forEach(room => {
            if (room.players.length !== 2) {
                html += `<li class="list-group-item d-flex justify-content-between">
                            <p class="p-0 m-0 flex-grow-1 fw-bold">Salon de ${room.players[0].username} - ${room.id}</p>
                            <button class="btn btn-sm btn-mine join-room" data-room="${room.id}">Rejoindre</button>
                        </li>`;
            }
        });
    }

    if (html !== "") {
        roomsCard.classList.remove('d-none');
        roomsList.innerHTML = html;

        for (const element of document.getElementsByClassName('join-room')) {
            element.addEventListener('click',  joinRoom, false)
        }
    }
});

$("#form").on('submit', function (event) {
    event.preventDefault();

    player.username = usernameInput.value;
    player.host = true;
    enemyPlayerData.host = false;
    // player.turn = true;
    player.socketId = socket.id;

    userCard.hidden = true;
    waitingArea.classList.remove('d-none');
    roomsCard.classList.add('d-none');

    socket.emit('playerData', player);
});

$(".cell").on('click', function () {
    const playedCell = this.getAttribute('id');

    player.playedCell = playedCell;
    player.turn = false;

    gameCard.classList.add('d-none');

    socket.emit('play', player);
});

socket.on('start game', (players) => {
    startGame(players);
});


socket.on('play', (enemyPlayer) => {

    if (enemyPlayer.host !== player.host) {
        enemyPlayerData.playedCell = enemyPlayer.playedCell;
        enemyPlayerData.turn = false;
    }

    if (player.turn && !c.turn) {
        SetTurnMessage('alert-success', 'alert-info', `L’adversaire <b>${enemyPlayerData.username}</b> attend que vous jouiez !</b>.`);
    } else if (!player.turn && enemyPlayerData.turn) {
        SetTurnMessage('alert-success', 'alert-info', `L’adversaire <b>${enemyPlayerData.username}</b> n'a pas encore joué !</b>.`);
    } else if (!player.turn && !enemyPlayerData.turn) {
        if (calculateWin(player, enemyPlayerData)) {
            SetTurnMessage('alert-success', 'alert-info', `Vous avez battu l’adversaire <b>${enemyPlayerData.username}</b>. Bien jouer !`);
        } else if (calculateWin(enemyPlayerData, player)) {
            SetTurnMessage('alert-success', 'alert-info', `Vous avez été battu par l’adversaire <b>${enemyPlayerData.username}</b>. Prenez votre revanche !`);
        } else if (!calculateWin(player, enemyPlayerData) && !calculateWin(enemyPlayerData, player)) {
            SetTurnMessage('alert-success', 'alert-info', `Vous êtes à égalité avec l’adversaire <b>${enemyPlayerData.username}</b>.`);
        }
    }

})

function startGame(players) {
    restartArea.classList.add('d-none');
    waitingArea.classList.add('d-none');
    gameCard.classList.remove('d-none');
    turnMessage.classList.remove('d-none');

    const enemyPlayer = players.find(p => p.socketId != player.socketId);
    enemyPlayerData.username = enemyPlayer.username;
    enemyPlayerData.socketId = enemyPlayer.socketId;
    enemyPlayerData.roomId = enemyPlayer.roomId;

    SetTurnMessage('alert-info', 'alert-success', 'A toi de jouer !');
}

function SetTurnMessage(classToRemove, classToAdd, html) {
    turnMessage.classList.remove(classToRemove);
    turnMessage.classList.add(classToAdd);
    turnMessage.innerHTML = html;
}

function calculateWin(dataPlayer, dataEnemy) {
    if (dataPlayer.turn || dataEnemy) {
        return;
    }

    let playerMove = dataPlayer.playedCell;
    let enemyMove = dataEnemy.playedCell;

    switch (playerMove) {
        case 'pierre':
            if (enemyMove == 'pierre') {
                player.equality = true;
                enemyPlayerData.equality = true;
                return false;
            } else if (enemyMove == 'feuille') {
                player.win = false;
                enemyPlayerData.win = true;
                return false;
            } else if (enemyMove == 'ciseaux') {
                player.win = true;
                enemyPlayerData.win = false;
                return true;
            }
            break;
            
        case 'feuille':
            if (enemyMove == 'feuille') {
                player.equality = true;
                enemyPlayerData.equality = true;
                return false;
            } else if (enemyMove == 'ciseaux') {
                player.win = false;
                enemyPlayerData.win = true;
                return false;
            } else if (enemyMove == 'pierre') {
                player.win = true;
                enemyPlayerData.win = false;
                return true;
            }
            break;
            
        case 'ciseaux':
            if (enemyMove == 'ciseaux') {
                player.equality = true;
                enemyPlayerData.equality = true;
                return false;
            } else if (enemyMove == 'pierre') {
                player.win = false;
                enemyPlayerData.win = true;
                return false;
            } else if (enemyMove == 'feuille') {
                player.win = true;
                enemyPlayerData.win = false;
                return true;
            }
            break;
    }
}


const joinRoom = function () {
    if (usernameInput.value !== "") {
        player.username = usernameInput.value;
        player.socketId = socket.id;
        player.roomId = this.dataset.room;

        enemyPlayerData.host = true;

        socket.emit('playerData', player);
        userCard.hidden = true;
        waitingArea.classList.remove('d-none');
        roomsCard.classList.add('d-none');
    }
}