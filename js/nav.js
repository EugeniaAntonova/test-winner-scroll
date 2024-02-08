const currentPlayerContainer = document.querySelector('#current-player-wrapper');
const currentPlayerAction = document.querySelector('.current-player-action.down');
const currentPlayerScore = document.querySelector('.current-player-score');
const currentPlayerPlace = document.querySelector('.current-player-place');
const playersList = document.querySelector('.rating-list');
const playerTemplate = document.querySelector('#player-template').content;
const winnersList = document.querySelector('.winners-list');

const createPlayer = (data) => {
    const { nick, place, score } = data;
    const player = playerTemplate.cloneNode(true);
    player.querySelector('.nick').textContent = nick;
    player.querySelector('.place').textContent = place;
    player.querySelector('.score').textContent = score;

    return player;
}

const upButton = document.querySelector('.current-player-action.up');

window.onscroll = () => {
  if (window.scrollY > 500) {
    upButton.classList.add('ready');
  } else {
    upButton.classList.remove('ready');
  }
};

const createAnchor = (current) => {
    let players = playersList.children;
    players[current.place - 1].id = 'current-in-the-list';
    players[current.place - 1].classList.add('current-player')
    
    const anchor = document.createElement('a');
    anchor.id = 'scroll-to-me-link';
    anchor.href = '#current-in-the-list';

    if (current.place <= 100 && current.place > 5) {
        currentPlayerAction.append(anchor);
        currentPlayerAction.classList.add('ready');
        currentPlayerAction.addEventListener('click', () => {
            currentPlayerAction.classList.remove('ready'); 
        });
        window.addEventListener('scroll', () => {
            if (window.scrollY < 500) {
                currentPlayerAction.classList.add('ready'); 
            }
        })
    }
}


const onSuccess = (data, current, cb) => {
    data.forEach(element => {
        const player = cb(element);
        playersList.appendChild(player);
    });

    const winners = data.slice(0,5);
    winners.forEach(item => {
        const winner = cb(item);
        winnersList.appendChild(winner);
    })

    currentPlayerPlace.textContent = current.place;
    currentPlayerScore.textContent = current.score;
    createAnchor(current);
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
        const current = resp.currentUser;
        onSuccess(data, current, cb);
    } catch (error) {
        onFail(error.message);
    }
};

getData(onSuccess, onFail, createPlayer)
  
