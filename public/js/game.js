
document.addEventListener('DOMContentLoaded', function () {
// Empiezo con los datos del index:
const name = document.getElementById("name");
const numberPlayers = document.getElementById("numberPlayers");
const difficulty = document.getElementById("difficulty");
const generateGameBtn = document.getElementById("generateGameBtn");
console.log(difficulty);

let music = document.getElementById("music");
const musicButton = document.getElementById("musicBtn");
const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    pause: document.getElementById('pause'),//Lo cojo por Id porque no lo añado dinámicamente como el resto de elementos
    win: document.querySelector('.win')
}

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
}

const playMusic = () => {
    // if (music.paused) {
    //     music.play();

    // } else {
    //     music.pause();
    // }
    return music.paused ? music.play() : music.pause();
}

musicButton.addEventListener('click', playMusic);

//Ni idea de esto pero he copiado la implementación de este algoritmo https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
const shuffle = array => {
    const clonedArray = [...array];

    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        const original = clonedArray[index];

        clonedArray[index] = clonedArray[randomIndex];
        clonedArray[randomIndex] = original;
    }

    return clonedArray;
}

const pickRandom = (array, items) => {
    const clonedArray = [...array];
    const randomPicks = [];

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length);
        
        randomPicks.push(clonedArray[randomIndex]);
        clonedArray.splice(randomIndex, 1);
    }

    return randomPicks;
}

//Aquí genero el juego dinámicamente dependiendo del size. He añadido un if para que no se pueda generar un tablero impar.
const generateGame = () => {
    let dimensions = selectors.board.getAttribute('size');

    if (dimensions % 2 !== 0) {
        alert("It has to be even in order to match every couple.");
    }
    
    const emojis = ['🦷', '👽', '🦊', '🦀', '☀️', '⚧️', '⛈️', '🎓', '🎪', '🌍'];
    const difficultEmojis = ['🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔'];
    const chars = 'https://picsum.photos/200';
    let selectedEmojis = "";
    
    switch (difficulty.value) { 
        case "easy":
            dimensions = 2;
            selectedEmojis = emojis;
            break;
        case "medium":
            dimensions = 4;
            selectedEmojis = emojis;
            break; 
        case "hard":
            dimensions = 4;
            selectedEmojis = chars;
            break;
        case "impossible":
            dimensions = 4;
            selectedEmojis = difficultEmojis;
            break;
        default:
            dimensions = 2;
            selectedEmojis = emojis;
            break;
    }
    
    console.log(selectedEmojis);
    let picks = pickRandom(selectedEmojis, (dimensions * dimensions) / 2); 
    let items = shuffle([...picks, ...picks]);
    let cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
       </div>
    `
    //Aquí debería cambiarlo por un fragmento para optimizarlo creo.
    let parser = new DOMParser().parseFromString(cards, 'text/html');

    selectors.board.replaceWith(parser.querySelector('.board'));
}

const startGame = () => {
    state.gameStarted = true;

    state.loop = setInterval(() => {
        //Pauso el tiempo si está en pause.
        if(!selectors.pause.className.includes('paused')){
        state.totalTime++;
        }
        selectors.moves.innerText = `${state.totalFlips} moves`;
        selectors.timer.innerText = `🕓 ${state.totalTime} sec`;
    }, 1000);
}


const pause = () => {
    if (state.gameStarted != true) {
        startGame();
    }
    selectors.pause.classList.toggle('paused');
    selectors.pause.innerText = (selectors.pause.innerText === 'Resume !' ? 'Pause !' : 'Resume !');
}

selectors.pause.addEventListener('click', pause);

const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped');
    })

    state.flippedCards = 0;
}

const flipCard = card => {
    state.flippedCards++;
    state.totalFlips++;
    
    if (selectors.pause.className.includes('paused')) {
        pause();
    }

    if (!state.gameStarted) {
        startGame();
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped');
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)');

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched');
            flippedCards[1].classList.add('matched');
            let sonido = new Audio("../assets/audio/match.wav");
            sonido.play();
        }

        setTimeout(() => {
            flipBackCards();
        }, 1000)
    }

    // El juego acaba cuando no quedan cartas sin voltear.
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            let sonido = new Audio("../assets/audio/victory.wav");
            sonido.play();
            pause();
            //Victory gif: TODO reescalate snail in small screens.
            let img = document.createElement('img');
            img.src = 'https://example.com/path-to-your-gif.gif';
            document.body.appendChild(img);
            if(state.totalTime > 10 && difficulty.value === "easy"){
                selectors.win.innerHTML += `
                <span class="win-text">
                    You are a <span class="highlight">beginner  ${name.value}</span>
                    Try to do it in less than 10 seconds next time!
                </span>
                <div style="width:100%;height:0;padding-bottom:100%;position:relative;"><iframe src="https://giphy.com/embed/b4n53QFvxlA26woFsl" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/snail-slug-cute-b4n53QFvxlA26woFsl">via GIPHY</a></p>
            `
            } else {
                selectors.win.innerHTML = `
                <span class="win-text">
                    Congrats ${name.value} <br />
                    <span class="highlight">${state.totalFlips}</span> moves<br />
                    under <span class="highlight">${state.totalTime}</span> seconds
                </span>
            `
            }
            selectors.boardContainer.classList.add('flipped');
            clearInterval(state.loop);
        }, 1000)
    }
}


const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target;
        const eventParent = eventTarget.parentElement;

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent);
            } else if (eventTarget === selectors.pause && !eventTarget.className.includes('paused')) {
                startGame();
        } else if (eventTarget === generateGameBtn) {
            console.log(difficulty.value);
            eventParent.parentElement.parentElement.style.display = "none"; //Luego soluciono lo del bisabuelo.
            generateGame();
        }
    })
}


attachEventListeners();
});