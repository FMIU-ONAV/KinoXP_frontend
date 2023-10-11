const selectedSeats = [];
const rowContainer = document.getElementById('seatRow');
const continueButton = document.getElementById('continueButton');
const seatCountDisplay = document.getElementById('seatCount');
const decrementButton = document.getElementById('decrementBtn');
const incrementButton = document.getElementById('incrementBtn');
let seatCount = 0;
const normalSeat = 110;
const vipSeat = normalSeat + 12;
const discount = 25;
const url = 'kinoxpkea.azurewebsites.net' // 'localhost:8081'

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json'
    }
};

async function initializeSeats(seatsData) {
    const rowContainer = document.getElementById('seatRow');
    rowContainer.innerHTML = '';  // Clear existing content

    for (let j = 0; j < 25; j++) {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');

        for (let i = 0; i < 16; i++) {
            const seatDiv = document.createElement('div');
            seatDiv.classList.add('seat');

            const seatId = String.fromCharCode(65 + j) + (i + 1); // Assign a unique seat ID
            seatDiv.textContent = seatId;
            seatDiv.dataset.seatId = seatId;

            // Check if the seat is reserved and apply the appropriate class
            const isReserved = seatsData.some(seatInfo => seatInfo.seat_number === seatId && seatInfo.isReserved);
            if (isReserved) {
                seatDiv.classList.add('reserved-seat');
            } else if (j >= 15 && j < 25 && i >= 5 && i < 11) {
                seatDiv.classList.add('golden-seat');
            }

            // Add your logic to handle golden seats (if needed)

            // Remove click event listener for reserved seats
            if (!isReserved) {
                seatDiv.addEventListener('click', () => handleSeatClick(seatId));
            }

            rowDiv.appendChild(seatDiv);
        }

        rowContainer.appendChild(rowDiv);
    }
}

async function loadSeats() {
    try {
        const response = await fetch('http://localhost:8081/seat', options);
        const seatsData = await response.json();
        initializeSeats(seatsData);  // Call initializeSeats with seat data
    } catch (error) {
        console.error('Error loading seats:', error.message);
    }
}

 loadSeats();

function handleSeatClick(seatNumber) {
    const seatDiv = document.querySelector(`.seat[data-seat-id="${seatNumber}"]`);
    if (seatDiv.style.backgroundColor === 'red') {

        unclickConnectedSeats(seatNumber);
        return;
    }
    if (seatDiv.style.backgroundColor === 'red') {
        // Find the closest available seat
        const closestAvailableSeat = findClosestAvailableSeat(seatNumber);
        if (closestAvailableSeat) {
            handleSeatClick(closestAvailableSeat);
        } else {
            console.log('No available seats nearby.');
        }
        return;
    }

    if (seatCount > 1) {
        console.log(seatCount);
        let firstChar = seatNumber.substring(0, 1);
        let substring = seatNumber.substring(1);
        let parsedNumber = parseInt(substring);

        const seatsToMarkRed = [];

        for (let i = 0; i < seatCount; i++) {
            let e = firstChar + parsedNumber;
            parsedNumber++;
            console.log(e);
            seatsToMarkRed.push(e);
        }

        // Mark all selected seats as red
        seatsToMarkRed.forEach((seat) => {
            const seatDiv = document.querySelector(`.seat[data-seat-id="${seat}"]`);
            seatDiv.style.backgroundColor = 'red';
            selectedSeats.push(seat);
            // Disable further clicking on this seat
            seatDiv.removeEventListener('click', () => handleSeatClick(seat));
            //resetSeatCount();

        });
    } else {
        seatDiv.style.backgroundColor = 'red';
        selectedSeats.push(seatNumber);
        // Disable further clicking on this seat
        seatDiv.removeEventListener('click', () => handleSeatClick(seatNumber));
        // Update seat count display
        seatCountDisplay.textContent = selectedSeats.length;
    }

    updateContinueButtonStatus();
}
function unclickConnectedSeats(seatNumber) {
    const connectedSeats = getConnectedSeats(seatNumber);

    connectedSeats.forEach((seat) => {
        const seatDiv = document.querySelector(`.seat[data-seat-id="${seat}"]`);

        // Check if the seat is a golden seat
        const isGolden = seatDiv.classList.contains('golden-seat');

        // Set the appropriate background color based on whether it's a golden seat or not
        seatDiv.style.backgroundColor = isGolden ? 'goldenrod' : 'white';

        const index = selectedSeats.indexOf(seat);
        if (index !== -1) {
            selectedSeats.splice(index, 1);
        }

        seatDiv.addEventListener('click', () => handleSeatClick(seat));
        seatCountDisplay.textContent = selectedSeats.length;
        selectedSeats.length = seatCount;
    });
}


