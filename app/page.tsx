"use client";

import { useEffect, useState } from "react";
import type { SearchResponse } from "./types";

export default function Home() {
  const [data, setData] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!query.trim()) {
      setData(null);
      return;
    }

    const timer = setTimeout(() => {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}`
      )
        .then((res) => res.json())
.then((json) => {
  if (!json.results) {
    setError(json.status_message || "Something went wrong");
    return;
  }
  setError(null);
  setData(json);
})
.catch((err) => setError(err.message));
    }, 400);

    return () => clearTimeout(timer);
  }, [query, page]);

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <h1 className="mb-4 text-2xl font-semibold">Movie Night</h1>

      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1);
        }}
        placeholder="Search movies..."
        className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-neutral-500 outline-none focus:border-violet-500"
      />

      {error && <p className="text-red-400">Error: {error}</p>}

      {!query.trim() && (
  <p className="mt-6 text-center text-neutral-500">
    Start typing to search for movies.
  </p>
)}

{query.trim() && !data && !error && (
  <p className="mt-6 text-neutral-400">Loading...</p>
)}

      {data?.results && data.results.length > 0 && (
        <ul className="mt-6 space-y-2">
          {data.results.map((movie) => (
            <li key={movie.id} className="flex gap-3 rounded-lg bg-white/5 p-2">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="h-24 w-16 rounded object-cover"
                />
              ) : (
                <div className="flex h-24 w-16 items-center justify-center rounded bg-white/10 text-xs text-neutral-500">
                  No image
                </div>
              )}
              <p className="self-center text-sm text-white">{movie.title}</p>
            </li>
          ))}
        </ul>
      )}

      {data?.results && data.results.length === 0 && (
        <p className="mt-6 text-center text-neutral-400">
          No movies found. Try a different search.
        </p>
      )}

      {data?.results && data.results.length > 0 && (
        <div className="mt-6 flex items-center justify-between gap-4">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              page === 1
                ? "cursor-not-allowed bg-white/5 text-neutral-600"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            ← Previous
          </button>

          <span className="text-sm text-neutral-400">
            Page {page} of {data.total_pages}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= data.total_pages}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              page >= data.total_pages
                ? "cursor-not-allowed bg-white/5 text-neutral-600"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Next →
          </button>
        </div>
      )}
    </main>
  );
}