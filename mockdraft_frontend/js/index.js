// Backend JSON API URL base
const APIBASE = 'http://localhost:3000'
const rosterPositions = [
    'QB', 'RB1', 'RB2', 'WR1', 'WR2', 'TE', 'FLEX', 'DEF', 'K', 'BENCH1', 'BENCH2', 'BENCH3', 'BENCH4', 'BENCH5', 'BENCH6', 'BENCH7'
]
const playersPool = []

// Helper functions
const parseJSONResponse = response => response.json()
const logError = error => console.log(error)

// Hide or unhide an element
const toggleHidden = element => {
    if (element.style.display === "none") {
        element.style.display = "block";
    } else {
        element.style.display = "none";
    }
}

const makePlayerTableRow = (player, buttonText='Queue') => {
    // Make a <tr> element
    const tr = document.createElement('tr')
    tr.dataset.playerId = player.id

    // Make <td> elements for each field
    tr.innerHTML = `
                   <td>${player.overall_rank}</td>
                   <td>${player.first_name} ${player.last_name}</td>
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
        playersPool.push(player)
    })

    // Return the original data structure for further processing
    return players
}

const fetchAndPopulatePlayerPool = () => {
    // Fetch player rankings from the backend, and display them in the player pool table
    fetch(`${APIBASE}/players`)
        .then(parseJSONResponse)
        .then(players => players.slice(0, 20))  // TODO: Remove this limiting!!
        .then(cachePlayers)
        .then(players => players.filter(player => !player.roster_id))  // Filter out already rostered players
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
            const tr = makePlayerTableRow(playersPool[parseInt(playerId) - 1], 'Remove')
            document.querySelector("#player-queue-tbody").appendChild(tr)

            // Hide the Queue button for that player
            playerPoolRow.querySelector('button').style.display = "none"

        } else if (target.innerText === 'Draft') {
            // Add the player to the roster
            draftPlayer(playerId, user.roster.id)
            
            // Remove the player from the pool
            playerPoolRow.remove()

            // Remove the player from the queue if necessary
            const playerQueueRow = document.querySelector("#player-queue-tbody").querySelector(`tr[data-player-id='${playerId}']`)
            if (playerQueueRow) {
                playerQueueRow.remove()
            }

            // Kick off computer owner turns
            // drafter()
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
            draftPlayer(playerId, user.roster.id)

            // Remove the player from the queue table
            playerQueueRow.remove()

            // Remove the player from the pool
            const playerPoolRow = document.querySelector("#player-pool-tbody").querySelector(`tr[data-player-id='${playerId}']`)
            if (playerPoolRow) {
                playerPoolRow.remove()
            }
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
                case 'DEF':
                    if (openPositions.includes('DEF')) {
                        return 'DEF'
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
    const reqObj = {
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

const draftPlayer = async (playerId, rosterId) => {
    // Draft a player to a roster (assigning the roster_position appropriately)
    const player = await fetchPlayer(playerId)
    const rosterPosition = await determineRosterPosition(player.position, rosterId)
    
    await addPlayerToRoster(playerId, rosterId, rosterPosition)

    // If the drafting roster is currently displayed, update it.
    if (rosterId == document.querySelector("#roster-show").dataset.rosterId) {
        fetchAndDisplayRoster(rosterId)
    }

    // Delete the player from the local playersPool
    const index = playersPool.findIndex(player => player.id === parseInt(playerId))
    playersPool.splice(index, 1)
}

const displayRoster = roster => {

    document.querySelector("#roster-show").dataset.rosterId = roster.id

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
    return fetchRoster(rosterId)    
            .then(displayRoster)
            .catch(logError)
}

const displayRosterDropdown = () => {
    
    const label = document.createElement('label')
    label.innerText = "View Roster: "

    const select = document.createElement('select')
    select.id = "roster-dropdown"
    select.addEventListener('change', () => {
        if (select.value) {
            fetchAndDisplayRoster(select.value)
        }
    })

    // Make a default value for the roster dropdown
    const defaultOption = document.createElement('option')
    defaultOption.value = ''
    defaultOption.innerText = 'Select'
    select.appendChild(defaultOption)

    // Make an option for each owner's roster and append it to the dropdown
    const allOwners = [user, ...opponents]
    allOwners.forEach(owner => {
        const option = document.createElement('option')
        option.value = owner.roster.id
        option.innerText = owner.roster.name
        select.appendChild(option)
    })

    document.querySelector("#roster-select-div").append(label, select)
}

const displayDraftOrder = () => {
    const orderDiv = document.querySelector('#draft-order')
    const ol = document.createElement('ol')
    draftOrder.forEach(owner => {
        const li = document.createElement('li')
        li.innerText = owner.name
        ol.appendChild(li)
    })
    orderDiv.appendChild(ol)
}

// ---------PICKING LOGIG --------

// function timer(t=120) {
//     let id = setInterval(function() {
//         if (t >= 0) {
//             console.log(`${Math.floor(t / 60)}:${t % 60 >= 10 ? "" : "0"}${t % 60}`);
//             --t;
//         }
//         else {
//             console.log("Time's up!");
//             clearInterval(id);
//         }
//     }, 1000);
// }

const picker = (roster, end=false) => {
    
    const all_pos = {"QB": 0, "RB": 0, "WR": 0, "TE": 0};
    const end_pos = ['K', 'DEF']
    const pos_maxes = {"RB":2, "WR": 2, "QB": 1, "TE": 1}

    let bestPlayer;
    if (!end) {
        // Count players in roster
        roster.players.forEach(player => all_pos[player.position]+=1);
        
        // Get array of unmaxed out positions
        avail_pos = Object.keys(all_pos).filter(ho => all_pos[ho] < pos_maxes[ho]);
        
        // If there are unmaxed out positions, get highest ranked player of needed position.
        // Otherwise, all positions are maxed out and just take the highest ranked player.
        bestPlayer = avail_pos ? playersPool.find(player=>avail_pos.includes(player.position)) : playersPool.find(player=>all_pos.includes(player.position));
    }
    else {
        bestPlayer = playersPool.find(player=>player.position === end_pos.shift());
    }
    
    debugger

    draftPlayer(bestPlayer.id, roster.id)

    return bestPlayer
}

const drafter = async (owner, end) => {

    // Fetch the roster from the backend for the owner
    const roster = await fetchRoster(owner.roster.id)

    // Draft the best available player
    const draftedPlayer = picker(roster, end);

    // Log or update frontend (side bar) with their pick
    console.log(`${owner.name} drafted player: ${draftedPlayer.first_name} ${draftedPlayer.last_name}`)
}

const runDraft = () => {
    
    for (let round = 1; round <= 16; round++) {

        draftOrder.forEach(owner => {
            if (owner === user) {
                // TODO!!
                console.log('User turn')
            } else {
                drafter(owner, round<15)  // Kicker and Defense last 2 rounds
            }
        })
    }
}

// ------------ END PICKING LOGIC ----------

const handleStartDraftClick = event => {

    event.target.disabled = true

    const playerPoolTable = document.querySelector("#player-pool-table")
    const playerQueueTable = document.querySelector("#player-queue-table")
    
    // Add Draft and Queue button event listeners
    playerPoolTable.addEventListener('click', handlePlayerPoolTableClick)    
    playerQueueTable.addEventListener('click', handlePlayerQueueTableClick)

    // Start the timer
    // Don't allow user to draft again (disable Draft button)
    // Once user has drafted, loop through all the computer owner turns
    //     1. Select a player
    //     2. Add player to roster (frontend and backend)
    // runDraft()
}

const handleSetupFormSubmit = async event => {
    event.preventDefault()

    const username = document.querySelector("#owner-name").value
    const teamName = document.querySelector("#team-name").value
    const numOpponents = document.querySelector("#num-opponents").value

    // Perform some validation on input
    if (!username) {
        alert('Username is required!')
        return false
    } else if (!teamName) {
        alert('Fantasy Team Name is required!')
        return false
    } else if (!numOpponents || parseInt(numOpponents) < 1 || parseInt(numOpponents) > 19) {
        alert('Number of Opponents is required, and must be between 1 and 19!')
        return false
    }

    // Add the username and team name to the draft panel
    const userHeader = document.createElement('h4')
    userHeader.innerText = `User: ${username} | Team Name: ${teamName}`
    document.querySelector('#user-header').appendChild(userHeader)

    // TODO: Clear out any already rostered players from previous drafts?
    // Fetch the specified number of oppenents from the backend. 
    // Store as a global variable
    opponents = await fetch(`${APIBASE}/owners`)
                    .then(parseJSONResponse)
                    .then(owners => owners.slice(0, numOpponents))
                    .catch(logError) 

    // Request to add the Owner to the database
    let reqObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: username
        })
    }

    const owner = await fetch(`${APIBASE}/owners`, reqObj)
                    .then(parseJSONResponse)
                    .catch(logError)

    // Request to add a Roster for the owner to the database
    reqObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: teamName,
            owner_id: owner.id
        })
    }

    await fetch(`${APIBASE}/rosters`, reqObj)
                    .then(parseJSONResponse)
                    .catch(logError)

    // Store final user (owner) as a global variable
    user = await fetch(`${APIBASE}/owners/${owner.id}`)
                .then(parseJSONResponse)
                .catch(logError)

    fetchAndDisplayRoster(user.roster.id) // Display the user's roster by default
    displayRosterDropdown()               // Make the dropdown select for viewing other rosters
    fetchAndPopulatePlayerPool()          // Populate the pool table with all the players

    // Establish draft order -- TODO: Randomize
    draftOrder = [user, ...opponents]
    displayDraftOrder()

    // Listen for when the user wants to start the draft
    document.querySelector('#start-draft-button').addEventListener('click', handleStartDraftClick)

    // Toggle what is displayed on screen
    toggleHidden(document.querySelector('#setup-panel'))
    toggleHidden(document.querySelector('#draft-panel'))
}

// ----- EXECUTION ----- // 

// Listen for a click on the create draft form submit button. Nothing happens until then.
document.querySelector("#create-draft-button").addEventListener('click', handleSetupFormSubmit)
