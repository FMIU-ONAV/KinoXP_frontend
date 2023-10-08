import { getToken } from "./security.js";
import { getAllMovies } from "./main.js";
import { showEditMovieModal } from "./edit-movie.js";
import { showSelectDatesModal } from "./dates-movie.js";
import { showAddMovieModal } from "./add-movie.js";
import { deleteMovie } from "./delete-movie.js";

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNjQ5ZWZlYmUwYTk1YTVhN2QxZWRjZjUxOTFlZmQ3NyIsInN1YiI6IjY1MWQwODgwZWE4NGM3MDBhZWViY2NlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TwL5R3Z32Ni94MLkuljKLL8PnpX1idqQ8BqdWEs8M1w'
    }
  };

  function load () {
    fetch('https://api.themoviedb.org/3/authentication', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
    document.getElementById("add-movie").addEventListener("click", showAddMovieModal);
    makeMovieRows();
  }

export async function makeMovieRows() {
    console.log("Entering makeMovieRows() function");
    const movies = await getAllMovies();

    const rows = movies.map(movie => {
        return `
      <tr>
        <td>${movie.id}</td>  
        <td>${movie.title}</td>
        <td>Dates<button class="btn btn-primary" id="btn-select-dates" data-movie="${movie.id}">Select Dates</button></td>
        <td>Tickets Sold</td>
        <td><button class="btn btn-primary btn-view-movie" data-movie="${movie.id}">View</button></td>
        <td><button class="btn btn-warning btn-edit-movie" data-movie="${movie.id}">Edit</button></td>
        <td><button class="btn btn-danger" id="btn-delete-movie" data-movie="${movie.id}">Delete</button></td>
      </tr>
    `;
    });

    document.getElementById("movie-table-body").innerHTML = rows.join("");

    handleCrudBtns();

    console.log("Exiting makeMovieRows() function");

}


function handleSelectDatesClick(event) {
    const movieId = event.currentTarget.getAttribute("data-movie");
    showSelectDatesModal(movieId);
}

function handleViewMovieClick(event) {
    const movieId = event.currentTarget.getAttribute("data-movie");
    viewMovieDetails(movieId);
}

function handleEditMovieClick(event) {
    const movieId = event.currentTarget.getAttribute('data-movie');
    showEditMovieModal(movieId);
}

function handleDeleteMovieClick(event) {
    const movieId = event.currentTarget.getAttribute("data-movie");
    deleteMovie(movieId);
}

function handleCrudBtns() {
    document.querySelectorAll("#btn-select-dates").forEach(button => {
        button.removeEventListener("click", handleSelectDatesClick);
        button.addEventListener("click", handleSelectDatesClick);
    });

    document.querySelectorAll(".btn-view-movie").forEach(button => {
        button.removeEventListener("click", handleViewMovieClick);
        button.addEventListener("click", handleViewMovieClick);
    });

    document.querySelectorAll('.btn-edit-movie').forEach(button => {
        button.removeEventListener('click', handleEditMovieClick);
        button.addEventListener('click', handleEditMovieClick);
    });

    document.querySelectorAll("#btn-delete-movie").forEach(button => {
        button.removeEventListener("click", handleDeleteMovieClick);
        button.addEventListener("click", handleDeleteMovieClick);
    });
}

async function viewMovieDetails(movieId) {
    const movie = await getMovieById(movieId);
    console.log(movie);
    const modalTitle = document.querySelector('#movie-details-modal-label');
    const modalBody = document.getElementById('movie-details-modal-body');

    modalTitle.textContent = movie.title;
    modalBody.innerHTML = `
                <div class="row">
                    <div class="col-md-4">
                        <img src="${movie.imgRef}" alt="${movie.title}" class="img-fluid" />
                    </div>
                    <div class="col-md-8">
                        <p><b>Director:</b> ${movie.director}</p>
                        <p><b>Description:</b> ${movie.description}</p>
                        <p><b>Duration:</b> ${movie.duration} minutes</p>
                        <p><b>Age Limit:</b> ${movie.ageLimit}</p>
                        <p><b>Genres:</b> ${movie.categories.map(category => category.name).join(", ")}</p>
                    </div>
                </div>
            `;
    const modal = new bootstrap.Modal(document.getElementById('movie-details-modal-details'));
    modal.show();
}

export function getMovieById(movieId) {
    return fetch(`http://localhost:8081/movie/${movieId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.json());
}

export async function getAllCategories() {
    try {
        const response = await fetch('http://localhost:8081/category', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const categories = await response.json();
            return categories;
        } else {
            console.error('Failed to fetch categories.');
            return [];
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

load();




