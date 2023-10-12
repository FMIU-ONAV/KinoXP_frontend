import { url } from "./main.js";
const movieId = localStorage.getItem('movieId');
const showtime = localStorage.getItem('showtime');
const date = localStorage.getItem('date');
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

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json'
    }
};

async function initializeSeats(seatsData) {
    const rowContainer = document.getElementById('seatRow');
    rowContainer.innerHTML = '';  // Clear existing content
    const showtimeData = await fetchShowtime(movieId, date, showtime);
    const theater_ID = showtimeData.theater.theater_ID;
    localStorage.setItem('theater', theater_ID);
    localStorage.setItem('showtime_id', showtimeData.showtime_ID)
    const rows = theater_ID === 1 ? 20 : 25;
    const columns = theater_ID === 1 ? 12 : 16;

    const goldenRows = 10;  // Number of rows with golden seats (centered)
    const goldenColumnsStart = Math.floor(columns / 4);  // Golden seats start from the middle of the first half
    const goldenColumnsEnd = Math.floor(3 * columns / 4);  // Golden seats end at the middle of the second half

    for (let j = 0; j < rows; j++) {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');

        for (let i = 0; i < columns; i++) {
            const seatDiv = document.createElement('div');
            seatDiv.classList.add('seat');

            const seatId = String.fromCharCode(65 + j) + (i + 1); // Assign a unique seat ID
            seatDiv.textContent = seatId;
            seatDiv.dataset.seatId = seatId;

            const isReserved = seatsData.some(seatInfo => seatInfo.seat_number === seatId && seatInfo.isReserved);

            if (isReserved) {
                seatDiv.classList.add('reserved-seat');
            } 
            if (j >= (rows - goldenRows) && i >= goldenColumnsStart && i < goldenColumnsEnd) {
                seatDiv.classList.add('golden-seat');
            }


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
        const showtimeData = await fetchShowtime(movieId, date, showtime);
        console.log(showtimeData);
        const seatsData = await fetchSeats(showtimeData.showtime_ID);
        console.log(seatsData);
        initializeSeats(seatsData);  
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
   // Example: theater IDs for the selected seats


    const showtimeData = await fetchShowtime(movieId, date, showtime);
    console.log(showtimeData)
    const theater_ID = showtimeData.theater.theater_ID;
    console.log(theater_ID)

    const th={
        theater_ID: theater_ID,
        total_rows: theater_ID===1?20:25,
        total_Seat_Per_Row: theater_ID===1?12:16,
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
            showtime: showtimeData,
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

    await fetch(`${url}/seats`, options)
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

    localStorage.setItem('selectedSeats', selectedSeats);
}

async function fetchShowtime(movieId, date, showtime) {
    const response = await fetch(`${url}/showtimes/${movieId}?date=${date}&time=${showtime}`, options);
    const showtimeData = await response.json();
    return showtimeData;
}

async function fetchSeats(showtimeId) {
    const response = await fetch(`${url}/seats/${showtimeId}`, options);
    const seatsData = await response.json();
    return seatsData;
}


//initializeSeats();
continueButton.addEventListener('click',reserveSelectedSeats)
incrementButton.addEventListener('click', increment);
decrementButton.addEventListener('click', decrement);