function getConnectedSeats(seatNumber) {
    // Modify this function based on how seats are connected in your UI
    // For example, if seats are connected in a row, you might traverse the row to get connected seats
    // Return an array of seat numbers that are connected to the given seatNumber
    // This is a placeholder, replace it with your actual logic to determine connected seats
    // For now, we'll assume seats are labeled sequentially (e.g., A1, A2, A3, ... B1, B2, B3, ...)
    const firstChar = seatNumber.substring(0, 1);
    const substring = seatNumber.substring(1);
    const parsedNumber = parseInt(substring);

    const connectedSeats = [];

    for (let i = 0; i < seatCount; i++) {
        const e = firstChar + (parsedNumber + i);
        connectedSeats.push(e);
    }

    return connectedSeats;
}

function findClosestAvailableSeat(seatNumber) {
    let parsedNumber = parseInt(seatNumber.substring(1));

    // Search for the closest available seat
    for (let offset = 1; offset <= seatCount; offset++) {
        let leftSeat = seatNumber.substring(0, 1) + (parsedNumber - offset);
        let rightSeat = seatNumber.substring(0, 1) + (parsedNumber + offset);

        const leftSeatDiv = document.querySelector(`.seat[data-seat-id="${leftSeat}"]`);
        const rightSeatDiv = document.querySelector(`.seat[data-seat-id="${rightSeat}"]`);

        if (leftSeatDiv && leftSeatDiv.style.backgroundColor !== 'red') {
            return leftSeat;
        }

        if (rightSeatDiv && rightSeatDiv.style.backgroundColor !== 'red') {
            return rightSeat;
        }
    }

    return null;  //ingen ledig
}



function updateContinueButtonStatus() {
    continueButton.disabled = selectedSeats.length === 0;
}

function increment() {
    if (seatCount < 25) { // Adjust the maximum number of seats here (e.g., 3)
        seatCount++;
        seatCountDisplay.textContent = seatCount;
    }
}
function decrement() {
    if (seatCount > 1) {
        seatCount--;
        seatCountDisplay.textContent = seatCount;
    }
}

function isSeatGolden(seatNumber) {
    // Determine if a seat is golden based on your criteria
    // For example, check if the seat has the class 'golden-seat'
    const seatDiv = document.querySelector(`.seat[data-seat-id="${seatNumber}"]`);
    return seatDiv && seatDiv.classList.contains('golden-seat');
}

async function reserveSelectedSeats() {
    const theaterIds = [1, 2];  // Example: theater IDs for the selected seats

    const th={
        theater_ID: 1,
        total_rows: 16,
        total_Seat_Per_Row: 25
    }

    const updatedSeats = selectedSeats.map((seatNumber, index) => {
        const currentTime = new Date().getHours();
        const isGolden = isSeatGolden(seatNumber); // ser og sæddet er golden

        // Determine seat price based on whether it's golden or not
        const seat_price = (currentTime < 16) ? (isGolden ? (vipSeat - discount) : (normalSeat - discount)) : (isGolden ? vipSeat : normalSeat);



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

    await fetch(`http://${url}/seats`, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to reserve seats');
            }
            console.log('Seats reserved successfully!');
            // Perform actions after successful reservation
        })
        .catch(error => {
            console.error('Error reserving seats:', error.message);
        });
}

//initializeSeats();
continueButton.addEventListener('click',reserveSelectedSeats)
incrementButton.addEventListener('click', increment);
decrementButton.addEventListener('click', decrement);

