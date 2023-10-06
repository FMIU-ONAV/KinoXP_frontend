import { getToken } from "./security.js";

export function showSelectDatesModal(movieId) {
    const myModal = new bootstrap.Modal(document.getElementById('dates-modal'));
    console.log(movieId);
    document.getElementById("dates-modal-title").innerHTML = `Select Dates for Movie ID: ${movieId}`;
    document.getElementById("btn-add-dates").addEventListener("click", () => addDatesToMovie(movieId));
    myModal.show()
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