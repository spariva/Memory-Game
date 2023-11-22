const nam = document.getElementById("nam");
const numberPlayers = document.getElementById("numberPlayers");
const difficulty = document.getElementById("difficulty");
const start = document.getElementById("start");


start.addEventListener("click", function () {
    let nameUri = encodeURIComponent(nam.value);
    let numPlayersUri = encodeURIComponent(numberPlayers.value);
    let difficultyUri = encodeURIComponent(difficulty.value);

    window.location.href = "game.html?nam=" + nameUri + "&players=" +
        numPlayersUri + "&difficulty=" + difficultyUri;
});