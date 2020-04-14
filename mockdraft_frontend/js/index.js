// Backend JSON API URL base
const APIBASE = 'http://localhost:3000'
const rosterPositions = new Set([
    'QB', 'RB1', 'RB2', 'WR1', 'WR2', 'TE', 'FLEX', 'D/ST', 'K',
    'BENCH1', 'BENCH2', 'BENCH3', 'BENCH4', 'BENCH5', 'BENCH6', 'BENCH7'
])

// Commonly used permanent nodes
const playerPoolTable = document.querySelector("#player-pool-table")
const playerQueueTable = document.querySelector("#player-queue-table")

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
                   <td><button>${buttonText}</button><button>Draft</button></td>
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
    fetch(`${APIBASE}/DraftRankings`)
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
        const playerPoolRow = target.parentElement.parentElement 
        const playerId = playerPoolRow.dataset.playerId

        if (target.innerText === 'Queue') {
            // Add make a new player row and append it to the Queue table
            const tr = makePlayerTableRow(playersCache[playerId], 'Remove')
            document.querySelector("#player-queue-tbody").appendChild(tr)

            // Hide the Queue button for that player
            playerPoolRow.querySelector('button').style.display = "none"

        } else if (target.innerText === 'Draft') {
            // Add the player to the roster
            console.log('*** TODO! Drafting ***')
        }
    }
}

const handlePlayerQueueTableClick = event => {
    // Get the target element of the click event
    target = event.target

    // Only listen for clicks on a <button>
    if (target.matches('button')) {

        // Get the player row clicked on (which has the data-player-id)
        const playerQueueRow = target.parentElement.parentElement 
        const playerId = playerQueueRow.dataset.playerId

        if (target.innerText === 'Remove') {
            // Remove the player row from Queue table
            playerQueueRow.remove()

            // Unhide the Queue button in the Pool table
            const playerPoolRow = document.querySelector("#player-pool-tbody").querySelector(`tr[data-player-id='${playerId}']`)
            playerPoolRow.querySelector('button').removeAttribute("style")

        } else if (target.innerText === 'Draft') {
            // Add the player to the roster
            console.log('*** TODO! Drafting ***')
        }
    }
}

const findOpenRosterPositions = roster => {
    // Return an array of the not-yet-filled positions on the roster
    const takenPositions = new Set()

    roster.players.forEach(player => {
        takenPositions.add(player.roster_position)
    })

    return [...rosterPositions].filter(position => !takenPositions.has(position));
}

const displayRoster = roster => {

    roster.players.forEach(player => {
        // Find the roster table row that corresponds to the player's roster_position
        const tr = document.querySelector(`#${player.roster_position}`)
        const tds = tr.querySelectorAll('td')
        tds[1].innerText = `${player.first_name} ${player.last_name}`
        tds[2].innerText = player.bye_week
    })

}

const fetchAndDisplayRoster = rosterId => {
    fetch(`${APIBASE}/rosters/${rosterId}`)
        .then(parseJSONResponse)
        .then(displayRoster)
        .catch(logError)
}

// Entry point for execution
const main = () => {
    fetchAndPopulatePlayerPool()
    playerPoolTable.addEventListener('click', handlePlayerPoolTableClick)
    playerQueueTable.addEventListener('click', handlePlayerQueueTableClick)
    fetchAndDisplayRoster(1)  // Currently hard coded!!
}

// Execution
main()
