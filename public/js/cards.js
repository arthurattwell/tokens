// Standard JS
/* global authorizeButton, cardData, cardSelect, fetchCardData,
  marked, showControls, showManaSymbols, templateDefault, templateSaga */

// Config.
// This script will use the localImages path
// when serving to a localhost URL.
const cardsConfig = {
  localImages: 'http://localhost:5050/',
  remoteImages: 'http://arthurattwell.github.io/token-images/images/',
  defaultFooter: ''
}

// Card count
function cardCount () {
  'use strict'

  const cardsContainer = document.querySelector('.cards')

  // Get or create the count display text
  let countDisplay = document.getElementById('count-display')
  if (!countDisplay) {
    countDisplay = document.createElement('div')
    countDisplay.id = 'count-display'
    cardSelect.insertAdjacentElement('beforebegin', countDisplay)
  }

  // Update the number of cards
  const cards = cardsContainer.querySelectorAll('.card')

  if (cards && cards.length) {
    if (cards.length === 1) {
      countDisplay.innerHTML = 'Showing ' + cards.length + ' card'
    } else {
      countDisplay.innerHTML = 'Showing ' + cards.length + ' cards'
    }
  } else {
    countDisplay.remove()
  }
}

// Functions for local development
function needsImage() { // eslint-disable-line
  const pics = document.querySelectorAll('.card-image img')

  pics.forEach(function (pic) {
    const cardWithPic = pic.closest('.card')
    cardWithPic.style.display = 'none'
  })
}

// Provide path to local images if developing locally
function imagePath () {
  if (window.location.href.includes('localhost') ||
    window.location.href.includes('127')) {
    return cardsConfig.localImages
  } else {
    return cardsConfig.remoteImages
  }
}

// Markdown options
// See https://marked.js.org/using_advanced#options
marked.setOptions({
  smartypants: true
})

// Add an HTML snippet to .cards
function cardAppendHTML (html) {
  'use strict'
  const cards = document.querySelector('.cards')
  cards.appendChild(html)
}

// Generate mana-cost elements
function cardManaCost (data) {
  'use strict'

  // We'll store our final HTML string here
  let manaCostHTML = ''

  // Create an object of all possible mana types
  const manaTypes = {
    generic: data.generic,
    white: data.white,
    blue: data.blue,
    black: data.black,
    red: data.red,
    green: data.green,
    snow: data.snow,
    colorless: data.colorless
  }

  // Create a property for whether card has a casting cost
  data.cost = true

  // Generate a span for each mana type.
  // If it's a number, display mana symbols.
  // If it's not, add spans to indicate
  // the card's colour identity.
  let manaString = ''
  Object.entries(manaTypes).forEach(function (type) {
    if (type[0] === 'generic' && typeof type[1] === 'number') {
      // If generic mana, create a single number
      manaCostHTML += '<span class="card-mana-generic">' + type[1] + '</span>'
    } else if (typeof type[1] === 'number') {
      manaString = '<span class="card-mana-' + type[0] +
        ' card-mana-symbol-background-' + type[0] +
        '"><img src="images/mana/' +
        type[0] +
        '.png"></span>'
      manaCostHTML += manaString.repeat(type[1])
    } else if (typeof type[1] === 'string' && type[1] !== '') {
      data.cost = false
      manaString = '<span class="card-color-' + type[0] +
        '"></span>'
      manaCostHTML += manaString
    }
  })

  return manaCostHTML
}

// Generate card HTML
function cardGenerateHTML (data) {
  'use strict'

  // Add the mana cost to the card data
  data.manaCostHTML = cardManaCost(data)

  // Create a card div
  const cardHTML = document.createElement('div')
  cardHTML.classList.add('card')
  cardHTML.setAttribute('data-type', data.type)
  cardHTML.setAttribute('data-subtype', data.subtype)

  if (data.power) {
    cardHTML.setAttribute('data-power', data.power)
  }
  if (data.toughness) {
    cardHTML.setAttribute('data-toughness', data.toughness)
  }
  if (data.loyalty) {
    cardHTML.setAttribute('data-loyalty', data.loyalty)
  }

  if (data.type.includes('Saga')) {
    cardHTML.classList.add('card-saga')
    cardHTML.innerHTML = templateSaga(data)
  } else {
    cardHTML.classList.add('card-default')
    cardHTML.innerHTML = templateDefault(data)
  }

  // Add the card to the page
  cardAppendHTML(cardHTML)
}

