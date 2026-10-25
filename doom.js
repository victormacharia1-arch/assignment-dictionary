
const form = document.getElementById('Search-Form');
const searchInput = document.getElementById('searchInput');
const errorMessage = document.getElementById('Error');
const resultsContainer = document.getElementById('results-container');
const FavList = document.getElementById('fav-list')
const themeToggle = document.getElementById('Theme-button');
const themeLink = document.getElementById('theme');
const audio = document.getElementById('audio');
const clear = document.getElementById('clear')
let favourites = [];
errorMessage.style.color ='#ff0000'



const API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en/hello';


form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearResults();
  const query = searchInput.value.trim().toLowerCase();
  if (query === '') {
    errorMessage.style.setProperty('color', '#ff0000', 'important');
    errorMessage.style.setProperty('opacity', '1', 'important');
    errorMessage.textContent = 'Enter a word u goober.';
    resultsContainer.innerHTML = '';
    return;
  }


  try {
    const response = await fetch(`${API_BASE.replace('hello', query)}`);
    if (!response.ok) {
      errorMessage.style.setProperty('color', '#ff0000', 'important');
      errorMessage.style.setProperty('opacity', '1', 'important');
      errorMessage.textContent = 'Word not found.';
      resultsContainer.innerHTML = '';
      return;
    }
    const data = await response.json();
    displayResults(data);
  } catch (error) {
    errorMessage.style.setProperty('color', '#ff0000', 'important');
    errorMessage.style.setProperty('opacity', '1', 'important');
    errorMessage.textContent = 'An error occurred while fetching the word definition.';
    resultsContainer.innerHTML = '';
  }
});


function clearResults() {
  resultsContainer.innerHTML = '';
  errorMessage.textContent = '';
}
function toggleFavourite(word) {
  if (favourites.includes(word)) {
    favourites = favourites.filter(fav => fav !== word);
  } else {
    favourites.push(word);
  }
  updateFavListUI();
}
function updateFavListUI() {
  const favListContainer = document.getElementById('fav-list');
  if (!favListContainer) return;

  
  favListContainer.innerHTML = '';

  if (favourites.length === 0) {
    const fallbackLi = document.createElement('li');
    fallbackLi.textContent = 'No Favourites Yet';
    favListContainer.appendChild(fallbackLi);
    return;
  }
  favourites.forEach(word => {
    const li = document.createElement('li');
    li.textContent = word;
    favListContainer.appendChild(li);
  });
}


function displayResults(data) {
  clearResults();
  const wordData = data[0];
  const word = wordData.word || '';
  const phonetic = wordData.phonetic || '';
  const meanings = wordData.meanings || [];
  const synonyms = wordData.synonyms || [];

  const wordElement = document.createElement('h2');
  wordElement.textContent = `${word} ${phonetic}`.trim();
  resultsContainer.appendChild(wordElement);

  
  
  const FavBtn = document.createElement('button');
  FavBtn.className = 'favbtn'
  const NormWord = word.toLowerCase();
  FavBtn.textContent = favourites.includes(NormWord) ? '★ Unfavorite' : '☆ Favorite';
  
  FavBtn.addEventListener('click', () => {
    toggleFavourite(NormWord);
    FavBtn.textContent = favourites.includes(NormWord) ? '★ Unfavorite' : '☆ Favorite';
  });
  resultsContainer.appendChild(FavBtn);

  if (Array.isArray(wordData.phonetics)) {
    const phonetics = wordData.phonetics.find(p => p && p.audio);
    if (phonetics && phonetics.audio) {
      const audioEl = document.createElement('audio');
      audioEl.controls = true;
      audioEl.src = phonetics.audio;
      resultsContainer.appendChild(audioEl);
    }
  }

  meanings.forEach((meaning) => {
    const partOfSpeech = meaning.partOfSpeech || '';
    const definitions = meaning.definitions || [];
    const synonymsList = meaning.synonyms || [];

    const partOfSpeechElement = document.createElement('h3');
    partOfSpeechElement.textContent = partOfSpeech;
    resultsContainer.appendChild(partOfSpeechElement);

    const defsList = document.createElement('ul');
    definitions.forEach(defObj => {
      const li = document.createElement('li');
      li.textContent = defObj.definition || '';
      defsList.appendChild(li);
    });
    const synonymsElement = document.createElement('p');
    if (synonymsList.length > 0) {
      synonymsElement.textContent = `Synonyms: ${synonymsList.join(', ')}`;
      resultsContainer.appendChild(synonymsElement);
    }
    resultsContainer.appendChild(defsList);
  });
}



themeToggle.addEventListener('click', () => {
  if (themeLink.getAttribute('href') === 'css/darkstyle.css') {
    themeLink.setAttribute('href', 'css/lightstyle.css');
  } else {
    themeLink.setAttribute('href', 'css/darkstyle.css');
  }
});


clear.addEventListener('click', () => {
  clearResults()
  resultsContainer.textContent = '🔍Results🔍'
  searchInput.value = ""

}
)