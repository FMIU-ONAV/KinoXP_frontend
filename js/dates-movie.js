import { getToken } from "./security.js";
import { url } from "./main.js";


export function showSelectDatesModal(movieId) {
  const myModal = new bootstrap.Modal(document.getElementById('dates-modal'));
  document.getElementById("dates-modal-title").innerHTML = `Select Dates for Movie ID: ${movieId}`;

  function addDatesToMovie() {
    const startDateStr = document.getElementById("input-start-date").value;
    const endDateStr = document.getElementById("input-end-date").value;
  
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
  
    // Check if startDate and endDate are valid dates
    if (isNaN(startDate) || isNaN(endDate)) {
      console.error("Invalid start date or end date");
      return;
    }
  
    const selectedTimes = getSelectedTimes();
  
    const allDateTimes = [];
  
    while (startDate <= endDate) {
      for (const time of selectedTimes) {
        const [hours, minutes] = time.split(":");
  
        // Create a new Date object for each date and time combination
        const dateTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), hours, minutes);
  
        // Check if dateTime is a valid date and time
        if (isNaN(dateTime)) {
          console.error("Invalid date or time" + dateTime);
          continue;
        }
  
        allDateTimes.push(dateTime);
      }
      startDate.setDate(startDate.getDate() + 1);
    }
  
    postShowTimes(allDateTimes, movieId);
  
    document.getElementById("input-start-date").value = "";
    document.getElementById("input-end-date").value = "";
  }
  
  

  document.getElementById("btn-add-dates").addEventListener("click", addDatesToMovie);
  myModal.show()
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
  
  function postShowTimes(dateTimes) {
    let movieId = document.getElementById("dates-modal-title").innerHTML;
    let movieIdInsideFunction = movieId.split(":")[1].trim();

    
    // Get the selected theater ID
    let theaterId = document.querySelector('input[name="theater"]:checked').value;
  
    dateTimes.forEach(dateTime => {
      const showTime = {
        date: dateTime.toISOString().split("T")[0],
        time: dateTime.toTimeString().split(" ")[0]
      };
  
  
      let urlToUse = `${url}/showtime/${movieIdInsideFunction}?theaterId=${theaterId}`;
  
  
      fetch(urlToUse, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(showTime),
      }, getToken())
        .then(response => {
          if (response.ok) {
          } else {
            console.error("Error adding showtime");
          }
        })
        .catch(error => {
          console.error(error);
        });
    });
  }
  