import { getShowtimesByMovieId, getMovieById } from "./main.js"
import { url } from "./main.js";


export async function viewShowtimes(movieId){
    window.navigateTo("/admin/showtimes");
    const showtimes = await getShowtimesByMovieId(movieId);
    const movie = await getMovieById(movieId);
    localStorage.setItem("movieId", movieId);
    document.getElementById("showtimes-title").innerHTML = `Showtimes for ${movie.title}`;
    const showtimesTable = document.getElementById("showtimes-table-body");
    const rows = showtimes.map(async showtime => {
        const tickets = await getTicketsByShowtimeId(showtime.showtime_ID);
        console.log(tickets)
        const ticketsSold = tickets.length;
        // Determine the color based on the number of tickets sold
        let color = 'red';
        if (ticketsSold > 150) {
            color = 'green';
        } else if (ticketsSold > 50) {
            color = 'yellow';
        }
        return `<tr>
            <td>${showtime.showtime_ID}</td>  
            <td>${showtime.date}</td>
            <td>${showtime.time}</td>
            <td style="color: ${color};">${ticketsSold}</td>
            <td><button class="btn btn-danger" id="btn-delete-movie" data-showtime="${showtime.showtime_ID}">Delete</button></td>
        </tr>`;
    });
    showtimesTable.innerHTML = (await Promise.all(rows)).join("");
}


function getTicketsByShowtimeId(showtimeId){
    return fetch(`${url}/ticket/showtime/${showtimeId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.json());
}


if (window.location.pathname.includes('/admin/showtimes')) {
    document.getElementById("back-button").addEventListener("click", function(){
        window.navigateTo("/movies-admin");
    });

    document.getElementById("button-csv").addEventListener("click", async function(){
        const movieId = localStorage.getItem("movieId");
        const movie = await getMovieById(movieId);
        var csv_data = tableToCSV();
        downloadCSVFile(csv_data, movie.title);
    });
    
}

function tableToCSV() {
    var csv_data = [];
    var rows = document.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
        var cols = rows[i].querySelectorAll('td,th');
        var csvrow = [];
        for (var j = 0; j < cols.length; j++) {
            csvrow.push(cols[j].innerText);
        }
        csv_data.push(csvrow.join(","));
    }
    csv_data = csv_data.join('\n');
    return csv_data;
}

function downloadCSVFile(csv_data, movieTitle) {
    var CSVFile = new Blob([csv_data], { type: "text/csv" });
    var temp_link = document.createElement('a');
    temp_link.download = `${movieTitle}_showtimes.csv`;
    var url = window.URL.createObjectURL(CSVFile);
    temp_link.href = url;
    temp_link.style.display = "none";
    document.body.appendChild(temp_link);
    temp_link.click();
    document.body.removeChild(temp_link);
    setTimeout(() => {
        window.URL.revokeObjectURL(url);
    }, 100);
}



