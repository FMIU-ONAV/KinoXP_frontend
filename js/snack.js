const url = 'kinoxpkea.azurewebsites.net' // 'localhost:8081'



import { url } from "./main.js";

var snackOptions = {
    SMALL_MENU: "Small Menu",
    MEDIUM_MENU: "Medium Menu",
    BIG_MENU: "Big Menu"
};

    // Function to display the snack selection popup
   async function showSnackSelection() {


    var snackChoice = prompt("Do you want to add a snack to your order?\n\nSelect a Snack Option:\n1. Small Menu\n2. Medium Menu\n3. Big Menu");

    if (snackChoice !== null) {
    snackChoice = parseInt(snackChoice);

    if (snackChoice >= 1 && snackChoice <= 3) {
    // Convert the user's choice to the corresponding SnackType
    var selectedSnackType;
        var snackPrice;
    switch (snackChoice) {
    case 1:
    selectedSnackType = snackOptions.SMALL_MENU;
        snackPrice = 70;
        break;
    case 2:
    selectedSnackType = snackOptions.MEDIUM_MENU;
        snackPrice = 87;
    break;
    case 3:
    selectedSnackType = snackOptions.BIG_MENU;
        snackPrice = 100;
    break;
}

        alert("You have selected: " + selectedSnackType + " for " + snackPrice + " kr.")
} else {
    alert("Invalid choice. Please select a valid snack option.");
}
} else {

    alert("Snack selection canceled.");
}
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
           snackType: selectedSnackType,
                price: snackPrice
       }),
        };

        await fetch(`https://${url}/snacks`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to purchase snacks');
                }
                console.log('snacks purchased ');

            })
            .catch(error => {
                console.error('Error', error.message);
            });

}

