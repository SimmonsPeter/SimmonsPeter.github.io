// Attend que le DOM soit prêt pour lancer les actions
$(document).ready(function () {
    // Récupère les joueurs à partir de l'API et les affiche
    getPlayers();

    // Formulaire d'ajout de joueur
    $("#addPlayerForm").submit(async function (e) {
        e.preventDefault();
    
        // Récupère les valeurs du formulaire
        let id = $("#playerID").val();
        let password = $("#password").val();
        let name = $("#playerName").val();
        let rating = $("#playerRating").val();
        let country = $("#playerCountry").val();
        let email = $("#playerEmail").val();

        // Valide les entrées et ajoute le joueur si elles sont valides
        if (await validateInput(id, password, name, rating, country, email)) {
            addPlayer(id, password, name, rating, country, email);
        } 
    });

    // Formulaire de suppression de joueur
    $("#deletePlayerForm").submit(function (e) {
        e.preventDefault();
    
        // Récupère les valeurs du formulaire
        let username = $("#deletePlayerID").val();
        let password = $("#deletePassword").val();
        let idToDelete = $("#idToDelete").val();
        

        // Supprime le joueur si les champs sont remplis
        if (username!=="" || password!=="" || idToDelete!=="") {
            deletePlayer(username, password,idToDelete);
        }else{
        
            showValidationError("#idToDelete", "Remplissez tous les champs");           
        }
        
    });

    // Formulaire de modification de joueur
    $("#modifyPlayerForm").submit(async function (e) {
        e.preventDefault();
    
        // Récupère les valeurs du formulaire
        let id = $("#existingPlayerID").val();
        let password = $("#existingPassword").val();
        let name = $("#newPlayerName").val();
        let rating = $("#newPlayerRating").val();
        let country = $("#newPlayerCountry").val();
        let email = $("#newPlayerEmail").val();
    
        // Modifie le joueur si tous les champs sont remplis
        if (!name || !rating || !country || !email) {
            showValidationError("#newPlayerEmail", "Remplissez tous les champs");
        }else {
            updatePlayer(id, password, name, rating, country, email);
        }
    });
});

// Classe Player pour représenter un joueur
class Player {
    constructor(playerName, playerCountry, playerRating) {
        this.playerName = playerName;
        this.playerCountry = playerCountry;
        this.playerRating = playerRating;
    }
}

// Récupère les joueurs à partir de l'API et les affiche
function getPlayers() {
    $.get("https://641b49f71f5d999a44603cd2.mockapi.io/users", function (data) {
        let bestBronzeLeaguePlayer = null;
        let bestSilverLeaguePlayer = null;
        let bestGoldLeaguePlayer = null;

         // Parcourt les joueurs et les classe dans les ligues correspondantes
        $.each(data, function (index, playerData) {
            let player = new Player(playerData.name, playerData.Country, playerData.playerRating


            );

             // Classe les joueurs selon leur classement
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

        // Affiche les meilleurs joueurs de chaque ligue
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


async function validateInput(id, password, name, rating, country, email) {
    let isValid = true;
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,}$/;

    // Clear previous error messages
    $(".validation-error").remove();

    // ID, password, and name checks
    if (id === "") {
        showValidationError("#playerID", "L'ID ne peut pas être vide");
        isValid = false;
    } else {
        const usernameExists = await checkExistingUsername(id);
        if (usernameExists) {
            showValidationError("#playerID", "L'ID est déjà utilisé");
            isValid = false;
        }
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
            
            alert("Joueur ajouté avec succès");
            $("#addPlayerModal").modal("hide");
        })
        .fail(function (error) {
            alert("Une erreur s'est produite lors de l'ajout du joueur");
        });
}



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
                        alert("Joueur supprimé avec succès");
                        $("#deletePlayerModal").modal("hide");
                        localStorage.removeItem(username);
                    },
                    error: function (error) {
                        alert("Une erreur s'est produite lors de la suppression du joueur");
                    }
                });
            } else {
                alert("Le joueur n'existe pas");
            }
        }).fail(function () {
            alert("Une erreur s'est produite lors de la suppression du joueur");
        });
    } else {
        alert("Accès refusé, vous n'êtes pas autorisé à supprimer ce joueur");
    }
}

function checkExistingUsername(username) {
    return new Promise((resolve, reject) => {
        $.get(`https://641b49f71f5d999a44603cd2.mockapi.io/users?search=${username}`, function (data) {
            if (data && data.length > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        }).fail(function () {
            reject("Error checking existing username");
        });
    });
}

function updatePlayer(id, password, name, rating, country, email) {
    // Fetch the player data to verify its existence and check the password
    $.get(`https://641b49f71f5d999a44603cd2.mockapi.io/users?search=${id}`, function (playersData) {
        if (playersData && playersData.length > 0) {
            const playerData = playersData[0]; // Assuming unique usernames

            if (playerData.password === password) {
                const data = {
                    username: id,
                    password: password,
                    name: name,
                    playerRating: rating,
                    Country: country,
                    email: email,
                };

                // Send a PUT request to update the player
                $.ajax({
                    url: `https://641b49f71f5d999a44603cd2.mockapi.io/users/${playerData.id}`,
                    type: "PUT",
                    contentType: "application/json", // Set the content type to JSON
                    data: JSON.stringify(data), // Convert the data object to a JSON string
                    success: function (response) {
                        localStorage.setItem(id, JSON.stringify(data));
                        alert("Joueur mis à jour avec succès");
                        $("#modifyPlayerModal").modal("hide");
                    },
                    error: function (error) {
                        alert("Une erreur s'est produite lors de la mise à jour du joueur");
                    }
                });
            } else {
                alert("Accès refusé, mot de passe incorrect");
            }
        } else {
            alert("Le joueur n'existe pas");
        }
    }).fail(function () {
        alert("Une erreur s'est produite lors de la mise à jour du joueur");
    });
}




