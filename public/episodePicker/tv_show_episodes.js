const apiKey = 'd3047d03e4482f136c84120d99bbafa3'
const baseUrl = 'https://api.themoviedb.org/3/'
const baseImageUrl = 'https://image.tmdb.org/t/p/original/'
let showId = null;
let input;

const suggestion = /* html */`
  <div onclick="clickedSuggestion(this)" id="$show_id" style="display: flex; outline: 3px solid aquamarine; margin: 7px; padding: 10px; border-radius: 20px;">
  <img src="$show_poster" style="max-height: 100px; border-radius:10px">
  <div>$show_title $show_year </div>
  </div>
  `
  //<img src="$show_image" style="max-height: 100px">
  
window.addEventListener('load', () => {
  // Get the input field
  input = document.getElementById("searchInput");
  input.value = ''

  input.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("searchButton").click();
    }
  });
})

function debounce(callback, delay = 500) {
  var time;
  return (...args) => {
    clearTimeout(time);
    time = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

function setSearchResults(matches) {
  const suggestions = matches
    .map(match => suggestion
      .replace('$show_title', match.name)
      .replace('$show_year', match.first_air_date ? `(${match.first_air_date.split('-')[0]})` : '')
      .replace('$show_id', match.id)
      .replace('$show_image', baseImageUrl + match.backdrop_path)
      .replace('$show_poster', baseImageUrl + match.poster_path))
  document.getElementById('searchSuggestions').innerHTML = suggestions.join('\n')
}

// eslint-disable-next-line no-unused-vars
function clickedSuggestion(param) {
  showId = param.id;
  pickAnEpisode();
}

const showSuggestions = debounce(async (searchTerm) => {
  const matches = await searchForTvShow(searchTerm);
  setSearchResults(matches);
})

// eslint-disable-next-line no-unused-vars
const processChange = () => {
  const searchQuery = document.getElementById("searchInput").value;
  showSuggestions(searchQuery)
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function httpsGet(url) {
  const response = await fetch(`${baseUrl}${url}`);
  return await response.json();
}

async function searchForTvShow(query) {
  const searchResults = await httpsGet(
    `search/tv?api_key=${apiKey}&language=en-US&page=1&query=${query}&include_adult=false`
  )
  return await searchResults.results;
}

async function getTvShowDetails(id) {
  const showDetails = await httpsGet(
    `tv/${id}?api_key=${apiKey}&language=en-US`
  )

  return showDetails
}

async function getEpisode(showId, season, episode) {
  return httpsGet(
    `tv/${showId}/season/${season}/episode/${episode}?api_key=${apiKey}&language=en-US`
  )
}

// eslint-disable-next-line no-unused-vars
async function pickAnEpisode() {
  const tvShowDetails = await getTvShowDetails(showId);

  const numSeasons = tvShowDetails.seasons.length

  let season;
  do {
    season = tvShowDetails.seasons[getRandomInt(0, numSeasons-1)]
  } while (season.name === 'Specials')


  const episodeNumber = getRandomInt(1, season.episode_count)

  const episode = await getEpisode(showId, season.season_number, episodeNumber)

  document.getElementById('poster').src = baseImageUrl + season.poster_path
  document.getElementById('still').src = baseImageUrl + episode.still_path
  document.getElementById('title').innerHTML = 'Why not try...'
  document.getElementById("episodeTitle").innerHTML = episode.name
  document.getElementById("episodeNumber").innerHTML = `Season ${season.season_number} Episode ${episodeNumber}`
  document.getElementById("releaseDate").innerHTML = `First aired: ${new Date(episode.air_date).toLocaleString().split(',')[0]}`
  document.getElementById("rating").innerHTML = `Average rating: ${episode.vote_average} from ${episode.vote_count} user(s)`

  document.getElementById("description").innerHTML = episode.overview
  document.getElementById("resultsBox").style.display = 'block'
  document.getElementById("searchAgain").style.display = 'block'
  document.getElementById('searchSuggestions').innerHTML = ''
  document.getElementById('searchInput').value=''

}
