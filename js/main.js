async function main() {
  const movies = await getCurrentMovies()
  makeCards(movies);
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

    heroSection.classList.add('slide-left');

    setTimeout(() => {
      heroSection.style.backgroundImage = newBackgroundImage;
      heroSection.classList.remove('slide-left');

      currentMovieIndex = (currentMovieIndex + 1) % movies.length;
    }, 1000);
  } else {
    heroSection.style.backgroundImage = 'url(images/default-hero-image.jpg)';
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
                <p class="card-text" style="color: ${movie.ageLimit>=18?"red":""}">${movie.ageLimit}+</p>
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
  return fetch(`http://localhost:8081/movie/${movieId}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
  }).then(response => response.json());
}

export function getAllMovies() {
  return fetch('http://localhost:8081/movie', {
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
  return fetch('http://localhost:8081/movie/current', {
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

main();