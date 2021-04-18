const cheerio = require('cheerio');
const fetch = require('node-fetch');

(async () => {
  const res = await fetch('https://www.allrecipes.com/recipe/272858/air-fryer-chicken-thighs/');
  const html = await res.text()
  console.log('html:', html);
})()
