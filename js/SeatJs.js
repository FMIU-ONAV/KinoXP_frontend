// Function to fetch seats by seat number

function fetchSeatsBySeatNumber(seatNumber) {
    const endpoint = `http://localhost:8081/seats-by-number?seatNumber=${seatNumber}`;
    fetch(endpoint, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNjQ5ZWZlYmUwYTk1YTVhN2QxZWRjZjUxOTFlZmQ3NyIsInN1YiI6IjY1MWQwODgwZWE4NGM3MDBhZWViY2NlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TwL5R3Z32Ni94MLkuljKLL8PnpX1idqQ8BqdWEs8M1w\'\n'
                ,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch seats by seat number');
            }
            return response.json();
        })
        .then(data => {
            // Handle the received data (list of seats) from the backend
            console.log('Seats with seat number:', data);
            // You can update your frontend UI or perform further actions here
        })
        .catch(error => {
            console.error('Error fetching seats:', error.message);
        });
}

// Existing code to handle seat clicks
const rowContainer = document.getElementById('seatRow');
const continueButton = document.getElementById('continueButton');

// Function to update seat reservation
function updateSeatReservation(seat, isReserved) {
    const endpoint = 'http://localhost:8081/seats/' + seat; // Construct the URL with the seat ID

    // Update isReserved to 1 when marking a seat as reserved
    if (isReserved) {
        isReserved = 1;
    }

    const payload = {
        seatNumber: seat,
        isReserved
    };

    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNjQ5ZWZlYmUwYTk1YTVhN2QxZWRjZjUxOTFlZmQ3NyIsInN1YiI6IjY1MWQwODgwZWE4NGM3MDBhZWViY2NlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TwL5R3Z32Ni94MLkuljKLL8PnpX1idqQ8BqdWEs8M1w', // Replace with your actual access token
        },
        body: JSON.stringify(payload),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update seat reservation');
            }
            console.log(`Seat ${seat} reservation updated: ${isReserved ? 'Reserved' : 'Unreserved'}`);
            return response.json(); // Parse the response JSON if needed
        })
        .then(data => {
            // Handle the data if needed
            // Example: update UI or perform further actions
        })
        .catch(error => {
            console.error('Error updating seat reservation:', error.message);
        });
}


function initializeSeatSelection() {
    const seats = document.querySelectorAll('.seat');
    seats.forEach(seat => {
        seat.addEventListener('click', () => handleSeatClick(seat));
    });
}

function handleSeatClick(seat) {
    if (seat.style.backgroundColor !== 'red') {
        seat.style.backgroundColor = 'red';
        // You can store the selected seats in an array or object
        // For example, add the selected seat to an array
        selectedSeats.push(seat.textContent);
    } else {
        seat.style.backgroundColor = 'white';
        // Remove the deselected seat from the array
        const index = selectedSeats.indexOf(seat.textContent);
        if (index !== -1) {
            selectedSeats.splice(index, 1);
        }
    }
    updateContinueButtonStatus();
}

const selectedSeats = [];

// Update your continue button click handler to reserve selected seats
continueButton.addEventListener('click', () => reserveSelectedSeats(selectedSeats));

// Function to reserve selected seats
function reserveSelectedSeats(selectedSeats) {
    selectedSeats.forEach(seatNumber => {
        updateSeatReservation(seatNumber, true);
    });
}

// Call the function to initialize seat selection
initializeSeatSelection();



// Function to handle seat clicks and update seat reservation
/*function handleSeatClick(seat) {
    if (seat.style.backgroundColor !== 'red') {
        seat.style.backgroundColor = 'red';
        updateSeatReservation(seat.textContent, true);

    } else {
        seat.style.backgroundColor = 'white';
        updateSeatReservation(seat.textContent, false);
    }
    updateContinueButtonStatus();
}*/


// Function to update the continue button status
function updateContinueButtonStatus() {
    const redSeats = document.querySelectorAll('.seat[style*="background-color: red"]');
    continueButton.disabled = redSeats.length === 0;
}

// Function to disable red seats
function disableRedSeats() {
    const redSeats = document.querySelectorAll('.seat[style*="background-color: red"]');
    redSeats.forEach(seat => {
        seat.style.pointerEvents = 'none';
    });
}

// Initialize seats and event listeners
for (let j = 0; j < 25; j++) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');

    for (let i = 0; i < 16; i++) {
        const seatDiv = document.createElement('div');
        seatDiv.classList.add('seat');
        const seatId = String.fromCharCode(65 + j) + (i + 1); // Assign a unique seat ID
        seatDiv.textContent = seatId;
        seatDiv.dataset.seatId = seatId; // Store seat ID as a data attribute
        seatDiv.addEventListener('click', () => handleSeatClick(seatDiv));
        rowDiv.appendChild(seatDiv);
    }

    rowContainer.appendChild(rowDiv);
}

// Add event listener for the continue button
continueButton.addEventListener('click', disableRedSeats);

