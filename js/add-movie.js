import { getToken } from "./security.js";
import { makeMovieRows } from "./movies-admin.js";

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNjQ5ZWZlYmUwYTk1YTVhN2QxZWRjZjUxOTFlZmQ3NyIsInN1YiI6IjY1MWQwODgwZWE4NGM3MDBhZWViY2NlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TwL5R3Z32Ni94MLkuljKLL8PnpX1idqQ8BqdWEs8M1w'
    }
  };

export function showAddMovieModal() {
    const myModal = new bootstrap.Modal(document.getElementById('movie-modal'));
    document.getElementById("movie-modal-title").innerHTML = "Add Movie";
    document.getElementById("movie-search-btn").addEventListener("click", searchMovies);
    document.getElementById("btn-add-movie").addEventListener("click", addMovie);
    myModal.show()
}

function searchMovies() {
    let search = document.getElementById("search").value;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=0649efebe0a95a5a7d1edcf5191efd77&query=${search}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        let movies = data.results;
        let output = '';
        movies.map(movie => {
          output += `<div class="col-md-3">
            <div class="well text-center" id="movie-result">
                <h5 id="movie-id">${movie.id}</h5>
                <h5 id="movie-title">${movie.title}</h5>
                <h5 id="movie-release">Release Date: ${movie.release_date}</h5>
                <button class="btn btn-primary details-btn" data-movie-id="${movie.id}">Select Movie</button>
            </div>
          </div>`;
        });
        document.getElementById("result").innerHTML = output;
  
        document.querySelectorAll(".details-btn").forEach(button => {
          button.addEventListener("click", () => {
              const movieId = button.getAttribute("data-movie-id");
              getDetails(movieId, options); 
          });
      });
      })
      .catch(err => console.error(err));
  }

  function getDetails(id, options) {
    fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            let movie = response;
            let genres = movie.genres.map(genre => genre.name).join(", ");
            let output = `<div class="col-md-12" id="movie-result">
            <h3 id="movie-title"><b><span id="title-value">${movie.title}</span></b></h5>
            <span id="movie-id" hidden>${movie.id}</span>
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" id="poster_ref" alt="poster" width="200px">
            <img src="https://image.tmdb.org/t/p/original${movie.backdrop_path}" id="backdrop_ref" alt="poster" width="200px" style="display: none;">
            <h5 id="movie-release-date"><b>Release Date:</b> <span id="release-date-value">${movie.release_date}</span></h5>
            <h5 id="movie-runtime"><b>Runtime:</b> <span id="duration-value">${movie.runtime}</span> minutes</h5>
            <h5 id="movie-genres"><b>Genres:</b> <span id="genres-value">${genres}</span></h5>
            <h5 id="movie-description"><b>Description:</b> <span id="description-value">${movie.overview}</span></h5>
            <div id="cast"></div>
            <br>
            <input
                type="text"
                id="age-limit"
                placeholder="Age limit"
                class="form-control"
              />
            </div>
            `;
            document.getElementById("result").innerHTML = output;

            const addButton = document.getElementById("btn-add-movie");
            addButton.setAttribute("data-genres", JSON.stringify(movie.genres));

            fetch(`https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`, options)
                .then(response => response.json())
                .then(response => {
                    let credits = response;
                    let director = credits.crew.find(member => member.job === "Director");
                    if (director) {
                        let output = `
                        <h5 id="movie-director"><b>Director:</b> <span id="director-value">${director.name}</span></h5>
                        `;
                        document.getElementById("cast").innerHTML = output;
                    }
                })
                .catch(err => console.error(err));
                
        })
        .catch(err => console.error(err));
}

const addedMovieIds = [];

async function addMovie() {
  const addButton = document.getElementById("btn-add-movie");
  const genres = JSON.parse(addButton.getAttribute("data-genres"));
  const categories = genres.map(genre => {
    return {
      category_ID: genre.id, 
      name: genre.name
    };
  });

  const movieData = {
      title: document.getElementById("title-value").innerHTML,
      director: document.getElementById("director-value").innerHTML,
      description: document.getElementById("description-value").innerHTML,
      duration: document.getElementById("duration-value").innerHTML,
      ageLimit: document.getElementById("age-limit").value,
      imgRef: document.getElementById("poster_ref").src,
      backdropRef: document.getElementById("backdrop_ref").src,
      categories: categories
  };

    const movieId = document.getElementById("movie-id").innerText;

    if (addedMovieIds.includes(movieId)) {
        alert("This movie is already added to the database.");
        return;
    }
  const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(movieData),
  };

  fetch('http://localhost:8081/movie', options)
      .then(response => response.json())
      .then(response => {
          console.log(response);
          console.log(options.body);
          makeMovieRows();

          addedMovieIds.push(movieId);
      })
      .catch(err => console.error(err));
}