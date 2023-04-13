// Attend que le DOM soit prêt pour lancer les actions
$(document).ready(function () {
    // Récupère les joueurs à partir de l'API et les affiche
    getPlayers();
    $("#playerID").on("input", function () {
        hideValidationError("#playerID");
    });
    
    $("#password").on("input", function () {
        hideValidationError("#password");
    });
    
    $("#playerName").on("input", function () {
        hideValidationError("#playerName");
    });
    
    $("#playerEmail").on("input", function () {
        hideValidationError("#playerEmail");
    });
    
    $("#playerRating").on("input", function () {
        hideValidationError("#playerRating");
    });
    
    $("#existingPlayerID").on("blur", async function () {
        const id = $(this).val();
        if (id !== "") {
            const playerData = await getPlayerDataById(id);
            if (playerData) {
                fillModifyPlayerForm(playerData);
            }
        }
    });
    
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
        if (confirm("Êtes-vous sûr de vouloir supprimer ce joueur ?")) {
            // Supprime le joueur si les champs sont remplis
            if (username!=="" || password!=="" || idToDelete!=="") {
                deletePlayer(username, password,idToDelete);
            }else{
                showValidationError("#idToDelete", "Remplissez tous les champs");           
            }
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

/*
Rôle: La fonction getPlayers récupère la liste des joueurs à partir d'une API et affiche le meilleur joueur de chaque ligue (bronze, argent et or) sur la page HTML.
Description des paramètres:
Aucun paramètre n'est requis pour cette fonction.
Valeurs retournées:
Cette fonction ne retourne pas de valeur, mais elle met à jour le contenu de la page HTML avec les informations
des meilleurs joueurs de chaque ligue.
*/
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

/*
Rôle: La fonction getPlayerDataById récupère les données d'un joueur en fonction de son identifiant (ID) à partir d'une API.
Description des paramètres:
id (String|Number): L'identifiant (ID) du joueur dont les données doivent être récupérées.
Valeurs retournées:
Cette fonction retourne une promesse qui résout les données du joueur si la requête est réussie, ou null en cas d'échec.
Si aucune donnée correspondante n'est trouvée, la promesse résout également null.
*/
async function getPlayerDataById(id) {
    try {
        const response = await $.get(`https://641b49f71f5d999a44603cd2.mockapi.io/users?search=${id}`);
        if (response && response.length > 0) {
            return response[0]; // Assuming unique usernames
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching player data", error);
        return null;
    }
}

/*
Rôle: La fonction fillModifyPlayerForm remplit un formulaire de modification de joueur avec les données existantes d'un joueur.
Description des paramètres:
playerData (Object): Un objet contenant les données du joueur à utiliser pour remplir le formulaire.
Valeurs retournées:
Cette fonction ne retourne pas de valeur. Elle met à jour les éléments du formulaire avec les données du joueur.
*/
function fillModifyPlayerForm(playerData) {
    $("#existingPassword").val(playerData.password);
    $("#newPlayerName").val(playerData.name);
    $("#newPlayerRating").val(playerData.playerRating);
    $("#newPlayerCountry").val(playerData.Country);
    $("#newPlayerEmail").val(playerData.email);
}

/*
Rôle: La fonction validateInput valide les données saisies par l'utilisateur pour le formulaire d'ajout/modification d'un joueur.
Description des paramètres:
id (String): L'ID du joueur.
password (String): Le mot de passe du joueur.
name (String): Le nom du joueur.
rating (Number): Le classement du joueur.
country (String): Le pays du joueur.
email (String): L'adresse e-mail du joueur.
Valeurs retournées:
Cette fonction retourne un booléen qui indique si les données sont valides (true) ou non (false).
*/
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

/*
Rôle: La fonction showValidationError affiche un message d'erreur de validation pour un élément de formulaire spécifié.
Description des paramètres:
elementSelector (String): Le sélecteur CSS de l'élément de formulaire pour lequel afficher le message d'erreur.
errorMessage (String): Le message d'erreur à afficher.
Valeurs retournées:
Cette fonction ne retourne pas de valeur. Elle ajoute une classe "is-invalid" à l'élément ciblé et insère un message d'erreur après celui-ci.
*/
function showValidationError(elementSelector, errorMessage) {
    $(elementSelector).addClass("is-invalid");
    $(elementSelector).after(`<div class="validation-error text-danger mt-1"><i class="fas fa-times"></i> ${errorMessage}</div>`);
}

/*
Rôle: La fonction hideValidationError masque le message d'erreur de validation pour un élément de formulaire spécifié.
Description des paramètres:
elementSelector (String): Le sélecteur CSS de l'élément de formulaire pour lequel masquer le message d'erreur.
Valeurs retournées:
Cette fonction ne retourne pas de valeur. Elle supprime la classe "is-invalid" de l'élément ciblé et retire le message d'erreur associé.
*/
function hideValidationError(elementSelector) {
    $(elementSelector).removeClass("is-invalid");
    $(elementSelector).next(".validation-error").remove();
}


/*
Rôle: La fonction addPlayer ajoute un nouveau joueur à la liste des joueurs en envoyant une requête POST à l'API et stocke les données du joueur dans le localStorage.
Description des paramètres:
id (String): L'ID du joueur à ajouter.
password (String): Le mot de passe du joueur à ajouter.
name (String): Le nom du joueur à ajouter.
rating (Number): Le classement du joueur à ajouter.
country (String): Le pays du joueur à ajouter.
email (String): L'adresse e-mail du joueur à ajouter.
Valeurs retournées:
Cette fonction ne retourne pas de valeur. Elle envoie une requête POST à l'API et affiche une alerte pour informer l'utilisateur si l'ajout est réussi ou échoué.
*/
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


/*
Rôle: La fonction deletePlayer supprime un joueur de la liste des joueurs si les informations d'identification fournies sont correctes.
Description des paramètres:
username (String): Le nom d'utilisateur de l'utilisateur actuellement connecté.
password (String): Le mot de passe de l'utilisateur actuellement connecté.
idToDelete (String): L'ID du joueur à supprimer.
Valeurs retournées:
Cette fonction ne retourne pas de valeur. Elle envoie une requête DELETE à l'API et affiche une alerte pour informer l'utilisateur si la suppression est réussie ou échouée.
*/
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

/*
Rôle: La fonction deletePlayer supprime un joueur de la liste des joueurs si les informations d'identification fournies sont correctes.
Description des paramètres:
username (String): Le nom d'utilisateur de l'utilisateur actuellement connecté.
password (String): Le mot de passe de l'utilisateur actuellement connecté.
idToDelete (String): L'ID du joueur à supprimer.
Valeurs retournées:
Cette fonction ne retourne pas de valeur. Elle envoie une requête DELETE à l'API et affiche une alerte pour informer l'utilisateur si la suppression est réussie ou échouée.
*/
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

/*
Rôle: La fonction updatePlayer met à jour les informations d'un joueur existant si le mot de passe fourni est correct.
Description des paramètres:
id (String): L'ID du joueur à mettre à jour.
password (String): Le mot de passe actuel du joueur à mettre à jour.
name (String): Le nouveau nom du joueur.
rating (Number): Le nouveau classement du joueur.
country (String): Le nouveau pays du joueur.
email (String): La nouvelle adresse e-mail du joueur.
Valeurs retournées:
Cette fonction ne retourne pas de valeur. Elle envoie une requête PUT à l'API et affiche une alerte pour informer l'utilisateur si la mise à jour est réussie ou échouée.
*/
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




