// const https = require('https');
const apiKey = 'd3047d03e4482f136c84120d99bbafa3'
const baseUrl = 'https://api.themoviedb.org/3/'

let input;

window.addEventListener('load', () => {
  // Get the input field
  input = document.getElementById("searchInput");
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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function httpsGet(url) {
  const response = await fetch(`${baseUrl}${url}`);
  return await response.json();
}

async function getTvShow(query) {
  const searchResults = await httpsGet(
    `search/tv?api_key=${apiKey}&language=en-US&page=1&query=${query}&include_adult=false`
  )
  return await searchResults.results[0];
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

async function pickAnEpisode() {
  const searchQuery = document.getElementById("searchInput").value;
  const tvShow = await getTvShow(searchQuery);
  const tvShowDetails = await getTvShowDetails(tvShow.id);

  const numSeasons = tvShowDetails.seasons.length

  let season;
  do {
    season = tvShowDetails.seasons[getRandomInt(0, numSeasons-1)]
  } while (season.name === 'Specials')


  const episodeNumber = getRandomInt(1, season.episode_count)

  const episode = await getEpisode(tvShow.id, season.season_number, episodeNumber)


  document.getElementById('poster').src = `https://image.tmdb.org/t/p/original/${season.poster_path}`
  document.getElementById('still').src = `https://image.tmdb.org/t/p/original/${episode.still_path}`

  const choice = 
  `You should watch ${tvShow.name} Season ${season.season_number} Episode ${episodeNumber} ${episode.name ? `- "${episode.name}" ` : ''}
  <br>
  It has a rating of ${episode.vote_average}, not sure where from
  <br>
  Original air date: ${new Date(episode.air_date).toLocaleString().split(',')[0]}
  <br>
  <br>
  "${episode.overview}"
  `;
  document.getElementById("episode").innerHTML = choice
}
