// Fonction principale exécutée lorsque le document est prêt
$(document).ready(function () {
    getPlayers();
});

// Récupère les joueurs à partir de l'API et les classe dans les ligues correspondantes
function getPlayers() {
    $.get("https://641b49f71f5d999a44603cd2.mockapi.io/users", function (data) {
        let goldLeaguePlayers = [];
        let silverLeaguePlayers = [];
        let bronzeLeaguePlayers = [];

        // Parcourt les joueurs et les classe dans les ligues correspondantes
        $.each(data, function (index, playerData) {
            if (playerData.playerRating >= 2000) {
                goldLeaguePlayers.push(playerData);
            } else if (playerData.playerRating >= 1000 && playerData.playerRating <= 1999) {
                silverLeaguePlayers.push(playerData);
            } else {
                bronzeLeaguePlayers.push(playerData);
            }
        });

        // Remplit les tableaux des ligues avec les joueurs récupérés
        populateTable("#goldLeagueTable", goldLeaguePlayers);
        populateTable("#silverLeagueTable", silverLeaguePlayers);
        populateTable("#bronzeLeagueTable", bronzeLeaguePlayers);
    });
}
// Fonction pour peupler un tableau avec les données des joueurs
function populateTable(tableSelector, players) {
    // Prépare les en-têtes du tableau
    let tableHeaders = `
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Country</th>
                <th scope="col">Rating</th>
            </tr>
        </thead>`;
        // Prépare le corps du tableau
    let tableBody = "<tbody>";

    // Remplit le corps du tableau avec les données des joueurs
    players.forEach(player => {
        tableBody += `
            <tr>
                <th scope="row">${player.username}</th>
                <td>${player.name}</td>
                <td>${player.Country}</td>
                <td>${player.playerRating}</td>
            </tr>`;
    });
    // Ferme le corps du tableau
    tableBody += "</tbody>";
    // Insère les en-têtes et le corps du tableau dans l'élément du tableau sélectionné
    $(tableSelector).html(tableHeaders + tableBody);
}