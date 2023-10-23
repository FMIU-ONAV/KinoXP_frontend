import {url} from "./main.js";
import { getToken } from "./security.js";

export async function makeUserRows() {
    try {
        const users = await getAllUsers();
        
        const rows = users.map((user) => {
            return `
    <tr data-ID="${user.id}" data-Username="${user.username}" data-FirstName="${user.first_Name || 'N/A'}" data-LastName="${user.last_Name || 'N/A'}" data-Role="${user.role ? user.role.name : 'N/A'}">
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.first_Name || 'N/A'}</td>
      <td>${user.last_Name || 'N/A'}</td>
      <td>${user.role ? user.role.name : 'N/A'}</td>
      <td><button class="btn btn-warning btn-edit-user" data-user="${user.id}">Edit</button></td>
    </tr>
  `;
        });

        document.getElementById("user-table-body").innerHTML = rows.join("");
        updateTableWithSort(currentSort.column, currentSort.order);

        // Add click event listeners to the "Edit" buttons
        document.querySelectorAll(".btn-edit-user").forEach((button) => {
            button.addEventListener("click", (event) => {
                const userId = event.currentTarget.getAttribute("data-user");
                showEditUserModal(userId);
            });
        });
    } catch (error) {
        console.error("Error in makeUserRows:", error);
    }
}

export function getAllUsers() {
    return fetch(`${url}/admin`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }
        return response.json();
    })
    .then(response => {
        return response;
    })
    .catch(err => {
        console.error("Error fetching data:", err); // Log any errors
        throw err; // Rethrow the error to handle it later
    });
}

// Store the current sorting column and order in a global variable
let currentSort = {
    column: "ID",
    order: "asc",
};

// Function to update the table with sorted data
function updateTableWithSort(column, order) {
    const users = [...document.getElementById("user-table-body").querySelectorAll("tr")];

    users.sort((a, b) => {
        const aValue = a.getAttribute(`data-${column}`);
        const bValue = b.getAttribute(`data-${column}`);

        if (order === "asc") {
            return aValue.localeCompare(bValue);
        } else {
            return bValue.localeCompare(aValue);
        }
    });

    document.getElementById("user-table-body").innerHTML = users.map((user) => user.outerHTML).join("");
}

// Function to handle the header click event
function handleHeaderClick(column) {
    if (column === currentSort.column) {
        currentSort.order = currentSort.order === "asc" ? "desc" : "asc";
    } else {
        currentSort.column = column;
        currentSort.order = "asc";
    }

    // Update the data-order attribute in the headers
    const headers = document.querySelectorAll("th[data-col]");
    headers.forEach((header) => {
        const col = header.getAttribute("data-col");
        header.setAttribute("data-order", col === currentSort.column ? currentSort.order : "asc");
    });

    // Update the table with sorted data
    updateTableWithSort(currentSort.column, currentSort.order);
}

// Add click event listeners to the table headers
document.querySelectorAll("th[data-col]").forEach((header) => {
    header.addEventListener("click", () => {
        const column = header.getAttribute("data-col");
        handleHeaderClick(column);
    });
});

async function showEditUserModal(userId) {
    try {
        const user = await getUserDetails(userId);

        if (!user) {
            console.error(`User not found with ID: ${userId}`);
            return;
        }

        const editModalTitle = document.getElementById("edit-modal-title");
        const editValues = document.getElementById("edit-values");
        const btnSubmitEdit = document.getElementById("btn-submit-edit");

        editModalTitle.textContent = "Edit User";
        btnSubmitEdit.textContent = "Save Changes";

        // Create an HTML form for editing user details
        const form = document.createElement("form");
        form.innerHTML = `
            <div class="mb-3">
                <label for="edit-username" class="form-label">Username</label>
                <input type="text" class="form-control" id="edit-username" value="${user.username}">
            </div>
            <div class="mb-3">
                <label for="edit-first-name" class "form-label">First Name</label>
                <input type="text" class="form-control" id="edit-first-name" value="${user.first_Name}">
            </div>
            <div class="mb-3">
                <label for="edit-last-name" class="form-label">Last Name</label>
                <input type="text" class="form-control" id="edit-last-name" value="${user.last_Name}">
            </div>
            <div class="mb-3">
                <label for="edit-role" class="form-label">Role</label>
                <select class="form-select" id="edit-role">
                    <option value="1" ${user.role.name === "ROLE_MOVIE_OPERATOR" ? "selected" : ""}>Movie Operator</option>
                    <option value="2" ${user.role.name === "ROLE_INSPECTOR" ? "selected" : ""}>Inspector</option>
                    <option value="3" ${user.role.name === "ROLE_REGISTRANT" ? "selected" : ""}>Registrant</option>
                </select>
            </div>
        `;

        editValues.innerHTML = "";
        editValues.appendChild(form);

        // Attach an event listener to the Save Changes button
        btnSubmitEdit.addEventListener("click", () => {
            // Handle the form submission to update user details
            const updatedUser = {
                username: document.getElementById("edit-username").value,
                first_Name: document.getElementById("edit-first-name").value,
                last_Name: document.getElementById("edit-last-name").value,
                role: document.getElementById("edit-role").value,
            };

            // You need to implement a function to update user details
            updateUserDetails(userId, updatedUser);

            // Close the modal after saving changes
            closeModal("edit-user-modal");
        });

        // Show the edit modal
        openModal("edit-user-modal");
    } catch (error) {
        console.error("Error in showEditUserModal:", error);
    }
}

// Function to open the modal
function openModal(modalId) {
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();
}
// Function to close the modal
function closeModal(modalId) {
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.hide();
}

async function getUserDetails(userId) {
    try {
        const response = await fetch(`${url}/admin/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
            },
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching user details:", error);
        return null; // Return null in case of an error
    }
}

// Implement a function to update user details
function updateUserDetails(userId, updatedUser) {
    // You need to implement this function to update user details in your data source.
}


makeUserRows();