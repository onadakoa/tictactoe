
/** @type {PlayerController[]} */
const PLAYER_CLASS = {
    0: HumanPlayer,
    1: RandomPlayer,
    2: MiniMaxPlayer
}


/**@type {HTMLDivElement} */
const namePlateA = document.querySelector("#A")
/**@type {HTMLDivElement} */
const namePlateB = document.querySelector("#B")


/** @type {HTMLSelectElement} */
const playerAType = document.querySelector("#playerAType")
/** @type {HTMLDivElement} */
const playerAName = document.querySelector("#playerAName")
/** @type {HTMLSelectElement} */
const playerBType = document.querySelector("#playerBType")
/** @type {HTMLDivElement} */
const playerBName = document.querySelector("#playerBName")


/**@type {HTMLDivElement} */
const startButton = document.querySelector(".start>div")
/**@type {HTMLDivElement} */
const statisticsButton = document.querySelector(".statistics>div")


/**@type {HTMLDivElement} */
const endMask = document.querySelector(".endMask")
/**@type {HTMLDivElement} */
const statusTitle = document.querySelector("#statusTitle")
/**@type {HTMLSpanElement} */
const statusTime = document.querySelector("#statusTime")
/**@type {HTMLDivElement} */
const statusClose = document.querySelector("#statusClose")
statusClose.onclick = () => { window.location.reload() }

let currentPlayers = {
    0: {
        class_id: 0,
        name: "pA"
    },
    1: {
        class_id: 2,
        name: "minimax"
    }
}

/** @type {BoardManager} */
let currentBoard = undefined;

function updateUI() {
    namePlateA.innerText = currentPlayers[0].name;
    namePlateB.innerText = currentPlayers[1].name;

    playerAType.value = currentPlayers[0].class_id;
    playerBType.value = currentPlayers[1].class_id;

    playerAName.value = currentPlayers[0].name;
    playerBName.value = currentPlayers[1].name;
}

function translateMs(timestamp) {
    let tmp = new Date(timestamp)
    // let ms = tmp.getMilliseconds();
    let s = tmp.getSeconds();
    let min = tmp.getMinutes()

    let out = ""
    if (min != 0) out += `${min}min `
    if (s != 0) out += `${s}s`
    return out.trim();
}
function setEndTitle(title, time_ms) {
    statusTitle.innerText = title;
    statusTime.innerText = translateMs(time_ms)
    endMask.classList.remove("noDisplay")
}

playerAName.addEventListener("keyup", () => {
    namePlateA.innerText = playerAName.value;
    currentPlayers[0].name = playerAName.value
})
playerBName.addEventListener("keyup", () => {
    namePlateB.innerText = playerBName.value;
    currentPlayers[1].name = playerBName.value
})
playerAType.addEventListener("change", () => {
    currentPlayers[0].class_id = playerAType.value;
})
playerBType.addEventListener("change", () => {
    currentPlayers[1].class_id = playerBType.value;
})

/** @param {BoardManager} Board */
const gameEnd = (Board) => {
    let { status, winner } = Board.getGameStatus()
    let endMessage = ""
    if (status == "winner") {
        endMessage = `${winner.getPlayerName()} won`
    } else {
        endMessage = "tie"
    }

    setEndTitle(endMessage, Board.getGameDurationTimestamp())
}
startButton.addEventListener("click", () => {
    currentBoard = new BoardManager(".board", 3)
    currentBoard.setPlayer(0, new (PLAYER_CLASS[currentPlayers[0].class_id])("X", currentPlayers[0].name, "#A"))
    currentBoard.setPlayer(1, new (PLAYER_CLASS[currentPlayers[1].class_id])("O", currentPlayers[1].name, "#B"))
    currentBoard.startGame(gameEnd, "X")
})

updateUI()
translateMs(3001)