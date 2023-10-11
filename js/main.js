import { displayMovieDetails } from './movie.js';

export const url = 'http://localhost:8081' // 'localhost:8081'

export async function main() {
  const movies = await getCurrentMovies()
  makeCards(movies);
  setUniqueCategoriesInDropdown(movies);

  // Update the JavaScript code to use the Bootstrap dropdown API
  const dropdownMenu = document.querySelector('.dropdown-menu');
  dropdownMenu.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default behavior (e.g., navigating to a new page)
    event.stopPropagation(); // Stop event propagation to parent elements

    const selectedCategory = event.target.textContent;
    filterMoviesByCategory(selectedCategory, movies);

    // Close the dropdown menu
    const dropdownToggle = document.querySelector('#dropdownMenuButton');
    dropdownToggle.classList.remove('show');
    dropdownMenu.classList.remove('show');
  });
}

let currentMovieIndex = 0;
const heroSection = document.getElementById('hero-section');
let movies = []; // Store the currently running movies

async function fetchAndUpdateHeroSection() {
  movies = await getCurrentMovies();
  updateHeroSection();
}

function updateHeroSection() {
  if (movies.length > 0) {
    const currentMovie = movies[currentMovieIndex];
    const newBackgroundImage = `url(${currentMovie.backdropRef})`;

    heroSection.style.backgroundImage = newBackgroundImage;

    currentMovieIndex = (currentMovieIndex + 1) % movies.length;
  } else {
    heroSection.style.backgroundImage = 'url(default-hero-image.jpg)';
    heroSection.innerHTML = '<h1 id="welcome-title">No movies currently running</h1>';
  }
}


fetchAndUpdateHeroSection();

setInterval(fetchAndUpdateHeroSection, 5000);


function makeCards(movies){
    const cardsHTML = movies.map(movie => {

        let genres = movie.categories.map(genre => genre.name).join(", ");
        return `
        <div class="col-md-4">
            <div class="card" style="width: 18rem;">
              <img src="${movie.imgRef}" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">${genres}</p>
                <p class="card-text" style="color: ${movie.ageLimit > 0 && movie.ageLimit >= 18 ? "red" : ""}"> ${movie.ageLimit > 0 ? movie.ageLimit + "+" : ""}</p>
                            </div>
              <div class="card-footer">
                <a href="/movie" class="btn btn-primary" id="reserve-btn" data-movie="${movie.id}">Reserve Tickets</a>
              </div>
                <p class="card-text" style="color: ${movie.ageLimit > 0 && movie.ageLimit >= 18 ? "red" : ""}"> ${movie.ageLimit > 0 ? movie.ageLimit + "+" : ""}</p>
                            </div>
                            <div class="card-footer">
                            <a  class="btn btn-secondary" id="rate-btn" data-movie="${movie.id}" data-movie-name="${movie.title}">
                            <i class="fas fa-star" style="color: gold;"></i>
                            <span class="rate-text">Rate Movie</span>
                        </a>
                        <a href="/movie" class="btn btn-primary" id="reserve-btn" data-movie="${movie.id}">Reserve Tickets</a>
                    </div>
            </div>
          </div>
        `
    })
    const cardContainer = document.getElementById('cardsRow');
    cardContainer.innerHTML = cardsHTML.join('');

    // Example: Retrieving the 'data-movie' attribute from an element with a specific ID
    //const movieId = document.getElementById('rate-btn').getAttribute('data-movie');


    handleRateMovieClick();
    handleReserveClick();
}

function handleRateMovieClick() {
    document.querySelectorAll(".btn-secondary").forEach(button => {
        button.addEventListener("click", function () {
            const movieName = this.getAttribute("data-movie-name");
            const movieId = this.getAttribute("data-movie");
            $("#ratingModalLabel").text(`Rate ${movieName}`);
            $("#rating-modal").modal("show");

            //const movieId = this.getAttribute("data-movie");

            handleRatingSubmission(movieId);

        });
    });
}

