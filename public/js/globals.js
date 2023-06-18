// Variables used in various JS files

// Config
const apiConfig = { // eslint-disable-line
  promptForAuth: false,
  scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
  clientID: '946020065078-19cs4ipkortecvm02luc5tsb2cm6bc0t.apps.googleusercontent.com',
  apiKey: 'AIzaSyCpGRq8bY3cSaGINiboED3uVdeaLQk3hkg',
  spreadsheetID: '14Sqs0gzoIjFgllbPWvKbkizrImljMoL120uihYsI44A',
  range: 'Cards!A2:X'
}

// Initialise a variable to hold the card data.
// This variable is used in layout.js, so we tell
// the linter to ignore that is isn't used here.
let cardData // eslint-disable-line

// Get the buttons as global variables
const authorizeButton = document.getElementById('authorize-button')  // eslint-disable-line
const filterButton = document.getElementById('filter-controls-button')  // eslint-disable-line
const hideButton = document.getElementById('hide-cards-button')  // eslint-disable-line
const signoutButton = document.getElementById('signout-button')  // eslint-disable-line
const submitButton = document.getElementById('submit-button')  // eslint-disable-line
const cardSelect = document.getElementById('card-select')  // eslint-disable-line
const cardSelectRarity = document.getElementById('card-select-rarity')  // eslint-disable-line
const cardSelectColors = document.getElementById('card-select-colors')  // eslint-disable-line
const printControls = document.getElementById('print-controls')  // eslint-disable-line
const cutlinesSelect = document.getElementById('cutlines')  // eslint-disable-line
const manaSymbolsSelect = document.getElementById('mana-symbols')  // eslint-disable-line
