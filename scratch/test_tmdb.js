
require('dotenv').config({ path: '.env.local' });
const token = process.env.TMDB_ACCESS_TOKEN;

async function test() {
  const url = "https://api.themoviedb.org/3/trending/movie/day?language=en-US";
  const headers = {
    accept: "application/json",
    Authorization: `Bearer ${token}`
  };

  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    if (response.ok) {
      console.log("SUCCESS: Token is valid.");
      console.log("First movie title:", data.results[0]?.title || data.results[0]?.name);
      console.log("Results count:", data.results?.length);
    } else {
      console.error(`FAILURE: ${response.status} ${response.statusText}`);
      console.error(data);
    }
  } catch (e) {
    console.error("ERROR:", e);
  }
}

test();
