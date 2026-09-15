const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function getTrendingMedia() {
  const res = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=ar-SA`);
  const data = await res.json();
  return data.results || [];
}

export async function searchMedia(query) {
  if (!query) return [];
  const res = await fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&language=ar-SA&query=${encodeURIComponent(query)}`
  );
  const data = await res.json();
  return data.results || [];
}
