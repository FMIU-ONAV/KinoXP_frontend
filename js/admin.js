import {url} from "./main.js";

export function getAllUsers() {
    // Retrieve the JWT token from local storage
    const jwtToken = localStorage.getItem('jwtToken');

    return fetch(`${url}/admin`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Request failed with status: ${response.status}`);
            }
            return response.json();
        })
        .then(response => {
            console.log("Response from server:", response); // Log the response
            return response;
        })
        .catch(err => {
            console.error("Error fetching data:", err); // Log any errors
            throw err; // Rethrow the error to handle it later
        });
}

export async function makeUserRows() {
    try {
        const users = await getAllUsers();

        console.log("Current users:", users); // Log the users array

        const rows = users.map(user => {
            return `
          <tr>
            <td>${user.id}</td>  
            <td>${user.username}</td>
            <td>${user.first_Name}</td>
            <td>${user.last_Name}</td>
            <td>${user.role}</td>
            <td><button class="btn btn-warning btn-edit-movie" data-user="${user.id}">Edit</button></td>
          </tr>
        `;
        });

        document.getElementById("user-table-body").innerHTML = rows.join("");
    } catch (error) {
        console.error("Error in makeUserRows:", error); // Log any errors that occur in makeUserRows
    }
}

makeUserRows();