
const NYT_API_KEY = process.env.NYT_API_KEY;
const NYT_BASE_URL = "https://api.nytimes.com/svc";

async function testNews() {
  if (!NYT_API_KEY) {
    console.error("NYT_API_KEY missing");
    return;
  }
  const q = encodeURIComponent("movies OR cinema OR Hollywood OR streaming OR \"box office\"");
  const url = `${NYT_BASE_URL}/search/v2/articlesearch.json?q=${q}&sort=newest&api-key=${NYT_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  const docs = data.response.docs;
  docs.forEach(doc => {
    console.log(`ID: ${doc._id}, Headline: ${doc.headline.main}`);
  });
}

testNews();
