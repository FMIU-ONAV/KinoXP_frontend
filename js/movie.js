import { getMovieById, getShowtimesByMovieId } from './main.js';

export async function displayMovieDetails(movieId){
    const movie = await getMovieById(movieId);
    const movieShowtimes = await getShowtimesByMovieId(movieId);
    console.log(movie);
    console.log(movieShowtimes);
    let html = ``;
    let container = document.getElementById('movie-details');
    let heroSection = document.getElementById('hero-section');
    const dropdown = document.getElementById('showtimes-dropdown');
    const showtimesContainer = document.getElementById('showtimes-container');
    const loadingSkeleton = document.querySelector('.skeleton-loader');
    const heroLoader = document.getElementById('loading-hero');
  
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
  
        showtimesContainer.innerHTML = `<div class="col-md-8" id="times">${showtimesHTML}</div>`;
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
        `;
    const reserveBtn = document.getElementById('reserve-btn');
    reserveBtn.addEventListener('click', function(event) {
      const selectedShowtime = document.querySelector('input[name="timeRadio"]:checked');
      if (selectedShowtime) {
        const showtime = selectedShowtime.value;
        const date = dropdown.value;
        localStorage.setItem('movieId', movieId);
        localStorage.setItem('date', date);
        localStorage.setItem('showtime', showtime);
      } else {
        alert('Please select a showtime');
        event.stopImmediatePropagation();
      }
    });
    
     
    loadingSkeleton.style.display = 'none';
    heroLoader.style.display = 'none';
    container.style.display = 'block';
    heroSection.style.display = 'block';
  
      container.innerHTML = html;
    }, 1000);
  }