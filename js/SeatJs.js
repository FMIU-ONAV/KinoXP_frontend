const rowContainer = document.getElementById('seatRow');

for (let j = 0; j < 25; j++) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');

    for (let i = 0; i < 16; i++) {
        const seatDiv = document.createElement('div');
        seatDiv.classList.add('seat');
        seatDiv.textContent = (j * 16) + i + 1;
        rowDiv.appendChild(seatDiv);
    }

    rowContainer.appendChild(rowDiv);
}

const seats = document.getElementsByClassName('seat');
const continueButton = document.getElementById('continueButton');

Array.from(seats).forEach(seat => {
    seat.addEventListener('click', () => {
        if (seat.style.backgroundColor !== 'red') {
            seat.style.backgroundColor = 'red';
        } else {
            seat.style.backgroundColor = 'white';
        }
        updateContinueButtonStatus();
    });
});

function updateContinueButtonStatus() {
    const redSeats = document.querySelectorAll('.seat[style*="background-color: red"]');
    continueButton.disabled = redSeats.length === 0;
}

function disableRedSeats() {
    const redSeats = document.querySelectorAll('.seat[style*="background-color: red"]');
    redSeats.forEach(seat => {
        seat.style.pointerEvents = 'none';
    });

    function updateSeatReservation(seat, isReserved) {
        const endpoint = 'http://localhost:8881/seats';

        const payload = {
            seatNumber: seat,
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

                console.log(`Seat ${seat} reservation updated: ${isReserved ? 'Reserved' : 'Unreserved'}`);
            })
            .catch(error => {
                console.error('Error updating seat reservation:', error);
            });
    }
updateSeatReservation()
}