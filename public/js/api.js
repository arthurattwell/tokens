// Standard JS
/* global apiConfig, authorizeButton, signoutButton,
   showControls, cardsStart, gapi, google */

// If the target spreadsheet is publicy viewable,
// this script will not prompt the user for access.
// If that's the case, set promptForAuth to false.

// Adapted from
// https://developers.google.com/identity/oauth2/web/guides/migration-to-gis#gapi-asyncawait

// Initialize a variable for the tokenClient
let tokenClient
let storedAccessToken

async function getToken (err) {
  console.log(err);
  // If access denied...
  if ((err.result.error.code === 401 || err.result.error.code === 403) &&
      (err.result.error.status === 'PERMISSION_DENIED')) {
    // ... the access token is missing, invalid, or expired.
    // Prompt for user consent to obtain one.
    console.log('Access token missing. Getting a new one...')
    await new Promise((resolve, reject) => {
      try {
        // Settle this promise in the response
        // callback for requestAccessToken()
        tokenClient.callback = (resp) => {
          // If the tokenClient comes back with an error,
          // reject this Promise.
          if (resp.error !== undefined) {
            reject(resp)
          }

          // Otherwise, GIS has automatically updated gapi.client
          // with the newly issued access token.
          storedAccessToken = JSON.stringify(gapi.client.getToken().access_token)
          console.log('gapi.client access token: ' + storedAccessToken)
          window.sessionStorage.setItem('storedAccessToken', storedAccessToken)

          // When user clicks 'Sign out', revoke the token
          signoutButton.addEventListener('click', function () {
            revokeToken()
          })

          resolve(resp)
        }
        tokenClient.requestAccessToken()
      } catch (err) {
        console.log(err)
      }
    })
  } else {
    // Errors unrelated to authorization: server errors,
    // exceeding quota, bad requests, and so on.
    throw new Error(err)
  }
}

function revokeToken () {
  const cred = gapi.client.getToken()
  if (cred !== null) {
    google.accounts.oauth2.revoke(cred.access_token, () => { console.log('Revoked: ' + cred.access_token) })
    gapi.client.setToken('')

    // Hide the controls
    showControls(false)
  }
}

function storeData (response, status) {
  if (status) {
    console.log(status)
  }

  if (response) {
    cardData = response.result // eslint-disable-line
    showControls(true)
    cardsStart()
  } else {
    window.alert('No data received.')
  }
}

function fetchCardData () {
  console.log('Fetching card data...')

  // Try to fetch spreadsheet data.
  // If a valid access token is needed,
  // prompt to obtain one and then retry.
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: apiConfig.spreadsheetID,
    range: apiConfig.range,
    valueRenderOption: 'UNFORMATTED_VALUE'
  })
    .then(response => storeData(response, 'Already authorized. Storing data.'))

    // If there were authorization errors, get a token
    .catch(async function (err) {
      await getToken(err)
      gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: apiConfig.spreadsheetID,
        range: apiConfig.range,
        valueRenderOption: 'UNFORMATTED_VALUE'
      })
        .then(response => storeData(response, 'Had to authorize first. Storing data now.'))

        // Return error if this really isn't working
        // (cancelled by user, timeout, etc.)
        .catch(err => console.log(err))
    })
}

// Run the authorization process
async function connectToAPI () {
  // User feedback
  authorizeButton.innerHTML = 'Connecting …'

  // First, load the Google API client
  await new Promise((resolve, reject) => {
    gapi.load('client', { callback: resolve, onerror: reject })
  })

  // Then initialise the API client
  await gapi.client.init({
    apiKey: apiConfig.apiKey,
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
    // Note: In API v4 Google moved OAuth2 'scope'
    // and 'client_id' parameters to initTokenClient().
  })

  // Now load the GIS client
  await new Promise((resolve, reject) => {
    try {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: apiConfig.clientID,
        scope: apiConfig.scope,
        prompt: '',
        callback: '', // defined at request time in await/promise scope
        select_account: false
      })
      resolve()
    } catch (err) {
      reject(err)
    }
  })
    .then(function () {
      fetchCardData()
    })
}

// Connect to the Google Sheets API
if (apiConfig.promptForAuth === true) {
  // Go when user clicks, or if there is
  // an access token in sessionStorage.
  authorizeButton.addEventListener('click', function () {
    connectToAPI()
  })

  if (window.sessionStorage.getItem('storedAccessToken')) {
    connectToAPI()
  }
} else {
  connectToAPI()
}
