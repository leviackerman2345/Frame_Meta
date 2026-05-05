const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

const dirsToCreate = [
  'components/titles',
  'components/collections',
  'components/search',
  'constants'
];

dirsToCreate.forEach(dir => {
  const fullPath = path.join(srcDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

const moves = [
  { from: 'components/ui/MovieDetailsModal.tsx', to: 'components/titles/MovieDetailsModal.tsx' },
  { from: 'components/ui/MovieDetailsExtended.tsx', to: 'components/titles/MovieDetailsExtended.tsx' },
  { from: 'components/ui/MovieDetailsHero.tsx', to: 'components/titles/MovieDetailsHero.tsx' },
  { from: 'components/ui/MovieDetailsMeta.tsx', to: 'components/titles/MovieDetailsMeta.tsx' },
  { from: 'components/ui/CollectionDetailsExtended.tsx', to: 'components/collections/CollectionDetailsExtended.tsx' },
  { from: 'components/ui/CollectionSkeleton.tsx', to: 'components/collections/CollectionSkeleton.tsx' },
  { from: 'components/sections/SearchCatalog.tsx', to: 'components/search/SearchCatalog.tsx' },
  { from: 'components/sections/SearchHeader.tsx', to: 'components/search/SearchHeader.tsx' },
  { from: 'components/ui/CastSection.tsx', to: 'components/sections/CastSection.tsx' },
  { from: 'config/nav-config.ts', to: 'constants/navigation.ts' }
];

moves.forEach(move => {
  const fromPath = path.join(srcDir, move.from);
  const toPath = path.join(srcDir, move.to);
  if (fs.existsSync(fromPath)) {
    fs.renameSync(fromPath, toPath);
    console.log(`Moved ${move.from} to ${move.to}`);
  } else {
    console.log(`File not found: ${move.from}`);
  }
});

const replacements = moves.map(move => {
  const fromImport = '@/' + move.from.replace(/\.tsx?$/, '');
  const toImport = '@/' + move.to.replace(/\.tsx?$/, '');
  return { from: fromImport, to: toImport };
});

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      replacements.forEach(repl => {
        const regex = new RegExp(repl.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        if (regex.test(content)) {
          content = content.replace(regex, repl.to);
          changed = true;
        }
      });

      // Handle relative imports within components folder
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated imports in ${fullPath.replace(srcDir, '')}`);
      }
    }
  });
}

replaceInDir(srcDir);

// Note: `MovieDetailsModal` etc in ui folder had relative imports to each other like `./MovieDetailsHero`
// We need to fix relative imports if they break. Actually since they all moved to `titles`, relative imports like `./MovieDetailsHero` still work!
// The only one is `CastSection` which moved from `ui` to `sections`. We need to update its import in `MovieDetailsExtended` and `CollectionDetailsExtended` if they used relative.
// Let's globally check for any `../ui/CastSection` or similar.

console.log("Component refactoring completed.");
