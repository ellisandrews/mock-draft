// Backend JSON API URL base
const APIBASE = 'http://localhost:3000'
const rosterPositions = [
    'QB', 'RB1', 'RB2', 'WR1', 'WR2', 'TE', 'FLEX', 'DST', 'K', 'BENCH1', 'BENCH2', 'BENCH3', 'BENCH4', 'BENCH5', 'BENCH6', 'BENCH7'
]
const playersCache = {}

// Commonly used permanent nodes
const playerPoolTable = document.querySelector("#player-pool-table")
const playerQueueTable = document.querySelector("#player-queue-table")

// Helper functions
const parseJSONResponse = response => response.json()
const logError = error => console.log(error)

const makePlayerTableRow = (player, buttonText='Queue') => {
    // Make a <tr> element
    const tr = document.createElement('tr')
    tr.dataset.playerId = player.id

    // Make <td> elements for each field
    tr.innerHTML = `
                   <td>${player.overall_rank}</td>
                   <td>${player.displayName}</td>
                   <td>${player.position}</td>
                   <td>${player.position_rank}</td>
                   <td>${player.team}</td>
                   <td>${player.bye_week}</td>
                   <td><button>${buttonText}</button><button>Draft</button></td>
                   `
    return tr
}

const populatePlayerPoolTable = players => {
    // TODO: Limit the number of players displayed
    const tBody = document.querySelector("#player-pool-tbody")

    players.forEach(player => {
        const tr = makePlayerTableRow(player)
        tBody.appendChild(tr)
    })
}

const cachePlayers = players => {
    // Ad the players to the global cache
    players.forEach(player => {
        playersCache[player.id] = player
    })

    // Return the original data structure for further processing
    return players
}

const fetchAndPopulatePlayerPool = () => {
    // Fetch player rankings from the backend, and display them in the player pool table
    fetch(`${APIBASE}/players`)
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
    const takenPositions = []

    roster.players.forEach(player => {
        takenPositions.push(player.roster_position)
    })

    return rosterPositions.filter(position => !takenPositions.includes(position));
}

const determineRosterPosition = (position, rosterId) => {
    // Figure out which roster position to put the player in given their position
    
    return fetchRoster(rosterId)
        .then(roster => {
            // Find the open positions on the roster (an array)
            const openPositions = findOpenRosterPositions(roster)
            
            // Find the first open BENCH position
            const firstBench = openPositions.find(position => position.startsWith('BENCH'))

            // Select one of the open positions based on some logic based on the position
            switch (position) {
                case 'QB':
                    if (openPositions.includes('QB')) {
                        return 'QB'
                    } else {
                        return firstBench
                    }
                case 'RB':
                    if (openPositions.includes('RB1')) {
                        return 'RB1'
                    } else if (openPositions.includes('RB2')) {
                        return 'RB2'
                    } else if (openPositions.includes('FLEX')) {
                        return 'FLEX'
                    } else {
                        return firstBench
                    }
                case 'WR':
                    if (openPositions.includes('WR1')) {
                        return 'WR1'
                    } else if (openPositions.includes('WR2')) {
                        return 'WR2'
                    } else if (openPositions.includes('FLEX')) {
                        return 'FLEX'
                    } else {
                        return firstBench
                    }
                case 'TE':
                    if (openPositions.includes('TE')) {
                        return 'TE'
                    } else if (openPositions.includes('FLEX')) {
                        return 'FLEX'
                    } else {
                        return firstBench
                    }
                case 'DST':
                    if (openPositions.includes('DST')) {
                        return 'DST'
                    } else {
                        return firstBench
                    }
                case 'K':
                    if (openPositions.includes('K')) {
                        return 'K'
                    } else {
                        return firstBench
                    }
            }
        })
}

const addPlayerToRoster = (playerId, rosterId, rosterPosition) => {
    // Make a request to add the player to the roster in a certain position
    reqObj = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            roster_id: rosterId,
            roster_position: rosterPosition
        })
    }

    // Update the backend
    return fetch(`${APIBASE}/players/${playerId}`, reqObj).then(parseJSONResponse)
}

const draftPlayer = (playerId, rosterId) => {
    // Draft a player to a roster (assigning the roster_position appropriately)
    fetchPlayer(playerId)
        .then(player => determineRosterPosition(player.position, rosterId))
        .then(rosterPosition => addPlayerToRoster(playerId, rosterId, rosterPosition))
        .then(fetchAndDisplayRoster(rosterId))
}

const displayRoster = roster => {

    const rosterCaption = document.querySelector('#roster-caption')

    // Clear any existing data in the table
    rosterCaption.innerText = ''
    rosterPositions.forEach(position => {
        // Find the roster table row that corresponds to the position
        const tr = document.querySelector(`#${position}`)
        const tds = tr.querySelectorAll('td')
        tds[1].innerText = ''
        tds[2].innerText = ''
    })

    // Populate the table with new data
    rosterCaption.innerText = roster.name
    roster.players.forEach(player => {
        // Find the roster table row that corresponds to the player's roster_position
        const tr = document.querySelector(`#${player.roster_position}`)
        const tds = tr.querySelectorAll('td')
        tds[1].innerText = `${player.first_name} ${player.last_name}`
        tds[2].innerText = player.bye_week
    })
}


const fetchRoster = rosterId => {
    return fetch(`${APIBASE}/rosters/${rosterId}`).then(parseJSONResponse)
}

const fetchPlayer = playerId => {
    return fetch(`${APIBASE}/players/${playerId}`).then(parseJSONResponse)
}

const fetchAndDisplayRoster = rosterId => {
        fetchRoster(rosterId)    
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
