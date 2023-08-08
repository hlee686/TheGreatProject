import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAtomValue } from 'jotai';
import { loggedInAtom, likes, idLikes } from '../atoms';
import { v4 as uuidv4 } from 'uuid';

const YOUR_TMDB_API_KEY = 'ece6713d4ebc06e447cee9d8efecf96f';

export default function MovieByTitle() {
  const logged = useAtomValue(loggedInAtom);
  const [title, setTitle] = useState('');
  const [clicked, setClicked] = useState(false);
  const [movieList, setMovieList] = useState([]);
  const [likeCnt, setLikeCnt] = useState({});
  const [likedMovies, setLikedMovies] = useState([]);

  const searchTitle = async (e) => {
    e.preventDefault();
    setTitle(e.target.elements.title.value);
    setClicked(!clicked);
  };

  useEffect(() => {
    async function fetchLikes() {
      try {
        const res = await fetch(`/api/initialLikes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          const list = await res.json();
          console.log('Response data:', list);
          setLikedMovies(list.likedMovies);

          const filteredLikes = list.filter((item) =>
            movieList.some((movie) => movie.id === item._id)
          );

          const likeCntUpdates = {};
          filteredLikes.forEach((filter) => {
            likeCntUpdates[filter._id] = filter.like;
          });

          setLikeCnt((prevCounts) => ({
            ...prevCounts,
            ...likeCntUpdates,
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    if (movieList.length > 0) {
      fetchLikes();
    }
  }, [movieList]);

  const handleLikeClick = async (movieId) => {
    const movieIndex = movieList.findIndex((movie) => movie.id === movieId);

    if (movieIndex !== -1 && !movieList[movieIndex].liked) {
      try {
        const response = await fetch(`/api/likes?title=${title}&id=${movieId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: movieId }),
        });

        console.log('Response status:', response.status);

        if (response.ok) {
          const result = await response.json();
          const updatedLikeCnt = {
            ...likeCnt,
            [movieId]: result.like,
          };
          setLikeCnt(updatedLikeCnt);

          const updatedMovieList = movieList.map((movie) => {
            if (movie.id === movieId) {
              return {
                ...movie,
                liked: true,
              };
            }
            return movie;
          });
          setMovieList(updatedMovieList);
        } else {
          const result = await response.json();
          console.log('결과는', result);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${YOUR_TMDB_API_KEY}&query=${title}&sort_by=vote_count.desc`
        );
        const data = await response.json();
        setMovieList(data.results);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    if (clicked && title) {
      fetchData();
    }
  }, [clicked, title]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <form onSubmit={searchTitle}>
        <input type="text" name="title" placeholder="영화제목" />
        <button type="submit">Search</button>
      </form>

      {movieList.map((movie, idx) => (
        <div style={{ width: '300px', height: '300px', marginRight: '30px' }} key={idx}>
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt="Poster"
              style={{ width: '300px', height: '300px' }}
            />
          )}
          <Link href={{ pathname: '/Detail', query: { id: movie.id } }}>
            <p>{movie.title}</p>
          </Link>

          <button
            onClick={() => handleLikeClick(movie.id)}
            disabled={movie.liked || likedMovies.includes(movie.id)}
          >
            {movie.liked ? 'Liked' : 'Like'}
          </button>

          <p>{likeCnt[movie.id] !== undefined ? likeCnt[movie.id] : 0}</p>
        </div>
      ))}
    </div>
  );
}
