
// Helper functions
const parseJSONResponse = response => response.json()
const logError = error => console.log(error)


const makePlayerTableRow = (rankedPlayer, buttonText='Queue') => {
    // Make a <tr> element
    const tr = document.createElement('tr')
    tr.dataset.playerId = rankedPlayer.playerId

    // Make <td> elements for each field
    tr.innerHTML = `
                   <td>${rankedPlayer.overallRank}</td>
                   <td>${rankedPlayer.displayName}</td>
                   <td>${rankedPlayer.position}</td>
                   <td>${rankedPlayer.positionRank}</td>
                   <td>${rankedPlayer.team}</td>
                   <td>${rankedPlayer.byeWeek}</td>
                   <td><button>${buttonText}</button></td>
                   `
    return tr
}

const populatePlayerPoolTable = rankedPlayers => {
    // TODO: Limit the number of players displayed
    const tBody = document.querySelector("#player-pool-tbody")

    rankedPlayers.forEach(rankedPlayer => {
        const tr = makePlayerTableRow(rankedPlayer)
        tBody.appendChild(tr)
    })
}

const cachePlayers = rankedPlayers => {
    // Create a global variable of all the players
    playersCache = {}
    
    rankedPlayers.forEach(rankedPlayer => {
        playersCache[rankedPlayer.playerId] = rankedPlayer
    })

    // Return the original data structure for further processing
    return rankedPlayers
}

const fetchAndPopulatePlayerPool = () => {
    // Fetch player rankings from the backend, and display them in the player pool table
    fetch('http://localhost:3000/DraftRankings')
        .then(parseJSONResponse)
        .then(players => players.slice(0, 10))  // TODO: Remove this limiting!!
        .then(cachePlayers)
        .then(populatePlayerPoolTable)
        .catch(logError)
}

// Hande clicks on the the player pool table
const handlePlayerPoolTableClick = event => {
    // Get the target element of the click event
    target = event.target

    // Only listen for clicks on a <button>
    if (target.matches('button')) {

        // Get the player row clicked on (which has the data-player-id)
        const playerId = target.parentElement.parentElement.dataset.playerId

        if (target.innerText === 'Queue') {
            // Add make a new player row and append it to the Queue table
            const tr = makePlayerTableRow(playersCache[playerId], 'Remove')
            document.querySelector("#player-queue-tbody").appendChild(tr)
        } else if (target.innerText === 'Draft') {
            console.log('*** TODO! Drafting ***')
        }
    }
}

// Listen for clicks on the player pool table
const addPlayerPoolButtonListener = () => {
    const poolTable = document.querySelector("#player-pool-table")
    poolTable.addEventListener('click', handlePlayerPoolTableClick)
}

// Entry point for execution
const main = () => {
    fetchAndPopulatePlayerPool()
    addPlayerPoolButtonListener()
}

// Execution
main()
