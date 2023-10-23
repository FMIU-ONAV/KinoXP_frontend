import { getToken } from "./security.js";
import { makeMovieRows } from "./movies-admin.js";
import { url } from "./main.js";


export function deleteMovie(movieId) {
    fetch(`${url}/movie/${movieId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
    })
        .then(response => {
            if (response.ok) {
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