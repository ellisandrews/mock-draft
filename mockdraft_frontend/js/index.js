// Backend JSON API URL base
const APIBASE = 'http://localhost:3000'

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

// Handle a player being drafted to the user's roster
const rosterPlayer = (playerId, rosterId) => {
    // Make an API call to the backend adding the player to the roster

    // Remove the player from the pool and all queues

    // Update the displayed roster?

}

const displayRoster = roster => {
    const players = roster.players  // For convenience
    const rosterTable = `
                        <table id="roster-table">
                          <caption>Roster: ${roster.name}</caption>
                          <thead>
                            <tr>
                              <th>Position</th>
                              <th>Player</th>
                              <th>Bye Week</th>
                            </tr>
                          </thead>
                          <tbody id="roster-tbody">
                            <tr title="QB">
                              <td>QB</td>
                              <td>${players.qb.displayName || ''}</td>
                              <td>${players.qb.byeWeek || ''}</td>
                            </tr>
                            <tr title="RB1">
                              <td>RB</td>
                              <td>${players.rb1.displayName || ''}</td>
                              <td>${players.rb1.byeWeek || ''}</td>
                            </tr>
                            <tr title="RB2">
                              <td>RB</td>
                              <td>${players.rb2.displayName || ''}</td>
                              <td>${players.rb2.byeWeek || ''}</td>
                            </tr>
                            <tr title="WR1">
                              <td>WR</td>
                              <td>${players.wr1.displayName || ''}</td>
                              <td>${players.wr1.byeWeek || ''}</td>
                            </tr>
                            <tr title="WR2">
                              <td>WR</td>
                              <td>${players.wr2.displayName || ''}</td>
                              <td>${players.wr2.byeWeek || ''}</td>
                            </tr>
                            <tr title="TE">
                              <td>TE</td>
                              <td>${players.te.displayName || ''}</td>
                              <td>${players.te.byeWeek || ''}</td>
                            </tr>
                            <tr title="FLEX">
                              <td>FLEX</td>
                              <td>${players.flex.displayName || ''}</td>
                              <td>${players.flex.byeWeek || ''}</td>
                            </tr>
                            <tr title="D/ST">
                              <td>D/ST</td>
                              <td>${players.dst.displayName || ''}</td>
                              <td>${players.dst.byeWeek || ''}</td>
                            </tr>
                            <tr title="K">
                              <td>K</td>
                              <td>${players.k.displayName || ''}</td>
                              <td>${players.k.byeWeek || ''}</td>
                            </tr>
                            <tr title="BENCH1">
                              <td>BENCH</td>
                              <td>${players.bench1.displayName || ''}</td>
                              <td>${players.bench1.byeWeek || ''}</td>
                            </tr>
                            <tr title="BENCH2">
                              <td>BENCH</td>
                              <td>${players.bench2.displayName || ''}</td>
                              <td>${players.bench2.byeWeek || ''}</td>
                            </tr>
                            <tr title="BENCH3">
                              <td>BENCH</td>
                              <td>${players.bench3.displayName || ''}</td>
                              <td>${players.bench3.byeWeek || ''}</td>
                            </tr>
                            <tr title="BENCH4">
                              <td>BENCH</td>
                              <td>${players.bench4.displayName || ''}</td>
                              <td>${players.bench4.byeWeek || ''}</td>
                            </tr>
                            <tr title="BENCH5">
                              <td>BENCH</td>
                              <td>${players.bench5.displayName || ''}</td>
                              <td>${players.bench5.byeWeek || ''}</td>
                            </tr>
                            <tr title="BENCH6">
                              <td>BENCH</td>
                              <td>${players.bench6.displayName || ''}</td>
                              <td>${players.bench6.byeWeek || ''}</td>
                            </tr>
                            <tr title="BENCH7">
                              <td>BENCH</td>
                              <td>${players.bench7.displayName || ''}</td>
                              <td>${players.bench7.byeWeek || ''}</td>
                            </tr>
                          </tbody>
                        </table>
                        `
    // Set the innerHTML of the roster-show div to be the table
    const rosterDiv = document.querySelector("#roster-show")
    rosterDiv.innerHTML = rosterTable
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
    fetchAndDisplayRoster(1)
}

// Execution
main()