// Convert mana-cost notation into HTML
function cardManaCostConverter (match, group) {
  // We do not need `match` here, but must include it
  // because replace() passes it first, before the
  // capturing `group`, which we do need.

  const colors = {
    white: 'W',
    blue: 'U',
    black: 'B',
    red: 'R',
    green: 'G',
    snow: 'S',
    colorless: 'C'
  }

  let manaCostHTML = ''
  Object.entries(colors).forEach(function (entry) {
    if (group === entry[1]) {
      manaCostHTML = '<span class="card-rules-mana-' + entry[0] +
        ' card-mana-symbol-background-' + entry[0] +
        '"><img src="images/mana/' +
        entry[0] +
        '.png"></span>'
    }
  })

  return manaCostHTML
}

// Process rules text for special syntax
function cardRulesText (data) {
  'use strict'

  let rulesText = data.rulesText

  // Replace generic mana costs
  if (rulesText.match(/\{\d+\}/g)) {
    rulesText = rulesText.replace(/\{(\d+)\}/g,
      '<span class="card-rules-mana-generic">$1</span>')
  }

  // Replace coloured costs
  // TODO: Support all color symbols in the
  // official Magic rules, clause 107.4
  if (rulesText.match(/\{[WUBRGSC]}/g)) {
    rulesText = rulesText.replace(/\{([WUBRGSC])}/g, cardManaCostConverter)
  }

  // Replace loyalty abilities,
  // allowing for hyphen or minus characters
  if (rulesText.match(/\[[+-−]\d+\]/g)) {
    rulesText = rulesText.replace(/\[([+-−])(\d+)\]/g,
      '<span class="card-rules-loyalty-ability-cost">$1$2</span>')

    // Replace that hyphen with a minus sign
    rulesText = rulesText.replace(/cost">-/g, 'cost">−')
  }

  // Replace {T} (tap) with ↷
  if (rulesText.match(/\{T}/g)) {
    rulesText = rulesText.replace(/\{T}/g, '<span class="card-rules-tap">↷</span>')
  }

  // Replace {X} mana costs
  if (rulesText.match(/\{X}/g)) {
    rulesText = rulesText.replace(/\{X}/g, '<span class="card-rules-mana-generic card-rules-x-cost">X</span>')
  }

  // Process markdown
  rulesText = marked.parse(rulesText)

  // Prevent line breaks after opening quotation
  // marks before spans
  if (rulesText.includes('<span')) {
    const regexForTheSpan = /(‘<span\s.+?<\/span>:*)/g
    rulesText = rulesText.replace(regexForTheSpan,
      '<span class="no-break">$1</span>')
  }

  return rulesText
}

// Ouput one card's HTML
function cardCollateData (row, colors) {
  'use strict'

  // Get the card data
  const data = {
    name: row[0],
    generic: row[1],
    white: row[2],
    blue: row[3],
    black: row[4],
    red: row[5],
    green: row[6],
    snow: row[7],
    colorless: row[8],
    colors: row[9],
    manaValue: row[10],
    type: row[11],
    subtype: row[12],
    rulesText: row[13],
    power: row[14],
    toughness: row[15],
    loyalty: row[16],
    image: row[17],
    imageAlign: row[18],
    imageCredit: row[19],
    imageCreditNoBreaks: row[20],
    hide: row[21]
  }

  // Augment data: add fallbacks, appendices,
  // process markdown, etc.
  if (typeof data.footerText === 'undefined' ||
      data.footerText === '') {
    // If no custom footer, use the default
    data.footerText = marked.parse(cardsConfig.defaultFooter)
  }
  if (data.image) {
    // Add URL path to image
    data.image = imagePath() + data.image
  }
  if (data.rulesText) {
    data.rulesText = cardRulesText(data)
  }
  if (data.footerText) {
    data.footerText = marked.parse(data.footerText)
  }
  if (data.imageCredit) {
    // Wrap no-break strings in spans
    if (data.imageCreditNoBreaks) {
      const noBreakStrings = data.imageCreditNoBreaks.split('|')
      if (noBreakStrings && noBreakStrings.length > 0) {
        noBreakStrings.forEach(function (string) {
          // Remove errant leading or trailing spaces
          string = string.trim()

          // Wrap the string in a no-break span
          data.imageCredit = data.imageCredit.replace(string,
            '<span class="no-break">' + string + '</span>')
        })
      }
    }

    // Process as markdown
    data.imageCredit = marked.parse(data.imageCredit)
  }

  // Build the card HTML,
  // if it's not a hidden card
  if (data.hide === 'Y') {
    console.log('Card ' + data.number + ' marked as hidden, not created.')
  } else {
    // Check that we want to show this color
    let cardColorIsSelected = false
    colors.forEach(function (color) {
      if (data[color]) {
        cardColorIsSelected = true
      }
    })

    if (data.colors === 0 && colors.includes('colorless')) {
      cardColorIsSelected = true
    }

    if (cardColorIsSelected) {
      cardGenerateHTML(data)
    }
  }
}

// Load cards
function cardsLoad (cardName, colors) {
  'use strict'
  // If there are cards in the sheet ...
  if (cardData.values.length > 0) {
    let i

    if (cardName) {
      for (i = 0; i < cardData.values.length; i += 1) {
        // Do a regex search using the cardName
        const searchRegex = new RegExp(cardName, 'i')
        if (cardData.values[i][0].match(searchRegex)) {
          cardCollateData(cardData.values[i], colors)
        }
      }
    } else {
      for (i = 0; i < cardData.values.length; i += 1) {
        cardCollateData(cardData.values[i], colors)
      }
    }
  } else {
    cardAppendHTML('No data found.')
  }

  // Show how many cards that is.
  cardCount()

  // Update the heading of the cards section
  const cardsHeading = document.querySelector('#cards-section h2')
  cardsHeading.innerHTML = 'The cards'
}

// Check for card selection
function cardCheckInput () {
  'use strict'

  // Get the card to output
  const cardName = document.getElementById('card-select').value

  // Get an array of the colors requested
  const colors = []
  if (document.querySelector('.card-select-colors #white').checked) {
    colors.push('white')
  }
  if (document.querySelector('.card-select-colors #blue').checked) {
    colors.push('blue')
  }
  if (document.querySelector('.card-select-colors #black').checked) {
    colors.push('black')
  }
  if (document.querySelector('.card-select-colors #red').checked) {
    colors.push('red')
  }
  if (document.querySelector('.card-select-colors #green').checked) {
    colors.push('green')
  }
  if (document.querySelector('.card-select-colors #colorless').checked) {
    colors.push('colorless')
  }

  // If it's filled in ...
  if (cardName) {
    // ... clear any current cards
    document.querySelector('.cards').innerHTML = ''

    // ... and load the new ones
    cardsLoad(cardName, colors)
  } else {
    console.log('Displaying selected cards')

    // ... clear any current cards
    document.querySelector('.cards').innerHTML = ''

    // ... and load them all
    cardsLoad(false, colors)
  }
}

// Start the process
// (called from authorize.js when user is signed in)
function cardsStart () { // eslint-disable-line
  'use strict'

  // Alert if there's no data
  if (!cardData) {
    window.alert('Sorry, we couldn\'t fetch any card data.')
    showControls(false)
    authorizeButton.innerHTML = 'Try again'
    return
  } else {
    showControls(true)
    showManaSymbols()
    cardCheckInput()
  }

  // Get the buttons on the page
  // const signoutButton = document.getElementById('signout-button')
  const submitButton = document.getElementById('submit-button')
  const cardSelect = document.getElementById('card-select')

  // Listen for submit button click...
  submitButton.addEventListener('click', function () {
    fetchCardData()
  })

  // ... and for hitting enter
  cardSelect.addEventListener('keydown', function onEvent (event) {
    if (event.key === 'Enter') {
      fetchCardData()
    }
  })
}
