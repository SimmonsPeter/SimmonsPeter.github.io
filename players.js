$(document).ready(function () {
    getPlayers();
});

function getPlayers() {
    $.get("https://641b49f71f5d999a44603cd2.mockapi.io/users", function (data) {
        let goldLeaguePlayers = [];
        let silverLeaguePlayers = [];
        let bronzeLeaguePlayers = [];

        $.each(data, function (index, playerData) {
            if (playerData.playerRating >= 2000) {
                goldLeaguePlayers.push(playerData);
            } else if (playerData.playerRating >= 1000 && playerData.playerRating <= 1999) {
                silverLeaguePlayers.push(playerData);
            } else {
                bronzeLeaguePlayers.push(playerData);
            }
        });

        populateTable("#goldLeagueTable", goldLeaguePlayers);
        populateTable("#silverLeagueTable", silverLeaguePlayers);
        populateTable("#bronzeLeagueTable", bronzeLeaguePlayers);
    });
}

function populateTable(tableSelector, players) {
    let tableHeaders = `
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Country</th>
                <th scope="col">Rating</th>
            </tr>
        </thead>`;
    let tableBody = "<tbody>";

    players.forEach(player => {
        tableBody += `
            <tr>
                <th scope="row">${player.username}</th>
                <td>${player.name}</td>
                <td>${player.Country}</td>
                <td>${player.playerRating}</td>
            </tr>`;
    });

    tableBody += "</tbody>";

    $(tableSelector).html(tableHeaders + tableBody);
}