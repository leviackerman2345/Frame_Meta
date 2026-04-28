const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN || process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

async function testLogo() {
  const id = 414906; // The Batman
  const type = 'movie';
  const url = `https://api.themoviedb.org/3/${type}/${id}/images`;
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  console.log('Logos found:', data.logos?.length || 0);
  if (data.logos && data.logos.length > 0) {
    console.log('First logo path:', data.logos[0].file_path);
  } else {
    console.log('No logos found.');
  }
}

testLogo();
