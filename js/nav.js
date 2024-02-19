const currentPlayerContainer = document.querySelector('#current-player-wrapper');
const currentPlayerAction = document.querySelector('.current-player-action.down');
const currentPlayerScore = document.querySelector('.current-player-score');
const currentPlayerPlace = document.querySelector('.current-player-place');
const playersList = document.querySelector('.rating-list');
const playerTemplate = document.querySelector('#player-template').content;
const winnerTemplate = document.querySelector('#winner-template').content;
const winnersList = document.querySelector('.winners-list');

const createPlayer = (data) => {
    const { nick, place, score, bgUserToken } = data;
    const player = playerTemplate.cloneNode(true);
    player.querySelector('.nick').textContent = nick;
    player.querySelector('.place').textContent = place;
    player.querySelector('.score').textContent = score;
    // if (parseInt(place) <= 5) {
    //     player.querySelector('.avatar-img').src = `https://sz.kz/picture?bgAvatar=${bgUserToken}`
    // }

    return player;
}
const createWinner = (data) => {
    const { nick, place } = data;
    const winner = winnerTemplate.cloneNode(true);
    winner.querySelector('.nick').textContent = nick;
    winner.querySelector('.place').textContent = place;

    return winner;
}

const createAnchor = (current) => {
    if (current) {
        let players = playersList.children;
        players[current.place - 1].id = 'current-in-the-list';
        players[current.place - 1].classList.add('current-player')
        
        const anchor = document.createElement('a');
        anchor.id = 'scroll-to-me-link';
        anchor.href = '#current-in-the-list';
        
        if (current.place <= 100 && current.place > 5) {
            currentPlayerAction.append(anchor);
            currentPlayerAction.classList.add('ready');
        }
    } else {
        currentPlayerContainer.style.display = 'none';
    }
}

const onSuccessPlayers = (data, current, cb) => {
    data.forEach(element => {
        const player = cb(element);
        playersList.appendChild(player);
    });

    currentPlayerPlace.textContent = current.place;
    currentPlayerScore.textContent = current.score;
    createAnchor(current);
}

const onSuccessWinners = (data, cb) => {
    const winners = data.slice(0, 5);
    winners.forEach(element => {
        const winner = cb(element);
        winnersList.appendChild(winner);
    });
}

const onFail = (err) => {
    console.log(err);
}
const getData = async (onSuccess, onFail, cb) => {
    try {
        const response = await fetch(
            './data.json'
        );

        if (!response.ok) {
            throw new Error('Не удалось получить данные');
        }

        const resp = await response.json();
        const data = resp.data;
        const current = resp.currentUser ? resp.currentUser : false;
        onSuccess(data, current, cb);
    } catch (error) {
        onFail(error.message);
    }
};

const getPrevWinners = async (onSuccess, onFail, cb) => {
    try {
        const response = await fetch(
            './data.json'
        );

        if (!response.ok) {
            throw new Error('Не удалось получить данные');
        }

        const resp = await response.json();
        const data = resp.data;
        onSuccess(data, cb);
    } catch (error) {
        onFail(error.message);
    }
};

getData(onSuccessPlayers, onFail, createPlayer);
getPrevWinners(onSuccessWinners, onFail, createWinner);
  
