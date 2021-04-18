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
      ingredients[i] = `${i + 1}.) ${elem.children[0].data.trim()}`;
    }
  });

  // add all steps to steps arr
  $('.instructions-section-item .section-body .paragraph p').each((i, elem) => {
    if (elem && elem.children && elem.children[0].data) {
      steps[i] = `${i + 1}.) ${elem.children[0].data.trim()} \n`;
    }
  });

  const body = `
  ${title} \n
  ${description || ''} \n

  Total ingredients: ${ingredientsCount}
  Total steps: ${stepsCount}

  Ingredients:
  ${ingredients.join('\n')}

  Steps:
  ${steps.join('\n')}
  `;

  const fileName = `${basePath}/${title}.txt`;

  await writeFile(fileName, body);
  console.info(`Successfully created ${fileName}.`);
})();
