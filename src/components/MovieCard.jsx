import React from "react";


const MovieCard = ({ movie, small = false }) => {
    if (!movie) return null;

    const poster = movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "/no-image.jpg";
    const rating = movie.imdbRating && movie.imdbRating !== "N/A" ? movie.imdbRating : null;
    const title = movie.Title || movie.title || "Untitled";


    if (small) {
        return (
            <li className="trending-card" aria-label={title}>
                <div className="trending-rank" />
                <img className="trending-poster" src={poster} alt={title} loading="lazy" />
                <div className="trending-title">{title}</div>
            </li>
        );
    }

    return (
        <li className="movie-card" data-imdbid={movie.imdbID}>
            <div className="movie-card-inner">
                <img className="poster" src={poster} alt={title} loading="lazy" />

                <div className="movie-info">
                    <h3 className="movie-title">{title}</h3>
                    <div className="movie-meta">
                        <span className="movie-year">{movie.Year || "—"}</span>
                        {rating && <span className="movie-rating">⭐ {rating}</span>}
                    </div>
                </div>
            </div>
        </li>
    );
};

export default MovieCard;
