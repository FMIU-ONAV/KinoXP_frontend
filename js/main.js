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
            </div>
          </div>
        `
    })
    const cardContainer = document.getElementById('cardsRow');
    cardContainer.innerHTML = cardsHTML.join('');

    handleReserveClick();
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