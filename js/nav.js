const playersListWrapper = document.querySelector('.winners-list-wrapper');
const currentPlayerContainer = document.querySelector('#current-player-wrapper');
const playersList = document.querySelector('.winner-list');
const playerTemplate = document.querySelector('#player-template').content;

const createPlayer = (data) => {
    const { nick, place, score } = data;
    const player = playerTemplate.cloneNode(true);
    player.querySelector('.nick').textContent = nick;
    player.querySelector('.place').textContent = place;
    player.querySelector('.score').textContent = score;

    return player;
}

const playersAmountControl = (current) => {
    const playersLoader = document.querySelector('.show-more')
    const playersHider = document.querySelector('.show-less')
    const INCREMENT = 5;
    let playersShown = 0;
    let playersToShowNext = INCREMENT;
    let players = playersList.children;

    players = [...players];
    players.slice(INCREMENT).forEach((player) => player.classList.add('hidden'));
    playersShown += INCREMENT;
    playersToShowNext += INCREMENT;
    playersLoader.classList.remove('hidden');

    const restoreInitialState = () => {
        players.slice(INCREMENT).forEach((player) => player.classList.add('hidden'));
        playersShown = INCREMENT;
        playersToShowNext = INCREMENT * 2;
        document.querySelector('p.current-player').classList.remove('hidden');
        playersLoader.classList.remove('hidden');
        playersHider.classList.add('hidden');
        playersHider.removeEventListener('click', restoreInitialState);
    }

    const showMoreplayers = () => {
        players.slice(playersShown, playersToShowNext).forEach((player) => {
            player.classList.remove('hidden');
        });
        playersShown += INCREMENT;
        playersToShowNext += INCREMENT;
        const hiddenPlayers = playersList.getElementsByClassName('hidden');
        if (hiddenPlayers.length === 0) {
            playersLoader.classList.add('hidden');
            playersHider.classList.remove('hidden');
            playersHider.addEventListener('click', restoreInitialState);
        }
    };

    let currentPlace = current.place;
    players[currentPlace - 1].classList.add('current-player');
    if (currentPlace > 5) {
        const currentPlayer = document.createElement('p');
        currentPlayer.innerHTML = `
        <span class="nick">${current.nick}</span>
        <span class="place">${current.place}</span>
        <span class="score">${current.score}</span>
        `;

        currentPlayer.classList.add('current-player');
        currentPlayerContainer.append(currentPlayer)

        if (currentPlace <= 100) {
            const anchor = document.createElement('a');
            anchor.classList.add('current-player--ancor');
            anchor.href = '#current-in-the-list';
            currentPlayer.append(anchor);

            let scrollTimes = Math.floor((currentPlace - playersShown) / INCREMENT);
            if ((currentPlace - playersShown) % INCREMENT !== 0) {
                scrollTimes += 1;
            }

            
            function scrollToMe() {
                players.slice(playersShown, scrollTimes * INCREMENT + INCREMENT).forEach((player) => {
                    player.classList.remove('hidden');
                });
                playersShown += (scrollTimes * INCREMENT);
                playersToShowNext = (playersShown + INCREMENT);
                const hiddenPlayers = playersList.getElementsByClassName('hidden');
                if (hiddenPlayers.length === 0) {
                    playersLoader.classList.add('hidden');
                    playersHider.classList.remove('hidden');
                    playersHider.addEventListener('click', restoreInitialState);
                }

                // currentPlayer.classList.add('hidden');
                players[currentPlace - 1].classList.add('current-player');
                players[currentPlace - 1].id = 'current-in-the-list';
            }

            anchor.addEventListener('click', scrollToMe)
        }
    }

    playersLoader.addEventListener('click', showMoreplayers);

};


const onSuccess = (data, current, cb) => {
    data.forEach(element => {
        const player = cb(element);
        playersList.appendChild(player);
    });

    playersAmountControl(current);
}

const onFail = (err) => {
    console.log(err);
}
const getData = async (onSuccess, onFail, cb) => {
    try {
        const response = await fetch(
            '/data.json'
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
  
//   cards.forEach((card) => { 
//     observer.observe(card);
//   })

//   {
//     "nick": "",
//     "bgUserToken": "7BFDC6FFD16E86A9AB23170673186613F378FBD10B3BA2A2918764C7349124AD",
//     "place": 87,
//     "score": 50,
//     "lastDate": "09.03.2023 14:10:08"
// },