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

async function displayMovieDetails(movieId){
  const movie = await getMovieById(movieId);
  const movieShowtimes = await getShowtimesByMovieId(movieId);
  console.log(movie);
  console.log(movieShowtimes);
  let html = ``;
  let container = document.getElementById('movie-details');
  let heroSection = document.getElementById('hero-section');
  const dropdown = document.getElementById('showtimes-dropdown');
  const showtimesContainer = document.getElementById('showtimes-container');

  const showtimesByDate = movieShowtimes.reduce((acc, showtime) => {
    const date = showtime.date.split(' ')[0]; // Extract the date part
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(showtime);
    return acc;
  }, {});
  

  // Check if the container exists, if not wait for 100ms and check again
  while (!container) {
    await new Promise(resolve => setTimeout(resolve, 100));
    container = document.getElementById('movie-details');
    heroSection = document.getElementById('hero-section');
  }

  setTimeout(() => {
    heroSection.style.backgroundImage = `url(${movie.backdropRef})`;
    Object.keys(showtimesByDate).forEach(date => {
      const option = document.createElement('option');
      option.text = option.value = date;
      dropdown.add(option);
    });

    dropdown.addEventListener('change', function() {
      const selectedDate = this.value;
      const selectedShowtimes = movieShowtimes.filter(showtime => showtime.date === selectedDate);
    
      let showtimesHTML = '';
      selectedShowtimes.forEach(showtime => {
        showtimesHTML += `
          <div class="radio-button">
            <input class="form-check-input" type="radio" value="${showtime.time}" name="timeRadio" id="${showtime.time}">
            <label><h4 id="showtime-text">${showtime.time}</h4></label>
          </div>
        `;
      });
    
      showtimesContainer.innerHTML = `<div class="col-md-8">${showtimesHTML}</div>`;
    });
    

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
      </div>
      <div id="go-to-seat-reservation">
  <button class="btn btn-primary"><a href="/theater">Reserve Seats</a></button>
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

function getShowtimesByMovieId(movieId) {
  return fetch(`http://localhost:8081/showtime/${movieId}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
  }).then(response => response.json());
}

main();