import { url } from "./main.js";

var snackOptions = {
    SMALL_MENU: "Small Menu",
    MEDIUM_MENU: "Medium Menu",
    BIG_MENU: "Big Menu"
};

    // Function to display the snack selection popup
    function showSnackSelection() {
    var snackChoice = prompt("Do you want to add a snack to your order?\n\nSelect a Snack Option:\n1. Small Menu\n2. Medium Menu\n3. Big Menu");

    if (snackChoice !== null) {
    snackChoice = parseInt(snackChoice);

    if (snackChoice >= 1 && snackChoice <= 3) {
    // Convert the user's choice to the corresponding SnackType
    var selectedSnackType;
    switch (snackChoice) {
    case 1:
    selectedSnackType = snackOptions.SMALL_MENU;
    break;
    case 2:
    selectedSnackType = snackOptions.MEDIUM_MENU;
    break;
    case 3:
    selectedSnackType = snackOptions.BIG_MENU;
    break;
}

    // You can now send the selectedSnackType to the backend for processing.
    alert("You have selected: " + selectedSnackType);
} else {
    alert("Invalid choice. Please select a valid snack option.");
}
} else {
    // User canceled the snack selection
    alert("Snack selection canceled.");
}
}

