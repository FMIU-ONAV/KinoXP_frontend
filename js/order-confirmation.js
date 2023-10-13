async function generateReceipt() {
    const tickets = await JSON.parse(localStorage.getItem('tickets'));
    const receiptItems = document.getElementById("reciept-items");
    
    for (const ticket of tickets) {
      const ticketContainer = document.createElement("div");
      ticketContainer.className = "ticket-container";
  
      // Movie Title
      const movieTitle = document.createElement("h3");
      movieTitle.id = "movie-title";
      movieTitle.textContent = ticket.movie.title;
      ticketContainer.appendChild(movieTitle);
  
      // Date and Time
      const dateTime = document.createElement("p");
      dateTime.id = "date-time";
      const date = new Date(ticket.showtime.date);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      dateTime.textContent = date.toLocaleDateString('en-US', options);
      ticketContainer.appendChild(dateTime);
  
      // Theater and Seat
      const theaterId = localStorage.getItem("theater");
      const theaterSeat = document.createElement("p");
      theaterSeat.id = "theater-seat";
      theaterSeat.textContent = `Theater ${theaterId} - Seat ${ticket.seat.seat_number}`;
      ticketContainer.appendChild(theaterSeat);
  
      // Seat Price
      const seatPrice = document.createElement("p");
      seatPrice.id = "seat-price";
      seatPrice.textContent = `Seat Price: ${ticket.seat.seat_Price}kr.`;
      ticketContainer.appendChild(seatPrice);
  
      // Fake Barcode with a random pattern
      const barcode = document.createElement("div");
      barcode.className = "barcode";
      generateRandomBarcodePattern(barcode);
      ticketContainer.appendChild(barcode);
  
      receiptItems.appendChild(ticketContainer);
    }
  }
  
  // Function to generate a random barcode-like pattern
  function generateRandomBarcodePattern(element) {
    const pattern = [];
    for (let i = 0; i < 10; i++) {
      pattern.push(Math.random() >= 0.5 ? "#000" : "#fff");
    }
  }
  
  setTimeout(() => {
    generateReceipt();
  }, 6000);
  