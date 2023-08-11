import {useEffect, useState} from "react"
import Link from "next/link"
import { filtered } from "../atoms"
import {atom, useAtom} from "jotai"
import axios from 'axios';

export default function HighRating() {
  const [movieByRating, setMovieByRating] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const allMovies = [];
    
        for (let page = 1; page <= 10; page++) {
          const movieResponse = await axios.get(
            `https://api.themoviedb.org/3/discover/movie?api_key=ece6713d4ebc06e447cee9d8efecf96f&page=${page}`
          );
    
          allMovies.push(...movieResponse.data.results);
        }
    
        const sortedMovies = sortByReleaseDateDescending(allMovies.splice(0,29));
        const filteredAndSortedMovies = sortedMovies.filter((movie) => movie.vote_count > 200);
    
        console.log("Sorted and Filtered Movies:", filteredAndSortedMovies);
    
        setFilteredMovies(filteredAndSortedMovies);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }
    
    function sortByReleaseDateDescending(movies) {
      return movies.slice().sort((a, b) => {
        const dateA = new Date(a.release_date);
        const dateB = new Date(b.release_date);
        return dateB - dateA;
      });
    }
    fetchData();
  }, []);



  return (
    <div style={{ display: "flex" }}>
      {filteredMovies.map((movie, idx) => (
        <div key={idx}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt="Poster"
            style={{ width: "300px", height: "300px", marginRight: "10px" }}
          />

          <Link href={{ pathname: '/Detail', query: { id: movie.id } }}>
            <p>{movie.title}</p>
          </Link>
        </div>
      ))}
    </div>
  );
}
