# Art Tokens

A personal project for creating MTG tokens.

## Development

### Setup

1. Get the ID of [the spreadsheet containing card data](https://docs.google.com/spreadsheets/d/14Sqs0gzoIjFgllbPWvKbkizrImljMoL120uihYsI44A/edit?usp=sharing).
1. Go to the Google API Console. Click Create project, enter a name, and click Create.
1. Enable the Google Sheets API for your project by finding it in the library: https://console.developers.google.com/apis/library
1. Open the Credentials page in the API Console. https://console.developers.google.com/apis/credentials
   - You may be prompted to set up an OAuth consent screen. Enter the minimum amount of info for an external site.
   - Click Create credentials > API key and follow the prompts.
   - Click Create credentials > OAuth client ID and select 'the appropriate Web application' as the application type. For JS origins, add at least `http://localhost:8000`.
1. Then replace the keys in `public/js/globals.js` with your own new equivalents.

### Ongoing

1. Ensure you have Node installed and up-to-date.
2. Open a command prompt in this file's directory.
3. Once-off initially, enter `npm install`. Wait for the Node modules to finish installing.
4. Enter `npm start`.
5. In your web browser, go to [localhost:8000](http://localhost:8000).

### Card images

To keep this repo small and lean, images for cards are not included here. Instead, they are served at a different URL. For local development at `http://localhost`, serve them locally. When the site is running on the open web, the JS will fetch images from a remote website.

The URLs for local and remote images are defined in `public/js/layout.js`.

I use a separate repo called [`token-images`](https://github.com/arthurattwell/token-images/). That repo lets me serve images locally, and is also deployed by GitHub Pages, from where the live site fetches remote images.

To serve the images locally while developing, I run `npm start` in that images repo.

### Private spreadsheets

If the source spreadsheet is not public, the JS will prompt the user to authorize access to their sheets. You need to define `promptForAuth` as true for this, in `public/js/globals.js`.
