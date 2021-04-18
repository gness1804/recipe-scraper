const cheerio = require('cheerio');
const fetch = require('node-fetch');

(async () => {
  let html;
  try {
    const res = await fetch('https://www.allrecipes.com/recipe/272858/air-fryer-chicken-thighs/');
    html = await res.text()
  } catch (error) {
    console.error(`Failed to retrieve recipe: ${error}.`);
    process.exit(1);
  }

  const $ = cheerio.load(html);
  const title = $('h1.heading-content').text();
  const description = $('.recipe-summary p').text();
})()
