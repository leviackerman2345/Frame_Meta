require('dotenv').config({ path: '.env.local' });

const NYT_API_KEY = process.env.NYT_API_KEY;

async function test() {
  if (!NYT_API_KEY) {
    console.error("NYT_API_KEY missing");
    return;
  }
  try {
    const response = await fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=cinema&api-key=${NYT_API_KEY}`);
    const data = await response.json();
    const firstArticle = data.response.docs[0];
    console.log("Byline Object:", JSON.stringify(firstArticle.byline, null, 2));
    console.log("Multimedia Sample:", JSON.stringify(firstArticle.multimedia?.slice(0, 2), null, 2));
  } catch (err) {
    console.error(err.message);
  }
}

test();
