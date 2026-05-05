const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

const mappings = {
  companyHero: 'home',
  partnersHeading: 'home',
  partners: 'home',
  faqHeading: 'home',
  faqData: 'home',
  newsletterContent: 'home',
  platformOptions: 'home',
  
  top10MoviesHeading: 'titles',
  top10Movies: 'titles',
  top10SeriesHeading: 'titles',
  top10Series: 'titles',
  newReleasesHeading: 'titles',
  newReleasesThisWeek: 'titles',
  newReleasesThisMonth: 'titles',
  inCinemaHeading: 'titles',
  asianSpotlightHeading: 'titles',
  asianSpotlightCountries: 'titles',
  asianSpotlightKorean: 'titles',
  asianSpotlightJapanese: 'titles',
  comingSoonHeading: 'titles',
  comingSoonData: 'titles',
  featuredMoviesHeading: 'titles',
  featuredMovies: 'titles',
  featuredSeriesHeading: 'titles',
  featuredSeries: 'titles',
  trendingHeading: 'titles',
  
  featuredNewsHeading: 'news',
  featuredNewsData: 'news',
  
  collectionsHeading: 'collections',
  collectionsData: 'collections',
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  const importRegex = /import\s+\{\s*([^}]+)\s*\}\s+from\s+["']@\/config\/site-content["'];?/g;
  let match;
  let modified = false;
  
  while ((match = importRegex.exec(content)) !== null) {
    const importStr = match[0];
    const variables = match[1].split(',').map(v => v.trim()).filter(Boolean);
    
    // Group variables by target file
    const newImports = {};
    variables.forEach(v => {
      // Handle aliased imports e.g., 'featuredNewsData as newsData'
      const baseVar = v.split(/\s+as\s+/)[0].trim();
      const target = mappings[baseVar];
      if (target) {
        if (!newImports[target]) newImports[target] = [];
        newImports[target].push(v);
      } else {
        console.warn(`WARNING: Mapping not found for ${baseVar} in ${filePath}`);
        // Default to home if not found
        if (!newImports['home']) newImports['home'] = [];
        newImports['home'].push(v);
      }
    });
    
    // Build new import statements
    const replacementLines = Object.entries(newImports).map(([target, vars]) => {
      return `import { ${vars.join(', ')} } from "@/constants/${target}";`;
    });
    
    content = content.replace(importStr, replacementLines.join('\n'));
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated imports in ${filePath.replace(srcDir, '')}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      processFile(fullPath);
    }
  });
}

walkDir(srcDir);
console.log('Import replacements complete.');
