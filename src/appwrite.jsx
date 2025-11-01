import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
    .setEndpoint("https://fra.cloud.appwrite.io/v1")
    .setProject(PROJECT_ID);

const databases = new Databases(client);

export const updateSearchCount = async (query, movie) => {
    try {
        const payload = {
            query: query,
            movie_id: movie.imdbID,
            poster_url: movie.Poster,
            title: movie.Title,
            rating: movie.imdbRating || "N/A",
        };

        await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            payload
        );

    } catch (err) {
        console.error("updateSearchCount Error:", err);
    }
};

export const getTrendingMovies = async () => {
    try {
        const result = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.limit(6)]
        );

        return result.documents;
    } catch (error) {
        console.error("getTrendingMovies Error:", error);
        return [];
    }
};
