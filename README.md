# Simple Recipe Scraper

This is a scraper to easily pull a recipe from an external site, process the data, and send desired output to a destination directory (which I set as my personal Google Drive). Right now, it only works with allrecipes.com, but I might expand it to include other popular recipe sites in the future.

From the JSDOC:

```
/**
* Scrapes recipe info from allrecipes.com and sends parsed text output to a file.
*
* @param string basePath - the base path where to save the file. Example: '~/Cooking/Recipes'.
  @param string url - the url. Example: 'https://www.allrecipes.com/recipe/217333/chicken-vindaloo/'
*/
```


