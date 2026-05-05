const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, '..', 'src', 'config', 'site-content.ts');
const destDir = path.join(__dirname, '..', 'src', 'constants');

const content = fs.readFileSync(srcFile, 'utf8');

// We'll split the content by 'export const '
const parts = content.split(/^export const /m);

const imports = parts[0]; // The import statements at the top

const blocks = {};
for (let i = 1; i < parts.length; i++) {
  const part = parts[i];
  const match = part.match(/^([a-zA-Z0-9_]+)[\s=:]/);
  if (match) {
    const name = match[1];
    blocks[name] = 'export const ' + part;
  }
}

const mappings = {
  home: ['companyHero', 'partnersHeading', 'partners', 'platformOptions', 'faqHeading', 'faqData', 'newsletterContent'],
  titles: ['featuredMoviesHeading', 'featuredMovies', 'featuredSeriesHeading', 'featuredSeries', 'trendingHeading', 'top10MoviesHeading', 'top10Movies', 'top10SeriesHeading', 'top10Series', 'newReleasesHeading', 'newReleasesThisWeek', 'newReleasesThisMonth', 'inCinemaHeading', 'asianSpotlightHeading', 'asianSpotlightCountries', 'asianSpotlightKorean', 'asianSpotlightJapanese', 'comingSoonHeading', 'comingSoonData'],
  news: ['featuredNewsHeading', 'featuredNewsData'],
  collections: ['collectionsHeading', 'collectionsData']
};

for (const [file, names] of Object.entries(mappings)) {
  let fileContent = imports + '\n';
  names.forEach(name => {
    if (blocks[name]) {
      fileContent += blocks[name] + '\n';
    } else {
      console.log('Missing block: ' + name);
    }
  });
  
  fs.writeFileSync(path.join(destDir, `${file}.ts`), fileContent, 'utf8');
  console.log(`Created ${file}.ts`);
}

console.log("Splitting complete.");
