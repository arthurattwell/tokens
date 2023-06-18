/* globals marked */

// Process markdown

function processMarkdownContent () {
  'use strict'

  const contentSections = document.querySelectorAll('.markdown')
  contentSections.forEach(function (section) {
    const sectionHTML = marked.parse(section.innerHTML)
    section.innerHTML = sectionHTML
  })
}

// Go
processMarkdownContent()
