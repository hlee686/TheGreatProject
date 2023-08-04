import React, {useEffect, useState} from 'react'
import Link from "next/link"
import {useAtom, useAtomValue} from 'jotai'
import { loggedInAtom, likes} from "../atoms"
const YOUR_TMDB_API_KEY = 'ece6713d4ebc06e447cee9d8efecf96f';

export default function MovieByTitle (){

  const logged = useAtomValue(loggedInAtom)

  const [title, setTitle] = useState('')
  const [clicked, setClicked] = useState(false)
  const [movieList, setMovieList] = useState([])

  const [like, setLike] = useAtom(likes)

  const searchTitle = async(e) => {
    e.preventDefault()
    await setTitle(e.target.elements.title.value)
    setClicked(!clicked)
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${YOUR_TMDB_API_KEY}&query=${title}`
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

  const getLikes = async (title) => {
    try {
      const response = await fetch(`/api/likes?title=${title}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Response status:', response.status);
  
      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data.likes); // Assuming the likes count is in the 'likes' property of the response
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  
  

  return (
    <div style={{display: "flex", flexDirection: "row"}}>
       <form onSubmit={searchTitle}>
        <input
          type="text"
          name="title"
          placeholder="영화제목"
        />
        <button type="submit">Search</button>
      </form>

      {movieList.map((movie, idx)=>  <div style={{ width: "300px", height: "300px", marginRight: "30px"}} key={idx}>
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

           <button onClick={()=>getLikes(movie.title)}>좋아요</button>
        </div>)}

    </div>
  )
}