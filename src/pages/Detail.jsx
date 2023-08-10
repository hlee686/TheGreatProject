import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAtom } from 'jotai';
import { idAtom, loggedInAtom, loggedId, commentData, commentBool } from '../app/atoms';
import Comments from '@/app/components/Comments';
import { signIn, signOut, getSession, useSession} from 'next-auth/react';

import { getSubtitles } from 'youtube-captions-scraper'
import * as cheerio from 'cheerio';


export default function Detail() {
  const [idData, setIdData] = useAtom(idAtom);
  const [actor, setActor] = useState('');
  const [trailer, setTrailer] = useState('');
  const { id } = useRouter().query;
  const [logged, setLogged] = useAtom(loggedInAtom);
  const [email, setEmail] = useAtom(loggedId);
  const [commentExp, setCommentExp] = useAtom(commentData)
  const [commentB, setCommentB] = useAtom(commentBool)

  const [grammarCheck, setGrammarCheck] = useState(false)

  const [transcript, setTranscript] = useState([]);

  const [subtitles, setSubtitles] = useState('')

  const subtitlesRef = useRef(null);
  const [highlightedText, setHighlightedText] = useState('');

  
let videoId = '4eaZ_48ZYog';
let apiKey = 'AIzaSyCtr7HJQBKBRVCb3cZGDHO2llm1uy_vWh0'


  useEffect(() => {
    (async () => {
      const options = {
        method: 'POST',
  url: 'https://grammarbot-neural.p.rapidapi.com/v1/check',
  headers: {
    'content-type': 'application/json',
    'X-RapidAPI-Key': '3c2c74efdcmsh0332beb878c66c5p107718jsne3e0d5bcb02e',
    'X-RapidAPI-Host': 'grammarbot-neural.p.rapidapi.com'
  },
  data: {
    text: commentExp,
    lang: 'en'
  }
      };
  
      try {
        const response = await axios.request(options);
        await setCommentExp(response.data.correction);
        setGrammarCheck(true)
      } catch (error) {
        if (error.response && error.response.status === 429) {
          console.error("너무 많은 요청입니다. 잠시 후 다시 시도하세요.");
        } else {
          console.error(error);
        }
      }
    })();
  }, []);

  
  const fetchSubtitles = async () => {
    const url = `https://subtitles-for-youtube.p.rapidapi.com/subtitles/4eaZ_48ZYog.srt`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '3c2c74efdcmsh0332beb878c66c5p107718jsne3e0d5bcb02e',
        'X-RapidAPI-Host': 'subtitles-for-youtube.p.rapidapi.com',
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      const cleanedResult = result
        .replace(/\d+/g, '')
        .replace(/::,/g, '::,')
        .replace(/\./g, '')
        .replace(/EMBER|AIR PERSON/g, '')
        .replace(/ --> /g, '')
        .replace(/::,::,/g, '')
        .replace(/::::,/g, '')
        .split('\n')
        .filter((line) => line.trim() !== '')
        .join(' ');
      setSubtitles(cleanedResult);
    } catch (error) {
      console.error(error);
    }
};


  useEffect(() => {
    async function fetchMovieData() {
      try {
        const apiKey = 'f1d7de1cecea58c0bb220b2a33361510';
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
        );
        const movieData = response.data;
        setIdData(movieData);
        const castResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`
        );
        const cast = castResponse.data.cast[0].name;
        setActor(cast);
        const youtubeResponse = await axios.get(
          'https://www.googleapis.com/youtube/v3/search',
          {
            params: {
              q: movieData.title + 'Official Trailer',
              key: 'AIzaSyCtr7HJQBKBRVCb3cZGDHO2llm1uy_vWh0',
              part: 'snippet',
              maxResults: 10,
              type: 'video',
              order: 'relevance'
            },
          }
        );
        const videoId = youtubeResponse.data.items[0]?.id?.videoId;
        setTrailer(videoId);
      } catch (error) {
        console.log('Error fetching data:', error.message);
      }
    }
    fetchMovieData()
  }, [id]);


  const handleSignOut = () => {
    signOut()
  }

  const highlight = (event) => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      console.log('Highlighted Text:', selectedText);
      localStorage.setItem('highlight', selectedText);
      setHighlightedText(selectedText);

      const range = window.getSelection().getRangeAt(0);

      const mark = document.createElement('mark');
      range.surroundContents(mark);
    }
  };

  
  

  return (
    <>
    <button onClick={fetchSubtitles}>자막</button>
    <p ref={subtitlesRef} onClick={highlight}>
      {subtitles}
      </p>

      {logged ? (
        <div>
          <p>로그인 상태 {email}</p>
          <button onClick={handleSignOut}>로그아웃</button>
        </div>
      ) : (
        <>
          <p>로그아웃 상태</p>
          <button onClick={() => Router.push("/")}>로그인</button>
        </>
      )}
      <div style={{ position: 'relative' }}>
        <iframe
          title="Movie Trailer"
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${trailer}?cc_load_policy=1`}
          frameBorder="0"
          allowFullScreen
        ></iframe>
  
        <div>
          <h1>{idData.title}</h1>
          <p>평점: {idData.vote_average}</p>
          <div>주연: {actor}</div>
          <img
            style={{ width: "200px", height: "350px" }}
            src={`https://image.tmdb.org/t/p/w500${idData.poster_path}`}
            alt="DetailPoster"
          />
          <Comments />
        </div>
        <div>
      </div>
      </div>
    </>
  );
      }  