import { url } from "./main.js";
import { getMovieById } from "./main.js";

const URLcustomers = `${url}/customers`;
const URLcustomer = `${url}/customer`;

document.getElementById("customer-table-body").addEventListener("click", handleTableClick);


function handleTableClick(evt) {
  const target = evt.target;

  if (target.dataset.idDelete) {
    // Handle delete logic
    // ...
  }

  if (target.dataset.idEdit) {
    const idToEdit = Number(target.dataset.idEdit);
    const customer = customers.find((c) => c.id === idToEdit);
    showModal(customer);
  }
}


async function showModal() {

    const movie = await getMovieById(localStorage.getItem("movieId"));
    const snack = localStorage.getItem("snackName");
    let snackDisplay;
    switch (snack) {
      case "SMALL_MENU":
        snackDisplay = "Small Menu";
        break;
      case "MEDIUM_MENU":
        snackDisplay = "Medium Menu";
        break;
      case "BIG_MENU":
        snackDisplay = "Large Menu";
        break;
      default:
        snackDisplay = "No Snack";
        break;
    } 

  const movieInfoReservation = document.getElementById("movieInfoReservation");
  movieInfoReservation.querySelector("#ticketSeats").textContent = `Seats: ${localStorage.getItem("selectedSeats")}`;
  movieInfoReservation.querySelector("#ticketTheater").textContent = `Theater: ${localStorage.getItem("theater")}`;
  movieInfoReservation.querySelector("#ticketMovie").textContent = `Movie: ${movie.title}`;
  movieInfoReservation.querySelector("#ticketSnacks").textContent = `Snacks: ${snackDisplay}`;
  movieInfoReservation.querySelector("#totalPrice").textContent = `Total Price: ${localStorage.getItem("totalPrice")} kr.`;

  movieInfoReservation.style.display = "block";
}

async function saveCustomer() {
  const customer = {
    first_Name: document.getElementById("first_Name").value,
    last_Name: document.getElementById("last_Name").value,
    email: document.getElementById("email").value,
    birthday: document.getElementById("birthday").value,
  };

  try {
    let newCustomer = null;
    const response = await fetch(URLcustomer, makeOptions("POST", customer));
    if (response.ok) {
      newCustomer = await response.json();

      // After saving the customer, create tickets for each selected seat
      const selectedSeats = localStorage.getItem("selectedSeats").split(',');
      let tickets = [];

      // Create an array to hold the promises
      let ticketPromises = [];

      for (let seat of selectedSeats) {
        seat = await getSeatBySeatNumber(seat);
        const movie = await getMovieById(localStorage.getItem("movieId"));
        const showtime = await getShowtimeById(localStorage.getItem("showtime_id"));
        
        let snackName = localStorage.getItem("snackName");
        let snackPrice = localStorage.getItem("snackPrice");

        const snack = {
          snackType: snackName,
          price: snackPrice,
        };
        
        let snackData;

        const snackResponse = await fetch(`${url}/snacks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(snack),
        });
        if (snackResponse.ok) {
          snackData = await snackResponse.json();
        } else {
          // Handle the case where the snack creation request failed.
        }
        
        const ticket = {
          customer: newCustomer,
          movie: movie,
          showtime: showtime,
          seat: seat,
          snack: snackData,
        };

        // Create a new promise for the ticket creation request
        let ticketPromise = fetch(`${url}/ticket`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ticket),
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to create ticket');
          }
        })
        .then(ticketData => {
          // Update the snackData with the ticket_id
          const snackUpdate = {
            id: snackData.snack_id,
            snackType: snackData.snackType,
            price: snackData.price,
            ticket_ID: ticketData.ticket_ID,
          }

          const snackUpdateResponse = fetch(`${url}/snacks/${snackData.snack_ID}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(snackUpdate),
          });

          if (!snackUpdateResponse.ok) {
            // Handle the case where the snack update request failed.
          }

          tickets.push(ticketData);
          localStorage.setItem('tickets', JSON.stringify(tickets));
        });

        // Add the promise to the array
        ticketPromises.push(ticketPromise);
      }

      // Use Promise.all to wait for all the ticket creation requests to complete
      await Promise.all(ticketPromises);
    } else {
      // Handle the case where the customer creation request failed.
    }
  } catch (err) {
    console.log(err);
  }
}

  

document.addEventListener('DOMContentLoaded', (event) => {
  fetchCustomers();
});

function makeOptions(method, body) {
    const opts = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    };
  
    if (body) {
      opts.body = JSON.stringify(body);
    }
  
    return opts;
  }
  
function getSeatBySeatNumber(seat){
    return fetch(`${url}/seat/${seat}?showtimeId=${localStorage.getItem('showtime_id')}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => {return response.json()});
}

function getShowtimeById(showtimeId){
    return fetch(`${url}/showtime/id/${showtimeId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => {return response.json()});

}

document.getElementById("submitButtonId").addEventListener("click", async () => {
  saveCustomer();
  window.navigateTo('/order-confirmation');
});

showModal({
    id: null,
    first_Name: "",
    last_Name: "",
    email: "",
    birthday: "",
  });
