/**
* Scrapes recipe info from allrecipes.com and sends parsed text output to a file.
*
* @param string basePath - the base path where to save the file. Example: '~/Cooking/Recipes'.
  @param string url - the url. Example: 'https://www.allrecipes.com/recipe/217333/chicken-vindaloo/'
*/

require('dotenv').config();
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { writeFile } = require('fs').promises;

const [, , basePath, url] = process.argv;

if (!url) throw new Error('Error: url argument required.');

(async () => {
  let html;
  try {
    const res = await fetch(url);
    html = await res.text();
  } catch (error) {
    console.error(`Failed to retrieve recipe: ${error}.`);
    process.exit(1);
  }

  const ingredients = [];
  const steps = [];

  const $ = cheerio.load(html);
  const title = $('h1.heading-content').text();
  const description = $('.recipe-summary p').text();

  const ingredientsCount = $('.ingredients-item-name').length;
  const stepsCount = $('.instructions-section-item .section-body .paragraph p')
    .length;

  // add all ingredients to ingredients arr
  $('.ingredients-item-name').each((i, elem) => {
    if (elem && elem.children && elem.children[0].data) {
      ingredients[i] = `${elem.children[0].data.trim()}`;
    }
  });

  // add all steps to steps arr
  $('.instructions-section-item .section-body .paragraph p').each((i, elem) => {
    if (elem && elem.children && elem.children[0].data) {
      steps[i] = `${elem.children[0].data.trim()} \n`;
    }
  });

  const body = /*html*/ `
  <head>
    <meta charset="UTF-8">
  </head>
  <h1>${title}</h1> \n
  <h2 style="font-style: italic;">${description || ''}</h2> \n

  <a href="${url}" target="_blank">Original Page</a>

  <h3>Total ingredients: <span>${ingredientsCount}</span></h3>
  <h3 style="margin-bottom: 3rem;">Total steps: <span>${stepsCount}</span></h3>

  <h3>Ingredients:</h3>
  <ol>
    ${ingredients.map((ing) => `<li>${ing}</li>`).join('\n')}
  </ol>

  <h3>Steps:</h3>
  <ol>
    ${steps.map((step) => `<li>${step}</li>`).join('\n')}
  </ol>
`;

  const fileName = `${basePath}/${title}.html`;

  await writeFile(fileName, body);
  console.info(`Successfully created ${fileName}.`);
})();
