import { getToken } from "./security.js";
import { makeMovieRows } from "./movies-admin.js";

const url = 'kinoxpkea.azurewebsites.net' // 'localhost:8081'

export function deleteMovie(movieId) {
    fetch(`https://${url}/movie/${movieId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
    })
        .then(response => {
            if (response.ok) {
                console.log("Movie deleted");
            } else {
                console.error(`Error deleting movie ${movieId}`);
            }
        })
        .catch(err => {
            console.error(err);
        }).then(() => {
            makeMovieRows();
    })
}