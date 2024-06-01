const DEFAULT_PREF = {
    currentPlayers: {
        0: {
            class_id: 0,
            name: "pA"
        },
        1: {
            class_id: 2,
            name: "minimax"
        }
    }
}
const pref = new DataStore("pref", DEFAULT_PREF)

/**
 * @typedef {({playerA: string, playerB: string, winner:string, duration: number, date:number})} RecordT 
 * @typedef {{statistics: RecordT[]}} Statistics
 */


/**@type {Statistics} */
const DEFAULT_STAT = {
    statistics: []
}

/** @type {DataStore<Statistics>} */
const stat = new DataStore("stat", DEFAULT_STAT)


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
const statsTable = document.querySelector(".statsTable")
/**@type {HTMLDivElement} */
const resetButton = document.querySelector(".reset")

/**@type {HTMLDivElement} */
const endMask = document.querySelector(".endMask")
/**@type {HTMLDivElement} */
const statusTitle = document.querySelector("#statusTitle")
/**@type {HTMLSpanElement} */
const statusTime = document.querySelector("#statusTime")
/**@type {HTMLDivElement} */
const statusClose = document.querySelector("#statusClose")
statusClose.onclick = () => { window.location.reload() }

function createStatsElement(playerA, playerB, winner, duration, date) {
    /**@param {number} num */
    const transform = (num, dig = 2) => {
        let out = ""
        let str = num.toString();
        let buff = dig - str.length;
        if (buff > 0) {
            out = (new Array(buff)).fill(0).join("")
        }
        out += str;

        return out;
    }
    const translateTimestamp = () => {
        let tmp = new Date(duration)
        let min = tmp.getMinutes()
        let s = tmp.getSeconds();
        let ms = tmp.getMilliseconds()
        return (`${transform(min, 2)}:${transform(s, 2)}:${transform(ms, 3)}`)
    }
    const translateDate = () => {
        let tmp = new Date(date)
        let hour = tmp.getHours();
        let min = tmp.getMinutes();
        let ddmmyyyy = `${transform(tmp.getDate())}.${transform(tmp.getMonth())}.${tmp.getFullYear()}`
        return `${transform(hour, 2)}:${transform(min, 2)} ${ddmmyyyy}`
    }
    let div = document.createElement("div")
    div.innerHTML = (`
        <div>${playerA}</div> 
        <div>${playerB}</div> 
        <div>${winner}</div> 
        <div>${translateTimestamp()}</div> 
        <div>${translateDate()}</div> 
    `)
    statsTable.appendChild(div)
}

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
    let win = "";
    if (status == "winner") {
        endMessage = `${winner.getPlayerName()} won`
        win = winner.getPlayerName()
    } else {
        endMessage = "tie"
        win = "tie"
    }

    /** @type {RecordT} */
    let record = {
        playerA: Board.getPlayer(0).getPlayerName(),
        playerB: Board.getPlayer(1).getPlayerName(),
        duration: Board.getGameDurationTimestamp(),
        date: (new Date()).getTime(),
        winner: win
    }
    stat.value.statistics.push(record)
    stat.save()
    setEndTitle(endMessage, Board.getGameDurationTimestamp())
}


startButton.addEventListener("click", () => {
    // debugger
    currentBoard = new BoardManager(".board", 3)
    currentBoard.setPlayer(0, new (PLAYER_CLASS[currentPlayers[0].class_id])("X", currentPlayers[0].name, "#A"))
    currentBoard.setPlayer(1, new (PLAYER_CLASS[currentPlayers[1].class_id])("O", currentPlayers[1].name, "#B"))
    currentBoard.startGame(gameEnd, "X")
    savePreferences()
})


function loadPreferences() {
    currentPlayers[0].name = pref.value.currentPlayers[0].name
    currentPlayers[0].class_id = pref.value.currentPlayers[0].class_id
    currentPlayers[1].name = pref.value.currentPlayers[1].name
    currentPlayers[1].class_id = pref.value.currentPlayers[1].class_id
}
function savePreferences() {
    pref.value.currentPlayers[0].name = playerAName.value
    pref.value.currentPlayers[0].class_id = playerAType.value;
    pref.value.currentPlayers[1].name = playerBName.value
    pref.value.currentPlayers[1].class_id = playerBType.value;
    pref.save();
}

function loadStatistics() {
    let tmp = stat.value.statistics.sort((a, b) => a.duration - b.duration)
    tmp.forEach(s => {
        createStatsElement(s.playerA, s.playerB, s.winner, s.duration, s.date)
    })
}


loadPreferences();
updateUI()
loadStatistics();