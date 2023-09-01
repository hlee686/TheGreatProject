import {useEffect, useState} from "react"
import Link from "next/link"
import { filtered, loginByEmail, loggedId, tPoints } from "../atoms"
import {atom, useAtom} from "jotai"
import axios from 'axios';
import "./page.css"

export default function HighRating() {
  const [movieByRating, setMovieByRating] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);
  const [loginId, setLoginId] = useAtom(loginByEmail)
  const [googleId, setGoogleId] = useAtom(loggedId)

  const [totalPoint, setTotalPoint] = useAtom(tPoints)

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

  const handleSlide = (direction) => {
    const maxSlideIndex = filteredMovies.length - 1;

    if (direction === 'prev') {
      setSlideIndex((prevIndex) =>
        prevIndex === 0 ? maxSlideIndex : prevIndex - 1
      );
    } else if (direction === 'next') {
      setSlideIndex((prevIndex) =>
        prevIndex === maxSlideIndex ? 0 : prevIndex + 1
      );
    }
  };

  const clickMovie = async() =>{
    const response = await fetch(`/api/clickMovie?loginId=${googleId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    const json = await response.json()
    const totalPoints = json.reduce((accumulator, currentValue) => accumulator + currentValue.points, 0);
    setTotalPoint(totalPoints)
  }

  return (
    <div className="slider-container">
      <div className="slider" style={{ transform: `translateX(-${slideIndex * 310}px)` }}>
        {filteredMovies.map((movie, idx) => (
          <div
            key={idx}
            className={`slide`}
          >
<Link
  href={{ pathname:totalPoint > 0 && '/Detail', query: { id: movie.id } }}
  onClick={() => {
    if (totalPoint <= 0) {
      alert('포인트가 부족합니다');
    }
  }}
  style={{ cursor: totalPoint <= 0 ? 'not-allowed' : 'pointer' }}
>
  <p>
    <img
      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
      alt="Poster"
      style={{ width: '300px', height: '300px', marginRight: '10px' }}
    />
  </p>
</Link>




  <Link
  href={{ pathname: '/Detail', query: { id: movie.id } }}
  onClick={clickMovie}
  style={{ pointerEvents: totalPoint <= 0 ? 'none' : 'auto' }}
>
  <p>{movie.title}</p>
</Link>

          </div>
        ))}
      </div>

      <button style={{color: "white", fontSize: "50px"}} className="prev-btn" onClick={() => handleSlide('prev')}>
        &#10094;
      </button>
      <button style={{color: "white", fontSize: "50px"}} className="next-btn" onClick={() => handleSlide('next')}>
        &#10095;
      </button>
    </div>
  );
}