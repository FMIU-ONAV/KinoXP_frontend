const rowContainer = document.getElementById('seatRow');

for (let j = 0; j < 25; j++) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');

    for (let i = 0; i < 16; i++) {
        const seatDiv = document.createElement('div');
        seatDiv.classList.add('seat');
        const seatNumber = (j * 16) + i + 1;
        seatDiv.textContent = seatNumber;
        seatDiv.setAttribute('data-seat-number', seatNumber); // Store seat number as an attribute
        rowDiv.appendChild(seatDiv);
    }

    rowContainer.appendChild(rowDiv);
}

const seats = document.getElementsByClassName('seat');
const continueButton = document.getElementById('continueButton');

Array.from(seats).forEach(seat => {
    seat.addEventListener('click', () => {
        const seatNumber = seat.getAttribute('data-seat-number'); // Get seat number
        toggleSeatReservation(seatNumber);
    });
});

function toggleSeatReservation(seatNumber) {
    const seat = document.querySelector(`.seat[data-seat-number="${seatNumber}"]`);

    if (seat.style.backgroundColor !== 'red') {
        seat.style.backgroundColor = 'red';
        updateSeatReservation(seatNumber, true);
    } else {
        seat.style.backgroundColor = 'white';
        updateSeatReservation(seatNumber, false);
    }

    updateContinueButtonStatus();
}

function updateContinueButtonStatus() {
    const redSeats = document.querySelectorAll('.seat[style*="background-color: red"]');
    continueButton.disabled = redSeats.length === 0;
}

function updateSeatReservation(seatNumber, isReserved) {
    const endpoint = 'http://localhost:8881/seats';

    const payload = {
        seatNumber,
        isReserved
    };

    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update seat reservation');
            }

            console.log(`Seat ${seatNumber} reservation updated: ${isReserved ? 'Reserved' : 'Unreserved'}`);
        })
        .catch(error => {
            console.error('Error updating seat reservation:', error);
        });
}
