import { url } from "./main.js";
import { getMovieById } from "./main.js";

const URLcustomers = `${url}/customers`;
const URLcustomer = `${url}/customer`;

document.getElementById("customer-table-body").addEventListener("click", handleTableClick);
document.getElementById("submitButtonId").addEventListener("click", saveCustomer);

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

  const movieInfoReservation = document.getElementById("movieInfoReservation");
  movieInfoReservation.querySelector("#ticketSeats").textContent = `Seats: ${localStorage.getItem("selectedSeats")}`;
  movieInfoReservation.querySelector("#ticketTheater").textContent = `Theater: ${localStorage.getItem("theater")}`;
  movieInfoReservation.querySelector("#ticketMovie").textContent = `Movie: ${movie.title}`;
  movieInfoReservation.querySelector("#ticketSnacks").textContent = `Snacks: `;

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
        console.log(newCustomer);
  
        // After saving the customer, create tickets for each selected seat
        const selectedSeats = localStorage.getItem("selectedSeats").split(',');
        const theater = localStorage.getItem("theater");
  
        for (let seat of selectedSeats) {
          seat = await getSeatBySeatNumber(seat);
          const movie = await getMovieById(localStorage.getItem("movieId"));
          const showtime = await getShowtimeById(localStorage.getItem("showtime_id"));
          console.log("Inside seat " + JSON.stringify(seat));
          console.log("Inside movie " + JSON.stringify(movie));
          console.log("Inside showtime " + JSON.stringify(showtime));
          
          const snackName = localStorage.getItem("snackName");
          const snackPrice = localStorage.getItem("snackPrice");

          const ticket = {
            customer: newCustomer,
            movie: movie,
            showtime: showtime,
            seat: seat,
            snack: {
                name: snackName,
                price: snackPrice,
            },
          };
  
          console.log(JSON.stringify(ticket));
  
          const ticketResponse = await fetch(`${url}/ticket`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(ticket),
          });
  
          if (ticketResponse.ok) {
            const ticketData = await ticketResponse.json();
            console.log(ticketData);
            
            
          } else {
            // Handle the case where the ticket creation request failed.
          }
        }
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

showModal({
    id: null,
    first_Name: "",
    last_Name: "",
    email: "",
    birthday: "",
  });
