// FOR MOBILE COMPATIBILITY
const menuButton = document.getElementById("menu-button");
const mobileMenu = document.getElementById("mobile-menu");

// TOGGLE IN MOBILE
menuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
});

const API_KEY = 'api_key=1cf5b8147ab680f53d0de7c63cf0d3d2';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const SEARCH_API_URL = BASE_URL + '/search/movie?' + API_KEY;
const GENRE_URL = BASE_URL + '/genre/movie/list?' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const grid = document.getElementById('grid');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');

let currentPage = 1;
let currentSearchQuery = '';

// FUNCTION FOR LOADING THE GENRE OPTIONS
function loadGenres() {
    const genreSelect = document.getElementById('genre-select');
    fetch(GENRE_URL)
        .then(res => res.json())
        .then(data => {
            genreSelect.innerHTML = `<option value="all">All Genres</option>`;
            data.genres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre.id;
                option.textContent = genre.name;
                genreSelect.appendChild(option);
            });
        });
}

// FUNCTON FOR FETCHING MOVIES
function getMovies(url, page = 1) {
    fetch(`${url}&page=${page}`)
        .then(res => res.json())
        .then(data => {
            if (data.results.length > 0) {
                showMovies(data.results);
            } else {
                grid.innerHTML = `<p class="text-center text-gray-400 text-lg">No movies found. Try a different search!</p>`;
            }
            updateButtons(page, data.total_pages);
        });
}

// FUNCTION FOR  DISPLAYING MOVIES 
function showMovies(data) {
    grid.innerHTML = '';
    data.forEach(movie => {
        const { title, poster_path, release_date, id } = movie;

        const movieEl = document.createElement('div');
        movieEl.classList.add(
            'bg-black',
            'text-white',
            'rounded-lg',
            'shadow-lg',
            'overflow-hidden',              // CSS STYLING OF MOVIE CARDS
            'border',
            'border-gray-700',
            'transform',
            'transition-transform',
            'hover:scale-105'
        );

        movieEl.innerHTML = `
            <img src="${poster_path ? IMG_URL + poster_path : "https://fakeimg.pl/300x450/?text=NOT FOUND"}" 
                 alt="${title}" 
                 class="w-full">
            <div class="p-4">
                <h4 class="text-xl font-bold text-red-600 mb-2">${title}</h4>
                <p class="text-gray-400 text-sm mb-4">Released on: ${release_date || 'N/A'}</p>
                <a id="watch-${id}" class="block mt-4 bg-red-600 hover:bg-red-700 text-center py-2 rounded-lg shadow-lg cursor-pointer">
                    Watch Trailer
                </a>
            </div>
        `;

        grid.appendChild(movieEl);

        fetchTrailer(id, `watch-${id}`);
    });
}

// FUNCTION FOR FETCHING YOUTUBE TRAILER LINKS
function fetchTrailer(movieId, buttonId) {
    const trailerUrl = `${BASE_URL}/movie/${movieId}/videos?${API_KEY}`;
    fetch(trailerUrl)
        .then(res => res.json())
        .then(data => {
            const youtubeTrailer = data.results.find(
                video => video.site === "YouTube" && video.type === "Trailer"
            );

            const watchButton = document.getElementById(buttonId);

            if (youtubeTrailer) {
                watchButton.href = `https://www.youtube.com/watch?v=${youtubeTrailer.key}`;
                watchButton.target = "_blank"; // Open in a new tab
            } else {
                watchButton.href = "#";
                watchButton.classList.add("cursor-not-allowed", "opacity-50");      // INCASE TRAILER IS UNAVAILABLE
                watchButton.textContent = "Trailer Not Found";
            }
        })
        .catch(error => {
            console.error('Error fetching trailer:', error);
        });
}

// ENABLING AND DISABLING OF PAGE BUTTONS
function updateButtons(page, totalPages) {
    prevButton.disabled = page === 1;
    nextButton.disabled = page === totalPages;
}

// EVENT LISTENER 
prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchMoviesWithCurrentQuery();
    }
});

nextButton.addEventListener('click', () => {
    currentPage++;
    fetchMoviesWithCurrentQuery();
});

// FOR FETCHING MOVIES BASED OIN USER SEARCH
function fetchMoviesWithCurrentQuery() {
    const url = currentSearchQuery
        ? `${SEARCH_API_URL}&query=${currentSearchQuery}`
        : API_URL;
    getMovies(url, currentPage);
}


document.getElementById('search-btn').addEventListener('click', () => {
    currentSearchQuery = document.getElementById('search-input').value.trim();
    currentPage = 1;

    const genre = document.getElementById('genre-select').value;
    let searchUrl = SEARCH_API_URL + `&query=${currentSearchQuery}`;

    if (genre && genre !== 'all') {
        searchUrl += `&with_genres=${genre}`;
    }

    getMovies(searchUrl, currentPage);
});

// FOR LOADING THE DATA
loadGenres();
getMovies(API_URL, currentPage);

document.getElementById('joinform').addEventListener('submit', function(event) {
    event.preventDefault(); 
    alert('Welcome to PanFlix !');
});