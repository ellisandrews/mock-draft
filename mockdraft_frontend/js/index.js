
const parseJSONResponse = response => response.json()
const consoleLogError = error => console.log(error)


const makePlayerTableRow = rankedPlayer => {
    // Make a <tr> element
    const tr = document.createElement('tr')

    // Make <td> elements for each field
    tr.innerHTML = `
                   <td>${rankedPlayer.overallRank}</td>
                   <td>${rankedPlayer.displayName}</td>
                   <td>${rankedPlayer.position}</td>
                   <td>${rankedPlayer.positionRank}</td>
                   <td>${rankedPlayer.team}</td>
                   <td>${rankedPlayer.byeWeek}</td>
                   <td><button>Queue</button></td>
                   `
    return tr
}

const populatePlayerPoolTable = rankedPlayers => {
    const tBody = document.querySelector("#player-pool-tbody")

    rankedPlayers.forEach(rankedPlayer => {
        const tr = makePlayerTableRow(rankedPlayer)
        tBody.appendChild(tr)
    })
}


const fetchAndPopulatePlayerPool = () => {
    // Fetch player rankings from the backend, and display them in the player pool table
    fetch('http://localhost:3000/DraftRankings')
        .then(parseJSONResponse)
        .then(populatePlayerPoolTable)
}

const main = () => {
    fetchAndPopulatePlayerPool()
}

main()