function handleRatingSubmission(movieId) {
    const submitRatingBtn = document.getElementById("submit-rating-btn");

    submitRatingBtn.addEventListener("click", function () {
        // Get the values of the ticket ID and rating from the form inputs
        const ticketId = document.getElementById("ticketId").value;
        const ratingValue = document.getElementById("rating").value;

        //eventuelt: const ticketExists = checkTicketExistence(ticketId);
        //if (ticketExists) {


        /*Create an object to hold the rating data
        const ratingData = {
          rating_value: ratingValue, // The rating value (1-5)
          movie: {
            id: movieId, // The movie ID associated with the rating
          },
          ticket: {
            id: ticketId, // The ticket ID associated with the rating
          },
        };*/

        //Create an object to hold the rating data
        const ratingData = {
            rating_value: ratingValue, // The rating value (1-5)
            movie_idfk: movieId, // The movie ID associated with the rating
            ticket_idfk: ticketId // The ticket ID associated with the rating

        };


        // Send the rating data to the server using a fetch request
        fetch('http://localhost:8081/rating', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(ratingData),
        })
            .then((response) => response.json())
            .then((createdRating) => {
                // Handle the response from the server, e.g., display a success message
                console.log("Rating submitted successfully:", createdRating);
                // Close the modal (if needed)
                $("#rating-modal").modal("hide");
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                //console.log(ratingValue);
                //console.log(movieId);
                //console.log(ticketId);

                console.error("Error submitting rating:", error);

                if (response.status === 404) {
                    alert("Ticket not found");
                }
                else {
                    alert("Error submitting rating: " + error.message);
                }

            });
    });
}


function handleReserveClick(){
    document.querySelectorAll("#reserve-btn").forEach(button => {
        button.addEventListener("click", function() {
            let movieId = this.getAttribute("data-movie");
            localStorage.setItem("movieId", movieId);

            displayMovieDetails(movieId);
        });
    });
}

async function displayMovieDetails(movieId){
  const movie = await getMovieById(movieId);
  console.log(movie);
  let html = ``;
  let container = document.getElementById('movie-details');
  let heroSection = document.getElementById('hero-section');

  // Check if the container exists, if not wait for 100ms and check again
  while (!container) {
    await new Promise(resolve => setTimeout(resolve, 100));
    container = document.getElementById('movie-details');
    heroSection = document.getElementById('hero-section');
  }

  setTimeout(() => {
    heroSection.style.backgroundImage = `url(${movie.backdropRef})`;
    html = `
      <div id="movie" class="d-flex">
        <div id="poster-title" class="col-6">
          <img src="${movie.imgRef}" alt="${movie.title}" class="img-fluid" width="400px" id="details-poster"/>
          <h2>${movie.title}</h2>
        </div>
        <div id="movie-details" class="col-12 fluid">
          <div>
            <p><b>Director:</b> ${movie.director}</p>
            <p><b>Description:</b> ${movie.description}</p>
            <p><b>Duration:</b> ${movie.duration} minutes</p>
            <p><b>Age Limit:</b> ${movie.ageLimit}</p>
            <p><b>Genres:</b> ${movie.categories.map(category => category.name).join(", ")}</p>
          </div>
        </div>
      </div>`;
    container.innerHTML = html;
  }, 1000);
}



export function getMovieById(movieId) {
  return fetch(`${url}/movie/${movieId}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
  }).then(response => response.json());
}

export function getAllMovies() {
  return fetch(`${url}/movie`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(response => response.json())
    .then(response => {
      console.log(response);
      return response;
    })
    .catch(err => console.error(err));
}

export function getCurrentMovies(){
  return fetch(`${url}/movie/current`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(response => response.json())
    .then(response => {
      return response;
    })
    .catch(err => console.error(err));
}

export function getShowtimesByMovieId(movieId) {
  return fetch(`${url}/showtime/${movieId}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
  }).then(response => response.json());
}

function setUniqueCategoriesInDropdown(movies) {
  const uniqueCategories = Array.from(
    new Set(movies.flatMap(movie => movie.categories.map(category => category.name)))
  );

  const dropdownMenu = document.querySelector('.dropdown-menu');

  // Create a new dropdown menu item
  const allCategoriesItem = document.createElement('a');
  allCategoriesItem.classList.add('nav-link', 'dropdown-item');
  allCategoriesItem.setAttribute('data-category', '');

  // Append the new dropdown menu item to the existing list of items
  dropdownMenu.appendChild(allCategoriesItem);

  // Add the remaining dropdown menu items
  uniqueCategories.forEach(category => {
    const dropdownMenuItem = document.createElement('a');
    dropdownMenuItem.classList.add('nav-link', 'dropdown-item');
    dropdownMenuItem.setAttribute('data-category', category);
    dropdownMenuItem.textContent = category;

    dropdownMenu.appendChild(dropdownMenuItem);
  });
}



function filterMoviesByCategory(selectedCategory, movies) {
  // Check if the selected category is "All Categories"
  if (selectedCategory === "All Categories") {
    makeCards(movies);
    return;
  }

  // Filter the movies by the selected category
  const filteredMovies = movies.filter(movie =>
    movie.categories.some(category => category.name === selectedCategory));

  makeCards(filteredMovies);
}



setUniqueCategoriesInDropdown(movies)


main();