import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from "next/link"

const YOUR_TMDB_API_KEY = 'ece6713d4ebc06e447cee9d8efecf96f';

export default function MovieByActor(){
  const [actorInfo, setActorInfo] = useState('');
  const [movieResponse, setMovieResponse] = useState([]);

  useEffect(() => {
    if (actorInfo) {
      const fetchData = async () => {
        try {
          const actorSearchResponse = await axios.get(
            `https://api.themoviedb.org/3/search/person?api_key=${YOUR_TMDB_API_KEY}&query=${actorInfo}`
          );

          const actorId =
            actorSearchResponse?.data?.results?.[0]?.id || null;

          if (!actorId) {
            console.error('Actor not found!');
            return;
          }

          const movieResponse = await axios.get(
            `https://api.themoviedb.org/3/discover/movie?api_key=${YOUR_TMDB_API_KEY}&with_cast=${actorId}`
          );

          const sortedMovies = movieResponse.data.results.sort((a, b) => b.vote_count - a.vote_count);

          setMovieResponse(sortedMovies);
          
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [actorInfo]);

  const actorChange = (e) => {
    e.preventDefault();
    setActorInfo(e.target.elements.actor.value);
  };

  return (
    <div style={{ textAlign: "center", margin:"50px"}}>
      <form onSubmit={actorChange}>
        <input
          type="text"
          name="actor"
          placeholder="Actor's name"
        />
        <button type="submit">Search</button>
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
           <Link href={{ pathname: '/Detail', query: { id: movie.id } }}>
            <p>{movie.title}</p>
           </Link>
        </div>))}
    </div>
  );
};


