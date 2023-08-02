import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAtom } from 'jotai';
import { idAtom, loggedInAtom, loggedId } from '../app/atoms';
import Comments from '@/app/components/Comments';

export default function Detail() {
  const [idData, setIdData] = useAtom(idAtom);
  const [actor, setActor] = useState('');
  const { id } = useRouter().query;
  const [trailer, setTrailer] = useState('');

  const [logged, setLogged] = useAtom(loggedInAtom);
  const [email, setEmail] = useAtom(loggedId);

  const router = useRouter(); 

  useEffect(() => {
    async function fetchMovieData() {
      try {
        const apiKey = 'ece6713d4ebc06e447cee9d8efecf96f';
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
        );
        const movieData = response.data;
        await setIdData(movieData);
        await setTitle(movieData.title);
      } catch (error) {
        console.error('Error fetching movie data:', error.message);
      }
    }
    fetchMovieData();
  }, [id]);

  useEffect(() => {
    async function fetchMovieCredits() {
      try {
        const apiKey = 'ece6713d4ebc06e447cee9d8efecf96f';
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`
        );
        const cast = response.data.cast[0].name;
        setActor(cast);
      } catch (error) {
        console.error('Error fetching movie credits:', error.message);
      }
    }
    fetchMovieCredits();
  }, [id]);

  useEffect(() => {
    async function fetchTrailer() {
      try {
        const apiKey = 'YOUR_GOOGLE_API_KEY';
        const response = await axios.get(
          'https://www.googleapis.com/youtube/v3/search',
          {
            params: {
              q: idData.title + ' Trailer',
              key: apiKey,
              part: 'snippet',
              maxResults: 10,
              type: 'video',
              order: 'viewCount',
            },
          }
        );

        const videoId = response.data.items[0].id.videoId;
        setTrailer(videoId);
        console.log(`https://www.youtube.com/watch?v=${videoId}`);
      } catch (error) {
        console.error('Error fetching movie trailer:', error.message);
      }
    }
    fetchTrailer();
  }, [idData]);

  return (
    <div>
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${trailer}`}
        frameBorder="0"
        allowFullScreen
      ></iframe>

      <h1>{idData.title}</h1>
      {logged ? <p>로그인</p> : <p></p>}
      <p>평점: {idData.vote_average}</p>
      <div>주연: {actor}</div>
      <img
        src={`https://image.tmdb.org/t/p/w500${idData.poster_path}`}
        alt="DetailPoster"
      />
      <Comments />
    </div>
  );
}


