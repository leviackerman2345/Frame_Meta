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

async function testNewsAPI() {
  console.log("--- News API Diagnostics ---");
  console.log(`API Key defined: ${!!NYT_API_KEY}`);
  if (NYT_API_KEY) {
    console.log(`API Key starts with: ${NYT_API_KEY.substring(0, 4)}...`);
  }

  const q = encodeURIComponent("movies OR cinema");
  const url = `${NYT_BASE_URL}/search/v2/articlesearch.json?q=${q}&api-key=${NYT_API_KEY}`;

  try {
    const start = Date.now();
    const response = await fetch(url);
    const duration = Date.now() - start;
    
    console.log(`Response Status: ${response.status} (${response.statusText})`);
    console.log(`Response Time: ${duration}ms`);

    if (response.ok) {
      const data = await response.json();
      const docs = data?.response?.docs || [];
      console.log(`Articles found: ${docs.length}`);
      
      const articlesWithImages = docs.filter(d => Array.isArray(d.multimedia) && d.multimedia.length > 0);
      console.log(`Articles with images: ${articlesWithImages.length}`);

      if (docs.length > 0) {
        console.log("\n--- Top 3 Articles ---");
        docs.slice(0, 3).forEach((d, i) => {
          console.log(`${i+1}. ${d.headline?.main || d.abstract}`);
          console.log(`   Section: ${d.section_name}`);
          console.log(`   Has Image: ${Array.isArray(d.multimedia) && d.multimedia.length > 0}`);
        });
      }
    } else {
      const errorText = await response.text();
      console.error(`Error details: ${errorText}`);
    }
  } catch (error) {
    console.error(`Fetch error: ${error.message}`);
  }
}

testNewsAPI();
