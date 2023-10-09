const selectedSeats = [];
const rowContainer = document.getElementById('seatRow');
const continueButton = document.getElementById('continueButton');



function initializeSeats() {
    for (let j = 0; j < 25; j++) {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');

        for (let i = 0; i < 16; i++) {
            const seatDiv = document.createElement('div');
            seatDiv.classList.add('seat');

            const seatId = String.fromCharCode(65 + j) + (i + 1); // Assign a unique seat ID
            seatDiv.textContent = seatId;
            seatDiv.dataset.seatId = seatId;

            // golden sædder
            if (j >= 15 && j < 25 && i >= 5 && i < 11) {
                seatDiv.classList.add('golden-seat');
            }

            seatDiv.addEventListener('click', () => handleSeatClick(seatId));
            rowDiv.appendChild(seatDiv);
        }

        rowContainer.appendChild(rowDiv);
    }
}


function handleSeatClick(seatNumber) {
    const seatDiv = document.querySelector(`.seat[data-seat-id="${seatNumber}"]`);

    if (seatDiv.style.backgroundColor !== 'red') {
        seatDiv.style.backgroundColor = 'red';
        selectedSeats.push(seatNumber);

    } else {
        seatDiv.style.backgroundColor = 'white';
        const index = selectedSeats.indexOf(seatNumber);
        if (index !== -1) {
            selectedSeats.splice(index, 1);
        }
    }
    updateContinueButtonStatus();
}

const normalSeat = 110;
const VipSeat = normalSeat + 12;
const discount = 25;



function isSeatGolden(seatNumber) {
    // Determine if a seat is golden based on your criteria
    // For example, check if the seat has the class 'golden-seat'
    const seatDiv = document.querySelector(`.seat[data-seat-id="${seatNumber}"]`);
    return seatDiv && seatDiv.classList.contains('golden-seat');
}


async function reserveSelectedSeats() {
    const theaterIds = [1, 2];  //

    const th={
        theater_ID: 1,
        total_rows: 16,
        total_Seat_Per_Row: 25
    }

    const updatedSeats = selectedSeats.map((seatNumber, index) => {
        const currentTime = new Date().getHours();
        const isGolden = isSeatGolden(seatNumber); // ser og sæddet er golden

        // Determine seat price based on whether it's golden or not
        const seat_price = (currentTime < 16) ? (isGolden ? ( VipSeat - discount) : (normalSeat - discount)) : normalSeat;


        return {
            seat_number: seatNumber,
            isReserved: 1,
            seat_Price: seat_price,
            theater: th,
        };
    });
    console.log(updatedSeats)

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSeats),
    };

    await fetch('http://localhost:8081/seats', options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to reserve seats');
            }
            console.log('Seats reserved successfully!');
        })
        .catch(error => {
            console.error('Error reserving seats:', error.message);
        });
}





function updateContinueButtonStatus() {

    continueButton.disabled = selectedSeats.length === 0;
}


function fetchSeatsBySeatNumber(seatNumber) {
    const endpoint = `http://localhost:8081/seat/${seatNumber}`;
    fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch seats by seat number');
            }
            return response.json();
        })
        .then(data => {
            console.log('Seats with seat number:', data);
            // Handle the received data (list of seats) from the backend
        })
        .catch(error => {
            console.error('Error fetching seats:', error.message);
        });
}


initializeSeats();


continueButton.addEventListener('click',reserveSelectedSeats)