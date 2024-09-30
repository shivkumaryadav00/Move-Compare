let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
  // imdbID;
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'APIKEY',
      i: movie.imdbID,
    },
  });
  summaryElement.innerHTML = movieTemplate(response.data);

  if (side === 'left') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftSideState = document.querySelectorAll(
    '#left-summary .notification'
  );

  const rightSideState = document.querySelectorAll(
    '#right-summary .notification'
  );

  leftSideState.forEach((leftStat, index) => {
    const rightStat = rightSideState[index];

    const leftSideValue = leftStat.dataset.value;
    const rightSideValue = rightStat.dataset.value;

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    } else {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
    }
  });
};

const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
      <img src="${imgSrc}" alt="" />
      ${movie.Title} (${movie.Year})
    `;
  },

  inputValue(movie) {
    return movie.Title;
  },

  async fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: '88df9fa2',
        s: searchTerm,
        //   i: 'tt5580390',
      },
    });

    if (response.data.Error) {
      return [];
    }

    return response.data.Search;
  },
};
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),

  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  },
});

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),

  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  },
});

const movieTemplate = (movieDetail) => {
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
  );

  const metaScore = parseInt(movieDetail.Metascore);
  const imdbRating = parseInt(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace('/,/g', ''));

  // awards
  let count = 0;
  movieDetail.Awards.split(' ').forEach((word) => {
    const value = parseInt(word);

    if (isNaN(value)) {
      return;
    } else {
      count = count + value;
    }
  });
  const awards = count;

  return `
  <article  class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${movieDetail.Poster}" />
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <h1>${movieDetail.Title}</h1>
        <h4>${movieDetail.Genre}</h4>
        <p>${movieDetail.Plot}</p>
      </div>
    </div>
  </article>

  <article data-value=${awards} class="notification is-primary">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Award</p>
  </article>

  <article data-value=${dollars} class="notification is-primary">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">BoxOffice</p>
  </article>

  <article data-value=${metaScore} class="notification is-primary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
  </article>

  <article data-value=${imdbRating} class="notification is-primary">
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle">imdbRating</p>
  </article>

  <article data-value=${imdbVotes} class="notification is-primary">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">imdVotes</p>
  </article>
  `;
};
