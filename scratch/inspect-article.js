const fs = require('fs');
const path = require('path');

// Manually parse .env.local
let NYT_API_KEY = process.env.NYT_API_KEY;
try {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    const match = envFile.match(/^NYT_API_KEY=(.+)$/m);
    if (match) NYT_API_KEY = match[1].trim();
  }
} catch (e) {}

const NYT_BASE_URL = "https://api.nytimes.com/svc";

async function inspectFirstArticle() {
  const q = encodeURIComponent("movies");
  const url = `${NYT_BASE_URL}/search/v2/articlesearch.json?q=${q}&api-key=${NYT_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const firstDoc = data?.response?.docs?.[0];
    
    if (firstDoc) {
      console.log("--- Multimedia Data ---");
      console.log(JSON.stringify(firstDoc.multimedia, null, 2));
    } else {
      console.log("No articles found.");
    }
  } catch (error) {
    console.error(error);
  }
}

inspectFirstArticle();
