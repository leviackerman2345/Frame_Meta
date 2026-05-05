
function getSlugFromId(nytId) {
  return nytId.replace("nyt://", "").replace(/\//g, "--");
}

function reconstructNytId(slug) {
  if (slug.includes("--")) {
    return "nyt://" + slug.replace(/--/g, "/");
  } else {
    return `nyt://article/${slug}`;
  }
}

const testIds = [
  "nyt://article/767759b6-96b6-5381-81d3-3563969e2646",
  "nyt://interactive/2026/05/03/movies/review-xyz",
  "nyt://video/cinema/trailer"
];

testIds.forEach(id => {
  const slug = getSlugFromId(id);
  const reconstructed = reconstructNytId(slug);
  console.log(`Original: ${id}`);
  console.log(`Slug:     ${slug}`);
  console.log(`Result:   ${reconstructed}`);
  console.log(`Match:    ${id === reconstructed}`);
  console.log('---');
});
