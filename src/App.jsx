import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";

const API_KEY = "c47615ae";
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

const DEFAULT_MOVIES = [
    "Avengers", "John Wick", "Black Adam", "Squid Game", "Dune", "Wednesday",
    "Breaking Bad", "Stranger Things", "Interstellar", "Inception",
    "The Boys", "Peaky Blinders", "The Dark Knight", "Money Heist",
    "Spider-Man", "Joker", "Mission Impossible", "Deadpool",
    "The Witcher", "The Flash", "Naruto", "Loki"
];

// ⭐ Separate trending queries
const TRENDING_KEYWORDS = [
    "Squid Game", "Avengers", "Loki", "Deadpool", "Wednesday",
    "Stranger Things", "Joker", "Dune"
];

const App = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [movies, setMovies] = useState([]);
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRatings = async (id) => {
        const res = await fetch(`${API_URL}&i=${id}`);
        return await res.json();
    };

    const fetchMovieList = async (query) => {
        const res = await fetch(`${API_URL}&s=${encodeURIComponent(query)}`);
        return await res.json();
    };

    const fetchMovies = async (query) => {
        setLoading(true);
        const data = await fetchMovieList(query);

        if (!data.Search) {
            setMovies([]);
            setLoading(false);
            return;
        }

        const ratedMovies = await Promise.all(
            data.Search.map(async (m) => await fetchRatings(m.imdbID))
        );

        setMovies(ratedMovies.filter(m => m.imdbRating !== "N/A"));
        setLoading(false);
    };

    const loadTrending = async () => {
        const promises = TRENDING_KEYWORDS.map(k => fetchMovieList(k));
        const data = await Promise.all(promises);

        const movies = data.flatMap(d => d.Search || []);
        const rated = await Promise.all(movies.map(m => fetchRatings(m.imdbID)));

        const valid = rated
            .filter(m => m.imdbRating && m.imdbRating !== "N/A")
            .slice(0, 12);

        setTrending(valid);
    };

    const loadDefaults = async () => {
        setLoading(true);

        const promises = DEFAULT_MOVIES.map(t => fetchMovieList(t));
        const data = await Promise.all(promises);

        const movies = data.flatMap(d => d.Search || []);
        const rated = await Promise.all(movies.map(m => fetchRatings(m.imdbID)));

        const valid = rated.filter(m => m.imdbRating && m.imdbRating !== "N/A");

        setMovies(valid.slice(0, 30));
        setLoading(false);
    };

    useEffect(() => {
        loadDefaults();
        loadTrending();
    }, []);

    useEffect(() => {
        if (!searchTerm.trim()) {
            loadDefaults();
        } else {
            const delay = setTimeout(() => fetchMovies(searchTerm), 600);
            return () => clearTimeout(delay);
        }
    }, [searchTerm]);

    return (
        <main>
            <div className="wrapper">
                <header>
                    <h1>Find <span className="text-gradient">Movies</span> You'll Love</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    <br />
                    <h2>Trending </h2>

                </header>

                {/* Trending Section */}
                {trending.length > 0 && (
                    <section className="trending">
                        <ul className="scroll-x">
                            {trending.map((m) => (
                                <MovieCard key={m.imdbID} movie={m} />
                            ))}
                        </ul>
                    </section>
                )}

                {/* Popular / Search Results */}
                <section className="all-movies">
                    <h2>{searchTerm ? "Search Results" : "Popular Movies"}</h2>
                    {loading ? <Spinner /> : (
                        <ul className="movies-grid">
                            {movies.map((m) => (
                                <MovieCard key={m.imdbID} movie={m} />
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
};

export default App;
