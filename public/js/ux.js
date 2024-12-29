/* globals apiConfig, authorizeButton, hideButton, signoutButton,
   submitButton, cardSelect, cardSelectColors, filterButton,
   printControls, cutlinesSelect, manaSymbolsSelect */

// Show/hide card controls
let hideableControls = false
function showHideControls () {
  'use strict'

  if (hideableControls === false) {
    filterButton.addEventListener('click', function () {
      const controls = filterButton.closest('.controls')

      if (controls.getAttribute('data-controls') === 'closed') {
        filterButton.innerHTML = 'Hide filter'
        controls.setAttribute('data-controls', 'open')
      } else {
        filterButton.innerHTML = 'Filter cards'
        controls.setAttribute('data-controls', 'closed')
      }
    })

    // Flag that we've added the listener
    hideableControls = true
  }
}

// Make cards hideable
let hideableCards = false
function showhideCards () {
  'use strict'

  if (hideableCards === false) {
    hideButton.addEventListener('click', function () {
      const controls = filterButton.closest('.controls')
      if (controls.getAttribute('data-cards') === 'visible') {
        controls.setAttribute('data-cards', 'hidden')
        hideButton.innerHTML = 'Show the cards'
      } else {
        controls.setAttribute('data-cards', 'visible')
        hideButton.innerHTML = 'Hide the cards'
      }
    })

    // Flag that we've added the listener
    hideableCards = true
  }
}

function showManaSymbols() {
  'use strict'

  if (manaSymbolsSelect.checked) {
    const cards = document.querySelector('.cards')
    cards.setAttribute('data-mana-symbol-visibility', 'visible')
  } else {
    const cards = document.querySelector('.cards')
    cards.setAttribute('data-mana-symbol-visibility', 'hidden')
  }
}

function printControl () {
  'use strict'

  // Print mode
  const printModeSelect = document.getElementById('hires-mode')

  if (printModeSelect) {
    printModeSelect.addEventListener('change', function () {
      if (printModeSelect.checked) {
        document.body.classList.add('hires-mode')
      } else {
        document.body.classList.remove('hires-mode')
      }
    })
  }

  if (cutlinesSelect) {
    cutlinesSelect.addEventListener('change', function () {
      if (cutlinesSelect.checked) {
        document.body.classList.add('cutlines')
      } else {
        document.body.classList.remove('cutlines')
      }
    })
  }
}

function showControls (show) { // eslint-disable-line
  'use strict'
  if (show) {
    authorizeButton.closest('.controls').setAttribute('data-authorizing', 'false')
    authorizeButton.style.display = 'none'
    filterButton.style.display = 'inline-flex'
    hideButton.style.display = 'inline-flex'

    if (apiConfig.promptForAuth) {
      signoutButton.style.display = 'block'
    }

    submitButton.style.display = 'block'
    cardSelect.style.display = 'block'
    cardSelectColors.style.display = 'inline-block'
    printControls.style.display = 'inline-block'
    cardSelect.focus() // necessary because of `display: none` on page load
    printControl()
    showHideControls()
    showhideCards()
  } else {
    authorizeButton.closest('.controls').setAttribute('data-authorizing', 'true')

    if (apiConfig.promptForAuth) {
      authorizeButton.style.display = 'inline-block'
    }
    filterButton.style.display = 'none'
    hideButton.style.display = 'none'
    signoutButton.style.display = 'none'
    submitButton.style.display = 'none'
    cardSelect.style.display = 'none'
    cardSelectColors.style.display = 'none'
    printControls.style.display = 'none'
  }
}

function showTopButton () {
  'use strict'

  const topButtonLink = document.getElementById('go-to-top')

  window.addEventListener('scroll', function () {
    if (window.pageYOffset > 100) {
      topButtonLink.style.visibility = 'visible'
    } else {
      topButtonLink.style.visibility = 'hidden'
    }
  })
}

// Go
showTopButton()
