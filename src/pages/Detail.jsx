import { useRouter } from 'next/router';
import axios from "axios"
import { useState,  useEffect } from 'react';
import { idAtom, loggedInAtom} from "../app/atoms"
import {atom, useAtom} from 'jotai'
import Comments from '@/app/Fetch/Comments';

export default function Detail() {
  const [idData, setIdData] = useAtom(idAtom)
  const [actor, setActor] = useState('')
  const { id } = useRouter().query;
  const [trailer, setTrailer] = useState('')

  const [logged, setLogged] = useAtom(loggedInAtom)

  const [title, setTitle] = useState('')

  useEffect(async()=>{
    const movieById = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=ece6713d4ebc06e447cee9d8efecf96f`)
    await setTitle(movieById.data.title)
    await setIdData(movieById.data)
  },[])

  useEffect(()=>{
    console.log(idData)
  },[idData])


  useEffect(() => {
    async function fetchMovieCredits() {
      try {
        const apiKey = "ece6713d4ebc06e447cee9d8efecf96f";
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`);
        const cast = response.data.cast[0].name;
        setActor(cast);
      } catch (error) {
        console.error("Error fetching movie credits:", error.message);
      }
    }
    fetchMovieCredits();
  }, [id]);

  useEffect(() => {
    async function apiTrailer() {
      try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            q: idData.title + "Trailer",
            key: "AIzaSyBv0baBjKF9BQP0vfv53WaK6dAeDte3YGk",
            part: 'snippet',
            maxResults: 10,
            type: 'video',
            order: 'viewCount'
          },
        });
  
        const videoId = response.data.items[1].id.videoId;
        console.log(response.data.items)
        await setTrailer(videoId);
        console.log(`https://www.youtube.com/watch?v=${videoId}`);
      } catch (error) {
        console.error("Error fetching movie trailer:", error.message);
      }
    }
  
    apiTrailer();
  }, [idData]);

  return (
    <div>
      
      <iframe
      width="560"
      height="315"
      src={`https://www.youtube.com/embed/${trailer}?hl=en&cc_lang_pref=en`}
      frameBorder="0"
      allowFullScreen
    ></iframe>

      <h1>{idData.title}</h1>
      {logged ? <p>로그인</p>: <p></p>}
      <p>평점: {idData.vote_average}</p>
      <div>주연: {actor}</div>
      <img src={`https://image.tmdb.org/t/p/w500${idData.poster_path}`} alt="DetailPoster"/>
      {/* {idData.map((movie, idx)=><div key={idx}><Comments idData={movie} /> </div>)} */}
      <Comments />
    </div>
  );
}





