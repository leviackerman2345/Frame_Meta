const fs = require('fs');
const path = require('path');

let TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN;
let NYT_KEY = process.env.NYT_API_KEY;

try {
  const env = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
  const tmdb = env.match(/^TMDB_ACCESS_TOKEN=(.+)$/m);
  const nyt = env.match(/^NYT_API_KEY=(.+)$/m);
  if (tmdb) TMDB_TOKEN = tmdb[1].trim();
  if (nyt) NYT_KEY = nyt[1].trim();
} catch(e) {}

async function time(label, fn) {
  const start = Date.now();
  try { await fn(); } catch(e) { console.error(`${label} ERROR:`, e.message); }
  console.log(`${label}: ${Date.now() - start}ms`);
}

async function main() {
  // Test actor ID 500 = Tom Cruise
  const id = 500;

  console.log('\n=== TMDB API Timing Breakdown ===\n');

  await time('1. Basic Info (name/bio/images/social)', async () => {
    const r = await fetch(
      `https://api.themoviedb.org/3/person/${id}?language=en-US&append_to_response=external_ids,images`,
      { headers: { Authorization: `Bearer ${TMDB_TOKEN}` } }
    );
    const d = await r.json();
    console.log(`   -> Got: ${d.name}, images: ${d.images?.profiles?.length || 0}`);
  });

  await time('2. Movie Credits (heavy)', async () => {
    const r = await fetch(
      `https://api.themoviedb.org/3/person/${id}/movie_credits?language=en-US`,
      { headers: { Authorization: `Bearer ${TMDB_TOKEN}` } }
    );
    const d = await r.json();
    console.log(`   -> Got: ${d.cast?.length || 0} movie credits`);
  });

  await time('3. TV Credits (heavy)', async () => {
    const r = await fetch(
      `https://api.themoviedb.org/3/person/${id}/tv_credits?language=en-US`,
      { headers: { Authorization: `Bearer ${TMDB_TOKEN}` } }
    );
    const d = await r.json();
    console.log(`   -> Got: ${d.cast?.length || 0} TV credits`);
  });

  await time('4. Movie + TV Credits (parallel)', async () => {
    const [m, t] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?language=en-US`, { headers: { Authorization: `Bearer ${TMDB_TOKEN}` } }),
      fetch(`https://api.themoviedb.org/3/person/${id}/tv_credits?language=en-US`, { headers: { Authorization: `Bearer ${TMDB_TOKEN}` } }),
    ]);
    const [md, td] = await Promise.all([m.json(), t.json()]);
    console.log(`   -> Got: ${md.cast?.length || 0} movies, ${td.cast?.length || 0} TV shows`);
  });

  await time('5. NYT News Query (artist name)', async () => {
    const q = encodeURIComponent('"Tom Cruise" OR Tom Cruise');
    const r = await fetch(
      `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${q}&api-key=${NYT_KEY}`,
      { signal: AbortSignal.timeout(4000) }
    );
    const d = await r.json();
    console.log(`   -> Got: ${d?.response?.docs?.length || 0} articles`);
  });

  console.log('\n=== Done ===\n');
}

main();
