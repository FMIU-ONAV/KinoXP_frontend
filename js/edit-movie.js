import { getAllCategories, makeMovieRows } from "./movies-admin.js";
import { getToken } from "./security.js";
import { getMovieById } from "./main.js";

const url = 'kinoxpkea.azurewebsites.net' // 'localhost:8081'


function handleSubmitEditClick(movieId, movieCopy, event) {
    // Create a new copy of the updated movie object
    const updatedMovie = Object.assign({}, movieCopy);

    // Update the copied object with the latest values from the form
    updatedMovie.title = document.getElementById("updated-title").value;
    updatedMovie.director = document.getElementById("updated-director").value;
    updatedMovie.description = document.getElementById("updated-description").value;
    updatedMovie.duration = document.getElementById("updated-duration").value;
    updatedMovie.ageLimit = document.getElementById("updated-age-limit").value;

    // Extract selected categories
    const selectedCategoryCheckboxes = document.querySelectorAll('.category-checkbox:checked');
    const selectedCategories = Array.from(selectedCategoryCheckboxes).map(checkbox => ({
        category_ID: parseInt(checkbox.getAttribute('data-category-id')),
        name: getCategoryNameById(parseInt(checkbox.getAttribute('data-category-id'))),
    }));

    updatedMovie.categories = selectedCategories;

    // Pass the copied object to the editMovie function
    editMovie(movieId, updatedMovie);

    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
}

export async function showEditMovieModal(movieId) {
    const myModal = new bootstrap.Modal(document.getElementById('edit-movie-modal'));
    document.getElementById("edit-modal-title").innerHTML = "Edit Movie";
    const movie = await getMovieById(movieId);
    const allCategories = await getAllCategories();

    // Create a deep copy of the movie object
    const movieCopy = JSON.parse(JSON.stringify(movie));

    const categoryCheckboxes = allCategories.map(category => `
        <label>
            <input type="checkbox" class="category-checkbox" data-category-id="${category.category_ID}" ${movieHasCategory(movieCopy, category) ? 'checked' : ''}> ${category.name}
        </label>
    `).join('<br>');

    document.getElementById("edit-values").innerHTML = `
        <div class="col-md-12" id="movie-result">
            <img src="https://image.tmdb.org/t/p/w500${movieCopy.imgRef}" id="poster_ref" alt="poster" width="200px">
            <h3 id="movie-title"><b>Title:</b><input type="text" id="updated-title" class="form-control" value="${movieCopy.title}"></h3>
            <h5 id="movie-runtime"><b>Runtime:</b> <input type="text" id="updated-duration" class="form-control" value="${movieCopy.duration}"> minutes</h5>
            <h5 id="movie-genres"><b>Genres:</b> <div id="categories-checkboxes">${categoryCheckboxes}</div></h5>
            <h5 id="movie-description"><b>Description:</b> <textarea id="updated-description" class="form-control">${movieCopy.description}</textarea></h5>
            <h5 id="movie-director"><b>Director:</b> <input type="text" id="updated-director" class="form-control" value="${movieCopy.director}"></h5>
            <h5 id="movie-age-limit"><b>Age Limit:</b> <input type="text" id="updated-age-limit" placeholder="Age limit" class="form-control" value="${movieCopy.ageLimit}"/></h5>
            <br>
        </div>
    `;

    const categoryCheckboxesElements = document.querySelectorAll('.category-checkbox');
    categoryCheckboxesElements.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateCategories(movieCopy);
        });
    });
    
    const btnSubmitEdit = document.getElementById("btn-submit-edit");

    // Remove existing event listener
    const oldListener = btnSubmitEdit.onclick;
    if (oldListener) {
        btnSubmitEdit.removeEventListener("click", oldListener);
    }

    // Add new event listener
    const newListener = handleSubmitEditClick.bind(null, movieId, movieCopy);
    btnSubmitEdit.onclick = newListener;
    btnSubmitEdit.addEventListener("click", newListener);

    myModal.show();
}


function updateCategories(updatedMovie) {
    const checkedCategoryCheckboxes = document.querySelectorAll('.category-checkbox:checked');

    const categoryIds = Array.from(checkedCategoryCheckboxes).map(checkbox => parseInt(checkbox.getAttribute('data-category-id')));

    updatedMovie.categories = categoryIds.map(id => {
        return {
            category_ID: id,
            name: getCategoryNameById(id),
        };
    });
}

async function editMovie(movieId, updatedMovie) {
    console.log("Entering editMovie() function");

    // Create a new copy of the updated movie object
    const copiedUpdatedMovie = Object.assign({}, updatedMovie);

    // Update the copied object with the latest values from the form
    copiedUpdatedMovie.title = document.getElementById("updated-title").value;
    copiedUpdatedMovie.director = document.getElementById("updated-director").value;
    copiedUpdatedMovie.description = document.getElementById("updated-description").value;
    copiedUpdatedMovie.duration = document.getElementById("updated-duration").value;
    copiedUpdatedMovie.ageLimit = document.getElementById("updated-age-limit").value;

    // Extract selected categories
    const selectedCategoryCheckboxes = document.querySelectorAll('.category-checkbox:checked');
    const selectedCategories = Array.from(selectedCategoryCheckboxes).map(checkbox => ({
        category_ID: parseInt(checkbox.getAttribute('data-category-id')),
        name: getCategoryNameById(parseInt(checkbox.getAttribute('data-category-id'))),
    }));

    copiedUpdatedMovie.categories = selectedCategories;

    console.log("Updated movie object:", copiedUpdatedMovie);

    // Send the updated movie data to the server using fetch
    const response = await fetch(`https://kinoxpkea.azurewebsites.net/movie/${movieId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(copiedUpdatedMovie)
    });

    // Display a success message once the movie has been updated
    if (response.ok) {
        console.log("Movie updated successfully!");
        // Update the movie rows in the table
        makeMovieRows();
    } else {
        console.error("Movie update failed!");
    }

    return;
}
function getCategoryNameById(categoryId) {
    const categoryMap = {
        28: 'Action',
        12: 'Adventure',
        16: 'Animation',
        35: 'Comedy',
        80: 'Crime',
        99: 'Documentary',
        18: 'Drama',
        10751: 'Family',
        14: 'Fantasy',
        36: 'History',
        27: 'Horror',
        10402: 'Music',
        9648: 'Mystery',
        10749: 'Romance',
        878: 'Science Fiction',
        10770: 'TV Movie',
        53: 'Thriller',
        10752: 'War',
        37: 'Western'
    };

    return categoryMap[categoryId] || 'Unknown';
}

function movieHasCategory(movie, categoryId) {
    return movie.categories.some(category => category.category_ID === categoryId);
}