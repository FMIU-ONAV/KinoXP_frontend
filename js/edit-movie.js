import { getMovieById, getAllCategories } from "./movies-admin.js";

export async function showEditMovieModal(movieId) {
    const myModal = new bootstrap.Modal(document.getElementById('edit-movie-modal'));
    document.getElementById("edit-modal-title").innerHTML = "Edit Movie";
    const movie = await getMovieById(movieId);
    const allCategories = await getAllCategories();

    const categoryCheckboxes = allCategories.map(category => `
        <label>
            <input type="checkbox" class="category-checkbox" data-category-id="${category.category_ID}" ${movieHasCategory(movie, category) ? 'checked' : ''}> ${category.name}
        </label>
    `).join('<br>');

    document.getElementById("edit-values").innerHTML = `
        <div class="col-md-12" id="movie-result">
            <h3 id="movie-title"><b>Title:</b><input type="text" id="updated-title" class="form-control" value="${movie.title}"></h5>
            <h5 id="movie-runtime"><b>Runtime:</b> <input type="text" id="updated-duration" class="form-control" value="${movie.duration}"> minutes</h5>
            <h5 id="movie-genres"><b>Genres:</b> <div id="categories-checkboxes">${categoryCheckboxes}</div></h5>
            <h5 id="movie-description"><b>Description:</b> <textarea id="updated-description" class="form-control">${movie.description}</textarea></h5>
            <h5 id="movie-director"><b>Director:</b> <input type="text" id="updated-director" class="form-control" value="${movie.director}"></h5>
            <h5 id="movie-age-limit"><b>Age Limit:</b> <input type="text" id="updated-age-limit" placeholder="Age limit" class="form-control" value="${movie.ageLimit}"/></h5>
            <br>
        </div>
    `;

    const categoryCheckboxesElements = document.querySelectorAll('.category-checkbox');
    categoryCheckboxesElements.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateCategories(movie);
        });
    });

    document.getElementById("btn-submit-edit").addEventListener("click", () => {
        // Pass the updatedMovie object to the editMovie function
        editMovie(movieId, movie);
    });
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

function editMovie(movieId) {
    console.log("Inside edit Movie function");
    const updatedTitle = document.getElementById("updated-title").value;
    const updatedDirector = document.getElementById("updated-director").value;
    const updatedDescription = document.getElementById("updated-description").value;
    const updatedDuration = document.getElementById("updated-duration").value;
    const updatedAgeLimit = document.getElementById("updated-age-limit").value;

    // Extract selected categories
    const selectedCategoryCheckboxes = document.querySelectorAll('.category-checkbox:checked');
    const selectedCategories = Array.from(selectedCategoryCheckboxes).map(checkbox => ({
        category_ID: parseInt(checkbox.getAttribute('data-category-id')),
        name: getCategoryNameById(parseInt(checkbox.getAttribute('data-category-id'))),
    }));

    const updatedMovie = {
        id: movieId,
        title: updatedTitle,
        director: updatedDirector,
        description: updatedDescription,
        duration: updatedDuration,
        ageLimit: updatedAgeLimit,
        imgRef: document.getElementById("poster_ref").src,
        categories: selectedCategories,
    };

    console.log("Updating movie with ID:", movieId);

    fetch(`http://localhost:8081/movie/${movieId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(updatedMovie),
    })
        .then(response => {
            console.log("Response status:", response.status);
            if (response.ok) {
                console.log("Movie updated successfully.");
            } else {
                console.error("Error updating movie.");
            }
            makeMovieRows();
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
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