// Load Node modules

const sass = require('sass')
const fs = require('fs')

// Compile Sass source to public CSS

const sassResult = sass.compile('main.scss',  { style: "compressed" });
fs.writeFile('public/css/main.css', sassResult.css, function (error) {
    if (error) {
        throw error
    } else {
        console.log('Public CSS updated from Sass.');
    }
})
