

function connectMovieToShowtimes(existingShowtimes, movieId) {
    // Iterate through existing showtimes and connect the movie to each one
    existingShowtimes.forEach(showtime => {
        showtime.movies.push({
            movie_ID: movieId
        });
        // Make a POST request to update the showtime with the new movie association
        fetch(`http://localhost:8081/update-showtime/${showtime.id}/add-movie/${movieId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(showtime),
        })
            .then(response => {
                if (response.ok) {
                    console.log("Movie connected to showtime");
                } else {
                    console.error("Error connecting movie to showtime");
                }
            })
            .catch(error => {
                console.error(error);
            });
    });
}


function postShowTimes(dateTimes, movieId) {

    dateTimes.forEach(dateTime => {
        const showTimeData = {
            date: dateTime.toISOString().split("T")[0],
            time: dateTime.toTimeString().split(" ")[0]
        }

        // Check if a showtime with the same date and time combination exists
        checkExistingShowtime(showTimeData)
            .then(existingShowtimes => { //i ental i stedet?
                if (existingShowtimes.length > 0) {
                    // Showtime(s) already exist, connect the new movie to them
                    connectMovieToShowtimes(existingShowtimes, movieId);
                    console.log("Connected movie to existing showtime(s)");
                } else {
                    // Showtime doesn't exist, create a new one*/
                    const newShowtime = {
                        date: showTimeData.date,
                        time: showTimeData.time,
                        movies: [
                            {
                                movie_ID: movieId,
                            },
                        ],
                    };

                    // Add the new showtime
                    addNewShowtime(newShowtime);
                }
            })
            .catch(error => {
                console.error(error);
            });
    });
}

function checkExistingShowtime(showTimeData) {
    return fetch(`http://localhost:8081/showtime/${showTimeData.date}/${showTimeData.time}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Error checking showtime existence");
        });
}

// Function to add a new showtime
function addNewShowtime(newShowtime) {
    fetch('http://localhost:8081/showtime', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newShowtime),
    })
        .then(response => {
            if (response.ok) {
                console.log("New showtime added");
            } else {
                console.error("Error adding showtime");
            }
        })
        .catch(error => {
            console.error(error);
        });
}
