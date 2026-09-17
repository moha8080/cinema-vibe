'use client';

import React, { useEffect, useState } from 'react';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY; // ضع مفتاح TMDB هنا في env
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

type MediaType = 'movie' | 'tv';

interface TMDBMedia {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type?: MediaType;
}

interface TMDBSeason {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
}

interface TMDBEpisode {
  id: number;
  episode_number: number;
  name: string;
}

interface TMDBTVDetails {
  id: number;
  name: string;
  overview: string;
  seasons: TMDBSeason[];
}

interface TMDBMovieDetails {
  id: number;
  title: string;
  overview: string;
}

type ActiveTab = 'home' | 'watch';

interface ServerOption {
  id: string;
  name: string;
  // هنا تبني رابط التضمين حسب السيرفر القانوني الذي تستخدمه
  buildUrl: (params: {
    tmdbId: number;
    type: MediaType;
    season?: number;
    episode?: number;
  }) => string;
}

const serverOptions: ServerOption[] = [
  {
    id: 'server1',
    name: 'سيرفر 1 (قانوني/رسمي)',
    buildUrl: ({ tmdbId, type, season, episode }) => {
      // مثال عام: استبدل هذا بالرابط الخاص بمنصتك أو مشغلك القانوني
      // مثلاً: https://your-legal-player.com/embed/movie/{tmdbId}
      if (type === 'movie') {
        return `https://your-legal-player.com/embed/movie/${tmdbId}`;
      }
      return `https://your-legal-player.com/embed/tv/${tmdbId}/season/${season}/episode/${episode}`;
    },
  },
  {
    id: 'server2',
    name: 'سيرفر 2 (مشغّل داخلي)',
    buildUrl: ({ tmdbId, type, season, episode }) => {
      // يمكنك لاحقاً ربط هذا بمسار داخلي في موقعك أو مشغّل HLS قانوني
      if (type === 'movie') {
        return `/player/movie?tmdbId=${tmdbId}`;
      }
      return `/player/tv?tmdbId=${tmdbId}&season=${season}&episode=${episode}`;
    },
  },
];

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  const [trending, setTrending] = useState<TMDBMedia[]>([]);
  const [popularMovies, setPopularMovies] = useState<TMDBMedia[]>([]);
  const [popularTV, setPopularTV] = useState<TMDBMedia[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TMDBMedia[]>([]);
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(1);

  const [selectedMedia, setSelectedMedia] = useState<TMDBMedia | null>(null);
  const [selectedType, setSelectedType] = useState<MediaType>('movie');

  const [tvDetails, setTvDetails] = useState<TMDBTVDetails | null>(null);
  const [movieDetails, setMovieDetails] = useState<TMDBMovieDetails | null>(null);

  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const [episodes, setEpisodes] = useState<TMDBEpisode[]>([]);

  const [selectedServerId, setSelectedServerId] = useState<string>(serverOptions[0].id);

  // جلب التريند
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(
          `${TMDB_BASE_URL}/trending/all/day?api_key=${TMDB_API_KEY}&language=ar-SA`
        );
        const data = await res.json();
        setTrending(data.results || []);
      } catch (e) {
        console.error('Error fetching trending', e);
      }
    };

    const fetchPopularMovies = async () => {
      try {
        const res = await fetch(
          `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=ar-SA&page=1`
        );
        const data = await res.json();
        setPopularMovies(data.results || []);
      } catch (e) {
        console.error('Error fetching popular movies', e);
      }
    };

    const fetchPopularTV = async () => {
      try {
        const res = await fetch(
          `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=ar-SA&page=1`
        );
        const data = await res.json();
        setPopularTV(data.results || []);
      } catch (e) {
        console.error('Error fetching popular tv', e);
      }
    };

    fetchTrending();
    fetchPopularMovies();
    fetchPopularTV();
  }, []);

  // البحث
  const handleSearch = async (page = 1) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchPage(1);
      setSearchTotalPages(1);
      return;
    }
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&language=ar-SA&query=${encodeURIComponent(
          searchQuery
        )}&page=${page}`
      );
      const data = await res.json();
      setSearchResults(data.results || []);
      setSearchPage(data.page || 1);
      setSearchTotalPages(data.total_pages || 1);
    } catch (e) {
      console.error('Error searching', e);
    }
  };

  const handleLoadMoreSearch = () => {
    if (searchPage < searchTotalPages) {
      handleSearch(searchPage + 1);
    }
  };

  // اختيار عنصر للمشاهدة
  const handleSelectMedia = async (media: TMDBMedia) => {
    const type: MediaType =
      media.media_type === 'tv' || (!media.title && media.name) ? 'tv' : 'movie';

    setSelectedMedia(media);
    setSelectedType(type);
    setActiveTab('watch');
    setSelectedSeason(null);
    setSelectedEpisode(null);
    setEpisodes([]);
    setTvDetails(null);
    setMovieDetails(null);

    if (type === 'tv') {
      try {
        const res = await fetch(
          `${TMDB_BASE_URL}/tv/${media.id}?api_key=${TMDB_API_KEY}&language=ar-SA`
        );
        const data = await res.json();
        setTvDetails(data);
      } catch (e) {
        console.error('Error fetching TV details', e);
      }
    } else {
      try {
        const res = await fetch(
          `${TMDB_BASE_URL}/movie/${media.id}?api_key=${TMDB_API_KEY}&language=ar-SA`
        );
        const data = await res.json();
        setMovieDetails(data);
      } catch (e) {
        console.error('Error fetching movie details', e);
      }
    }
  };

  // جلب حلقات الموسم المحدد
  const fetchSeasonEpisodes = async (tvId: number, seasonNumber: number) => {
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=ar-SA`
      );
      const data = await res.json();
      setEpisodes(data.episodes || []);
    } catch (e) {
      console.error('Error fetching season episodes', e);
    }
  };

  const currentServer = serverOptions.find((s) => s.id === selectedServerId) || serverOptions[0];

  const buildEmbedUrl = () => {
    if (!selectedMedia) return '';
    const tmdbId = selectedMedia.id;
    if (selectedType === 'movie') {
      return currentServer.buildUrl({ tmdbId, type: 'movie' });
    }
    return currentServer.buildUrl({
      tmdbId,
      type: 'tv',
      season: selectedSeason || 1,
      episode: selectedEpisode || 1,
    });
  };

  const renderPoster = (media: TMDBMedia) => {
    const title = media.title || media.name || 'بدون عنوان';
    const imgSrc = media.poster_path
      ? `${TMDB_IMAGE_BASE}${media.poster_path}`
      : media.backdrop_path
      ? `${TMDB_IMAGE_BASE}${media.backdrop_path}`
      : undefined;

    return (
      <div
        key={`${media.id}-${title}`}
        className="group cursor-pointer w-40 flex-shrink-0"
        onClick={() => handleSelectMedia(media)}
      >
        <div className="relative w-40 h-60 rounded-lg overflow-hidden bg-zinc-900">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
              لا توجد صورة
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <p className="mt-2 text-xs text-zinc-200 line-clamp-2 group-hover:text-orange-400 transition-colors">
          {title}
        </p>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100">
      {/* الهيدر */}
      <header className="border-b border-zinc-800 bg-[#09090b]/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-orange-300 flex items-center justify-center">
              <span className="text-xs font-bold text-black">M</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-zinc-100">موفي هَب</span>
              <span className="text-[11px] text-zinc-500">اكتشف وشاهد الأفلام والمسلسلات</span>
            </div>
          </div>

          <nav className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1 rounded-full border text-xs transition ${
                activeTab === 'home'
                  ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                  : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500'
              }`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => setActiveTab('watch')}
              disabled={!selectedMedia}
              className={`px-3 py-1 rounded-full border text-xs transition ${
                activeTab === 'watch'
                  ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                  : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500'
              } ${!selectedMedia ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              المشاهدة
            </button>
          </nav>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        {activeTab === 'home' && (
          <section className="space-y-6">
            {/* محرك البحث */}
            <div className="flex flex-col gap-3">
              <label className="text-xs text-zinc-400">ابحث عن فيلم أو مسلسل</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                  placeholder="اكتب اسم العمل هنا..."
                  className="flex-1 rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-orange-500"
                />
                <button
                  onClick={() => handleSearch()}
                  className="px-4 py-2 rounded-lg bg-orange-500 text-xs font-semibold text-black hover:bg-orange-400 transition"
                >
                  بحث
                </button>
              </div>
              {searchResults.length > 0 && (
                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                  <span>
                    النتائج: صفحة {searchPage} من {searchTotalPages}
                  </span>
                  {searchPage < searchTotalPages && (
                    <button
                      onClick={handleLoadMoreSearch}
                      className="text-orange-400 hover:text-orange-300"
                    >
                      تحميل المزيد
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* نتائج البحث */}
            {searchResults.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-zinc-100">نتائج البحث</h2>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {searchResults.map(renderPoster)}
                </div>
              </div>
            )}

            {/* التريند */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-orange-500" />
                التريند اليومي
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {trending.map(renderPoster)}
              </div>
            </div>

            {/* أفلام شهيرة */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-orange-500" />
                أفلام شهيرة
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {popularMovies.map(renderPoster)}
              </div>
            </div>

            {/* مسلسلات شهيرة */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-orange-500" />
                مسلسلات شهيرة
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {popularTV.map(renderPoster)}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'watch' && selectedMedia && (
          <section className="space-y-6">
            {/* معلومات العمل */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
                {renderPoster(selectedMedia)}
              </div>
              <div className="w-full md:w-2/3 space-y-3">
                <h1 className="text-lg font-semibold text-zinc-100">
                  {selectedMedia.title || selectedMedia.name}
                </h1>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {selectedMedia.overview || 'لا يوجد وصف متوفر باللغة العربية.'}
                </p>

                <div className="flex flex-wrap gap-2 text-[11px] text-zinc-500">
                  <span className="px-2 py-1 rounded-full bg-zinc-900 border border-zinc-700">
                    النوع: {selectedType === 'movie' ? 'فيلم' : 'مسلسل'}
                  </span>
                  {selectedType === 'tv' && tvDetails && (
                    <span className="px-2 py-1 rounded-full bg-zinc-900 border border-zinc-700">
                      عدد المواسم: {tvDetails.seasons.length}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* إعدادات المشاهدة (مواسم/حلقات + سيرفرات) */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* مواسم وحلقات للمسلسلات */}
              {selectedType === 'tv' && tvDetails && (
                <div className="space-y-3 md:col-span-2">
                  <h2 className="text-sm font-semibold text-zinc-100">اختيار الموسم والحلقة</h2>
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1">
                      <label className="text-[11px] text-zinc-400 mb-1 block">الموسم</label>
                      <select
                        className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-orange-500"
                        value={selectedSeason ?? ''}
                        onChange={(e) => {
                          const seasonNumber = Number(e.target.value);
                          setSelectedSeason(seasonNumber);
                          setSelectedEpisode(null);
                          setEpisodes([]);
                          fetchSeasonEpisodes(tvDetails.id, seasonNumber);
                        }}
                      >
                        <option value="" disabled>
                          اختر الموسم
                        </option>
                        {tvDetails.seasons.map((season) => (
                          <option key={season.id} value={season.season_number}>
                            {season.name || `الموسم ${season.season_number}`} (
                            {season.episode_count} حلقة)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="text-[11px] text-zinc-400 mb-1 block">الحلقة</label>
                      <select
                        className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-orange-500"
                        value={selectedEpisode ?? ''}
                        onChange={(e) => {
                          const episodeNumber = Number(e.target.value);
                          setSelectedEpisode(episodeNumber);
                        }}
                        disabled={!episodes.length}
                      >
                        <option value="" disabled>
                          {episodes.length ? 'اختر الحلقة' : 'اختر موسم أولاً'}
                        </option>
                        {episodes.map((ep) => (
                          <option key={ep.id} value={ep.episode_number}>
                            الحلقة {ep.episode_number} - {ep.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* سيرفرات التشغيل */}
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-zinc-100">سيرفرات التشغيل</h2>
                <p className="text-[11px] text-zinc-500">
                  اختر السيرفر القانوني أو المشغّل الداخلي الذي قمت بربطه بالموقع.
                </p>
                <select
                  className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-orange-500"
                  value={selectedServerId}
                  onChange={(e) => setSelectedServerId(e.target.value)}
                >
                  {serverOptions.map((server) => (
                    <option key={server.id} value={server.id}>
                      {server.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* مشغّل الفيديو (iframe) */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-zinc-100">المشاهدة الآن</h2>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
                {buildEmbedUrl() ? (
                  <iframe
                    src={buildEmbedUrl()}
                    className="w-full h-[420px] bg-black"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="مشغّل الفيديو"
                  />
                ) : (
                  <div className="w-full h-[220px] flex items-center justify-center text-xs text-zinc-500">
                    يرجى اختيار الموسم والحلقة (للمسلسلات) أو التأكد من إعداد السيرفر.
                  </div>
                )}
              </div>
              <p className="text-[11px] text-zinc-500">
                تأكد دائماً من استخدام مصادر قانونية تحترم حقوق الملكية الفكرية عند ربط أي
                سيرفر تشغيل.
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default HomePage;
