async function main() {
  const movies = await getAllMovies()
  makeCards(movies);
}


function makeCards(movies){
    const cardsHTML = movies.map(movie => {
        let genres = movie.categories.map(genre => genre.name).join(", ");
        return `
        <div class="col-md-4">
            <div class="card" style="width: 18rem;">
              <img src="${movie.imgRef}" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">${genres}</p>
                <p class="card-text" style="color: ${movie.ageLimit>=18?"red":""}">${movie.ageLimit}+</p>
                <a href="#" class="btn btn-primary">Reserve Tickets</a>
              </div>
            </div>
          </div>
        `
    })
    const cardContainer = document.getElementById('cardsRow');
    cardContainer.innerHTML = cardsHTML.join('');
}

export function getAllMovies() {
  return fetch('http://localhost:8081/movie', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(response => response.json())
    .then(response => {
      console.log(response);
      return response;
    })
    .catch(err => console.error(err));
}

main();