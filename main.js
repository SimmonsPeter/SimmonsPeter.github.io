$(document).ready(function () {
    getPlayers();
});

class Player {
    constructor(playerName, playerCountry, playerRating) {
        this.playerName = playerName;
        this.playerCountry = playerCountry;
        this.playerRating = playerRating;
    }
}

function getPlayers() {
    $.get("https://641b49f71f5d999a44603cd2.mockapi.io/users", function (data) {
        var bestBronzeLeaguePlayer = null;
        var bestSilverLeaguePlayer = null;
        var bestGoldLeaguePlayer = null;

        $.each(data, function (index, playerData) {
            var player = new Player(playerData.name, playerData.Country, playerData.playerRating


            );

            if (player.playerRating <= 999) {
                if (!bestBronzeLeaguePlayer || player.playerRating > bestBronzeLeaguePlayer.playerRating) {
                    bestBronzeLeaguePlayer = player;
                }
            } else if (player.playerRating >= 1000 && player.playerRating <= 1999) {
                if (!bestSilverLeaguePlayer || player.playerRating > bestSilverLeaguePlayer.playerRating) {
                    bestSilverLeaguePlayer = player;
                }
            } else if (player.playerRating >= 2000) {
                if (!bestGoldLeaguePlayer || player.playerRating > bestGoldLeaguePlayer.playerRating) {
                    bestGoldLeaguePlayer = player;
                }
            }
        });

        if (bestBronzeLeaguePlayer) {
            $('#bestBronzePlayer').html(
                `Name: ${bestBronzeLeaguePlayer.playerName}<br>
                Country: ${bestBronzeLeaguePlayer.playerCountry}<br>
                Rating: ${bestBronzeLeaguePlayer.playerRating}`
            );
        }

        if (bestSilverLeaguePlayer) {
            $('#bestSilverPlayer').html(
                `Name: ${bestSilverLeaguePlayer.playerName}<br>
                Country: ${bestSilverLeaguePlayer.playerCountry}<br>
                Rating: ${bestSilverLeaguePlayer.playerRating}`
            );
        }

        if (bestGoldLeaguePlayer) {
            $('#bestGoldPlayer').html(
                `Name: ${bestGoldLeaguePlayer.playerName}<br>
                Country: ${bestGoldLeaguePlayer.playerCountry}<br>
                Rating: ${bestGoldLeaguePlayer.playerRating}`
            );
        }
    });
}


