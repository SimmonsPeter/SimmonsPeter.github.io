$(document).ready(function () {
    getPlayers();

    $("#addPlayerForm").submit(function (e) {
        e.preventDefault();

        let id = $("#playerID").val();
        let password = $("#password").val();
        let name = $("#playerName").val();
        let rating = $("#playerRating").val();
        let country = $("#playerCountry").val();
        let email = $("#playerEmail").val();

        if (validateInput(id, password, name, rating, country, email)) {
            addPlayer(id, password, name, rating, country, email);
        } 
    });

    $("#deletePlayerForm").submit(function (e) {
        e.preventDefault();
    
        let username = $("#deletePlayerID").val();
        let password = $("#deletePassword").val();
        let idToDelete = $("#idToDelete").val();
        

        if (username!=="" || password!=="" || idToDelete!=="") {
            deletePlayer(username, password,idToDelete);
        }else{
        
            showValidationError("#idToDelete", "Remplissez tous les champs");           
        }
        
    });
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

// create a function that will program the soummettre button to add the player to the database based on the input values. we will include a validate function to check if the input values are valid or not. if the input values are valid, we will add the player to the database. if the input values are invalid, we will display an error message using bootstrap 5
function validateInput(id, password, name, rating, country, email) {
    let isValid = true;
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,}$/;

    // Clear previous error messages
    $(".validation-error").remove();

    // ID, password, and name checks
    if (id === "") {
        showValidationError("#playerID", "L'ID ne peut pas être vide");
        isValid = false;
    }
    if (password === "") {
        showValidationError("#password", "Le mot de passe ne peut pas être vide");
        isValid = false;
    }
    if (name === "") {
        showValidationError("#playerName", "Le nom ne peut pas être vide");
        isValid = false;
    }

    // Email validation
    if (!emailRegex.test(email)) {
        showValidationError("#playerEmail", "Adresse e-mail invalide");
        isValid = false;
    }

    // Rating validation
    if(isNaN(rating) || rating === "") {
        showValidationError("#playerRating", "Vous devez entrer un Classement");
        isValid = false;
    }
    if (rating < 0 || rating > 2700) {
        let errorMsg = rating > 2700 ? "Vous êtes trop fort pour la ligue" : "Le classement ne peut pas être négatif";
        showValidationError("#playerRating", errorMsg);
        isValid = false;
    }

    return isValid;
}

function showValidationError(elementSelector, errorMessage) {
    $(elementSelector).after(`<div class="validation-error text-danger mt-1">${errorMessage}</div>`);
}


function addPlayer(id, password, name, rating, country, email) {
    const data = {
        username: id,
        password: password,
        name: name,
        playerRating: rating,
        Country: country,
        email: email,
    };

    $.post("https://641b49f71f5d999a44603cd2.mockapi.io/users", data)
        .done(function (response) {
            // Store the player data in localStorage
            localStorage.setItem(id, JSON.stringify(data));
            
            alert("Player added successfully");
            $("#addPlayerModal").modal("hide");
        })
        .fail(function (error) {
            alert("Error adding player");
        });
}


//I want to add another function similar to addPlayer. It will use the Modifier un joueur button and its modal form to UPDATE an existing player from

function deletePlayer(username, password, idToDelete) {
    const storedPlayer = JSON.parse(localStorage.getItem(username));

    if ((storedPlayer && storedPlayer.username === idToDelete) || (username === "ADMIN" && password === "ADMIN")) {
        // Fetch the player data to verify its existence
        $.get(`https://641b49f71f5d999a44603cd2.mockapi.io/users?search=${idToDelete}`, function (playersData) {
            if (playersData && playersData.length > 0) {
                const playerData = playersData[0]; // Assuming unique usernames

                // Send a DELETE request to delete the player
                $.ajax({
                    url: `https://641b49f71f5d999a44603cd2.mockapi.io/users/${playerData.id}`,
                    type: "DELETE",
                    success: function (response) {
                        alert("Player deleted successfully");
                        $("#deletePlayerModal").modal("hide");
                        localStorage.removeItem(username);
                    },
                    error: function (error) {
                        alert("Error deleting player");
                    }
                });
            } else {
                alert("Player not found");
            }
        }).fail(function () {
            alert("Could not fetch player data from the server");
        });
    } else {
        alert("Access denied. You do not have permission to delete this player.");
    }
}




