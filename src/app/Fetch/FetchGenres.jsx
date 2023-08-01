import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link"

const FetchGenres = () => {
  const [genreInfo, setGenreInfo] = useState("");
  const [movieResponse, setMovieResponse] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!genreInfo) return; 

      try {
        const genreResponse = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=ece6713d4ebc06e447cee9d8efecf96f`
        );
        const genres = genreResponse.data.genres;
        const movieGenre = genres.find((genre) => genre.name === genreInfo);

        if (!movieGenre) {
          console.error("Genre not found!");
          return;
        }

        const movieResponse = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=ece6713d4ebc06e447cee9d8efecf96f&with_genres=${movieGenre.id}`
        );
        setMovieResponse(movieResponse.data.results);
        console.log(movieResponse)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [genreInfo]);

  const genreChange = (e) => {
    e.preventDefault();
    setGenreInfo(e.target.elements.genre.value); 
  };

  return (
    <div style={{display: "flex", flexDirection: "row"}}>
      <form onSubmit={genreChange}>
        <input type="text" name="genre" placeholder="장르" />
        <button type="submit">장르선택</button>
      </form>
      {movieResponse.map((movie, idx) => (
        <div style={{ width: "300px", height: "300px", marginRight: "30px"}} key={idx}>
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt="Poster"
              style={{width: "300px", height: "300px"}}
            />
          )}
           <p style={{textAlign: "center"}}>{movie.title}</p>
           <Link href={{ pathname: '/Detail', query: { id: movie.id } }}>
            <p>{movie.title}</p>
           </Link>
        </div>
      ))}
    </div>
  );
};

export default FetchGenres;
