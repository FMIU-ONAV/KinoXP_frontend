import { getToken } from "./security.js";

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNjQ5ZWZlYmUwYTk1YTVhN2QxZWRjZjUxOTFlZmQ3NyIsInN1YiI6IjY1MWQwODgwZWE4NGM3MDBhZWViY2NlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TwL5R3Z32Ni94MLkuljKLL8PnpX1idqQ8BqdWEs8M1w'
    }
  };

document.addEventListener("DOMContentLoaded", () => {
  console.log(getToken());
      fetch('https://api.themoviedb.org/3/authentication', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));

    document.getElementById("add-movie").addEventListener("click", showAddMovieModal);
    makeMovieRows();
});

export function getAllMovies() {
  return fetch('http://localhost:8081/movie', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    }
  })
    .then(response => response.json())
    .then(response => {
      console.log(response);
      return response;
    })
    .catch(err => console.error(err));
}


async function makeMovieRows() {
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

    document.querySelectorAll("#btn-select-dates").forEach(button => {
        console.log("Select Dates button found")
        button.addEventListener("click", () => {
            const movieId = button.getAttribute("data-movie");
            showSelectDatesModal(movieId);
        });
    });

    document.querySelectorAll(".btn-view-movie").forEach(button => {
        button.addEventListener("click", () => {
            const movieId = button.getAttribute("data-movie");
            viewMovieDetails(movieId);
        });
    });

    console.log("Number of Edit Movie buttons found:", document.querySelectorAll(".btn-edit-movie").length);

    document.querySelectorAll(".btn-edit-movie").forEach(button => {
        button.addEventListener("click", () => {
            console.log("Edit Movie button clicked");
            const movieId = button.getAttribute("data-movie");
            showEditMovieModal(movieId);
        });
    });
  document.querySelectorAll("#btn-delete-movie").forEach(button => {
      button.addEventListener("click", () => {
            const movieId = button.getAttribute("data-movie");
            deleteMovie(movieId);
        });
    });


}


function showAddMovieModal() {
    const myModal = new bootstrap.Modal(document.getElementById('movie-modal'));
    document.getElementById("movie-modal-title").innerHTML = "Add Movie";
    document.getElementById("movie-search-btn").addEventListener("click", searchMovies);
    document.getElementById("btn-add-movie").addEventListener("click", addMovie);
    myModal.show()
}

function showSelectDatesModal(movieId) {
    const myModal = new bootstrap.Modal(document.getElementById('dates-modal'));
    console.log(movieId);
    document.getElementById("dates-modal-title").innerHTML = `Select Dates for Movie ID: ${movieId}`;
    document.getElementById("btn-add-dates").addEventListener("click", () => addDatesToMovie(movieId));
    myModal.show()
}

async function showEditMovieModal(movieId) {
    const myModal = new bootstrap.Modal(document.getElementById('edit-movie-modal'));
    document.getElementById("edit-modal-title").innerHTML = "Edit Movie";
    const movie = await getMovieById(movieId);
    console.log(movie);

    document.getElementById("edit-values").innerHTML = `
        <div class="col-md-12" id="movie-result">
            <h3 id="movie-title"><b>Title:</b><input type="text" id="updated-title" class="form-control" value="${movie.title}"></h5>
            <h5 id="movie-runtime"><b>Runtime:</b> <input type="text" id="updated-duration" class="form-control" value="${movie.duration}"> minutes</h5>
            <h5 id="movie-genres"><b>Genres:</b> <input type="text" id="updated-genres" class="form-control" value="${movie.categories.map(category => category.name).join(', ')}"></h5>
            <h5 id="movie-description"><b>Description:</b> <textarea id="updated-description" class="form-control">${movie.description}</textarea></h5>
            <h5 id="movie-director"><b>Director:</b> <input type="text" id="updated-director" class="form-control" value="${movie.director}"></h5>
            <h5 id="movie-age-limit"><b>Age Limit:</b> <input type="text" id="updated-age-limit" placeholder="Age limit" class="form-control"  value="${movie.ageLimit}"/></h5>
            <br>
        </div>
    `;

    document.getElementById("btn-submit-edit").addEventListener("click", () => editMovie(movieId));
    myModal.show();
}


function addDatesToMovie(movieId) {
  const startDateStr = document.getElementById("input-start-date").value;
  const endDateStr = document.getElementById("input-end-date").value;

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const selectedTimes = getSelectedTimes();

  const allDateTimes = [];

  while (startDate <= endDate) {
    for (const time of selectedTimes) {
      const dateTime = new Date(startDate);
      const [hours, minutes] = time.split(":");
      dateTime.setHours(hours);
      dateTime.setMinutes(minutes);
      allDateTimes.push(dateTime);
    }
    startDate.setDate(startDate.getDate() + 1);
  }

  postShowTimes(allDateTimes, movieId);
}

function getSelectedTimes() {
  const selectedTimes = [];
  const checkboxes = document.querySelectorAll(".form-check-input");

  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      selectedTimes.push(checkbox.value);
    }
  });

  return selectedTimes;
}

function postShowTimes(dateTimes, movieId) {

  dateTimes.forEach(dateTime => {
    const showTime = {
      date: dateTime.toISOString().split("T")[0],
      time: dateTime.toTimeString().split(" ")[0],
      movies: [
        {
          movie_ID: movieId, 
        },
      ],
    };

    fetch('http://localhost:8081/showtime', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(showTime),
    }, getToken())
      .then(response => {
        if (response.ok) {
          console.log("Showtime added");
        } else {
          console.error("Error adding showtime");
        }
      })
      .catch(error => {
        console.error(error);
      });
  });
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
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" id="poster_ref" alt="poster" width="200px">
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

function addMovie() {
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
      categories: categories
  };

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
      })
      .catch(err => console.error(err));
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

function editMovie(movieId) {
    console.log("Inside edit Movie function");
    const updatedTitle = document.getElementById("updated-title").value;
    const updatedDirector = document.getElementById("updated-director").value;
    const updatedDescription = document.getElementById("updated-description").value;
    const updatedDuration = document.getElementById("updated-duration").value;
    const updatedAgeLimit = document.getElementById("updated-age-limit").value;

    const updatedMovie = {
        id: movieId,
        title: updatedTitle,
        director: updatedDirector,
        description: updatedDescription,
        duration: updatedDuration,
        ageLimit: updatedAgeLimit,
        categories: [{
            category_ID: 28,
            name: "Action"
        }]
    };

    console.log("Updating movie with ID:", movieId);

    fetch(`http://localhost:8081/movie/${movieId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(updatedMovie),
    })
        .then(response => {
            console.log("Response status:", response.status);
            if (response.ok) {
                console.log("Movie updated successfully.");
                // Optionally, close the edit modal or update the view
            } else {
                console.error("Error updating movie.");
            }
            makeMovieRows();
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

function getMovieById(movieId) {
    return fetch(`http://localhost:8081/movie/${movieId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
        },
    }).then(response => response.json());
}





function deleteMovie(movieId) {
    fetch(`http://localhost:8081/movie/${movieId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
    })
        .then(response => {
            if (response.ok) {
                console.log("Movie deleted");
            } else {
                console.error(`Error deleting movie ${movieId}`);
            }
        })
        .catch(err => {
            console.error(err);
        }).then(() => {
            makeMovieRows();
    })
}



