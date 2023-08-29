import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAtom } from 'jotai';
import { idAtom, loggedInAtom, loggedId, commentData, commentBool, userId , loggedinViaEmail, loginByEmail} from '../app/atoms';
import Comments from '@/app/components/Comments';
import { signIn, signOut, getSession, useSession} from 'next-auth/react';
import "./DetailPage.css"
import ReactTooltip from 'react-tooltip';
import Link from "next/link"

import { v4 as uuidv4 } from 'uuid';
import "./DetailStyle.css"
import { splitParagraphIntoSentences } from '../../util/openai'

export default function Detail() {
  const [idData, setIdData] = useAtom(idAtom);
  const [actor, setActor] = useState('');
  const [trailer, setTrailer] = useState('');
  const { id } = useRouter().query;
  const [logged, setLogged] = useAtom(loggedInAtom);
  const [email, setEmail] = useAtom(loggedId);
  const [comment, setComment] = useAtom(commentData)
  const [commentB, setCommentB] = useAtom(commentBool)

  const [grammarCheck, setGrammarCheck] = useState(false)

  const [transcript, setTranscript] = useState([]);

  const [subtitles, setSubtitles] = useState('')

  const subtitlesRef = useRef(null);
  const [highlightedText, setHighlightedText] = useState('');

  const [userIdVal, setUserIdVal] = useState(userId)
  const [highlightList, setHighlightList] = useState([])
  const [movieTitle, setMovieTitle] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedItemSec, setSelectedItemSec] = useState(null)
  const [updateVal, setUpdateVal] = useState('')
  const [allExp, setAllExp] = useState([])
  const [emailBool, setEmailBool] = useState(false)
  const [idDataConfig, setIdDataConfig] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [byEmails, setByEmails] = useState([])
  const [emailLogin, setEmailLogin] = useAtom(loginByEmail)
  const [loggedinStatus, setLogginStatus] = useAtom(loggedinViaEmail)
  const [paragraph, setParagraph] = useState('');
  const [sentences, setSentences] = useState([])


  const router = useRouter()

  useEffect(() => {
    setUserIdVal(uuidv4());
  }, [highlightedText]);

  
let videoId = 's-7pyIxz8Qg';
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
    text: comment,
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
    const url = `https://subtitles-for-youtube.p.rapidapi.com/subtitles/${trailer}.srt`;
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '3c2c74efdcmsh0332beb878c66c5p107718jsne3e0d5bcb02e',
		'X-RapidAPI-Host': 'subtitles-for-youtube.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options).catch(()=>setSubtitles("자막 없는 영상입니다"));
	const result = await response.text();
  const cleanedResult = result
    .replace(/\d+/g, '\n') 
    .replace(/::,/g, '::,')
    .replace(/\./g, '')
    .replace(/EMBER|AIR PERSON/g, '')
    .replace(/ --> /g, '')
    .replace(/::,::,/g, '')
    .replace(/::::,/g, '')
    .replace(/:/g, '')
    .replace(/,\s*,/g, '\n')
    .split('\n')
    .filter((line) => line.trim() !== '')
    .join('\n');
      setSubtitles(cleanedResult);
      setParagraph(cleanedResult)
    } catch (error) {
      console.log("자막이 없어요 아쉽게도")
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
        setIdDataConfig(true)
        const castResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`
        );
        const cast = castResponse.data.cast[0].name;
        await setActor(cast);
        const youtubeResponse = await axios.get(
          'https://www.googleapis.com/youtube/v3/search',
          {
            params: {
              q: movieData.title + 'Official Trailer' + "HD",
              key: 'AIzaSyCtr7HJQBKBRVCb3cZGDHO2llm1uy_vWh0',
              part: 'snippet',
              maxResults: 10,
              type: 'video',
              order: 'relevance'
            },
          },
          setMovieTitle(movieData.title),
        );
        const videoId = youtubeResponse.data.items[0].id.videoId;

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

  const highlight = async(event) => {
    const selectedText = window.getSelection().toString();
    alert('표현이 저장되었습니다.');
    if (selectedText) {
      console.log(selectedText);
      localStorage.setItem('highlight', selectedText);
      setHighlightedText(selectedText);

      const requestBody = {
        selectedText,
        userIdVal,
        movieTitle,
        email,
        emailLogin
      };
      

        const response = await fetch('/api/highlightExp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })

      const range = window.getSelection().getRangeAt(0);

      const mark = document.createElement('mark');
      range.surroundContents(mark);
    }
  };

  const seeHighlights = async(e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/seeHighlights?email=${email}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (res.ok) {
        const list = await res.json();
        console.log('Response data:', list)
        setHighlightList(list)
        openModal()
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
 
  const applyExp = async (itemId) => {
    setSelectedItem(itemId === selectedItem ? null : itemId);
  };


  const updateExp = async () => {
    try {
      const response = await fetch(`/api/updateSubs?movieTitle=${movieTitle}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updateVal: { _id: selectedItem, text: updateVal }})
      });
  
      console.log("Fetch completed:", response);
  
      if (response.ok) {
        const updatedList = highlightList.map((item) =>
          item._id === selectedItem ? { ...item, text: updateVal } : item
        );
        setHighlightList(updatedList);
        const updatedAllExp = allExp.map((item) =>
        item._id === selectedItem ? { ...item, text: updateVal } : item
      );
      setAllExp(updatedAllExp);
      } else {
        const responseBody = await response.json();
        console.error('Error:', responseBody.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (idData.title) {
  //         const res = await fetch(`/api/allLists?title=${idData.title}`, {
  //           method: "GET",
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //         });
  //         if (res.ok) {
  //           const list = await res.json();
  //           console.log('Response data:', list);
  //           setAllExp(list);
  //         }
  //       } else {
  //         console.error('Title is missing or empty');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  
  //   fetchData();
  // }, []);
  
  const byMovie = async (e) => {
    e.preventDefault()
    try {
      if (idData.title) {
        const res = await fetch(`/api/allLists?title=${idData.title}`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          const list = await res.json();
          console.log('Response data:', list);
          setAllExp(list);
          setEmailBool(true);
          setIdDataConfig(true);
        }
      } else {
        console.error('Title is missing or empty');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true)
  }
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const byEmail =async(email) =>{
    try {
      const res = await fetch(`/api/seeHighlights?email=${email}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (res.ok) {
        const list = await res.json();
        console.log('Response data:', list)
        await setByEmails(list)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  
  const handleSplit = async () => {
    try {
      const result = await splitParagraphIntoSentences(paragraph);
      setSentences(result);
    } catch (error) {
      console.error('Error splitting paragraph:', error);
    }
  }
  const handleGoBack = () => {
    router.push("/Main")
  }
  
  return (
    <>
      <button onClick={handleSplit}>Split</button>
      <button onClick={handleGoBack}>홈</button>
      <div>
        <h2>Sentences:</h2>
        <div style={{ overflowY: 'scroll', maxHeight: '300px' }}>
          {sentences.map((sentence, index) => (
          <p onClick={highlight} key={index}>{sentence}</p>
          ))}
        </div>

      </div>
      <button onClick={fetchSubtitles}>자막보기</button>
      <button onClick={byMovie}>이 영화 모든표현</button>
      {(logged || loggedinStatus) ? (
        <button onClick={seeHighlights}>나의 표현집</button>
      ) : (
        <button onClick={byEmail}>나의 표현집</button>
      )}
      나의 표현집을 보려면 로그인 해주세요!
      <p onClick={highlight}>{subtitles}</p>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-button" onClick={closeModal}>
              닫기
            </button>
            <ul>
              <p style={{ color: "red" }}>대사를 클릭해서 응용해보세요!</p>
              {highlightList.map((item) => (
                <li key={item._id}>
                  <div className="highlight-item" onClick={() => applyExp(item._id)}>
                    {selectedItem === item._id ? (
                      <div className="expanded-view">
                        <input
                          type="text"
                          placeholder="응용"
                          onClick={(e) => e.stopPropagation()}
                          value={updateVal}
                          onChange={(e) => {
                            setUpdateVal(e.target.value);
                          }}
                        />
                        <p>{item.text}</p>
                        <div style={{ color: "blue", fontStyle: 'italic' }}>{item.title}</div>
                        <button onClick={() => updateExp()}>응용하기</button>
                      </div>
                    ) : (
                      <div className="collapsed-view">
                        <p>{item.text}</p>
                        <div style={{ color: "blue", fontStyle: 'italic' }}>{item.title}</div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {emailBool && idDataConfig && (
        <ul>
          {allExp.map((item) => (
            <li key={item._id}>
              <div onClick={() => applyExp(item._id)}>
                {selectedItem === item._id && email === item.email ? (
                  <div>
                    <input
                      type="text"
                      placeholder="응용"
                      onClick={(e) => e.stopPropagation()}
                      value={updateVal}
                      onChange={(e) => {
                        setUpdateVal(e.target.value);
                      }}
                    />
                    <div style={{ color: "blue", fontStyle: 'italic' }}>{item.email}<span style={{ color: "black" }}>님의 표현</span></div>
                    <button onClick={() => updateExp()}>응용하기</button>
                  </div>
                ) : (
                  <div style={{ backgroundColor: "orange", width: "250px" }}>
                    <p>{item.text}</p>
                    <div style={{ color: "blue", fontStyle: 'italic' }} onClick={() => byEmail(item.email)}>{item.email || item.emailLogin}<span style={{ color: "black" }}>님의 표현</span></div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {logged ? (
        <div className="user-info">
          <p>로그인 상태 {email}</p>
          <button onClick={handleSignOut}>로그아웃</button>
        </div>
      ) : (
        <div className="user-info">
          <p>로그아웃 상태</p>
          <button onClick={() => router.push('/')}>로그인</button>
        </div>
      )}
      <div className="video-info">
        <div className="video">
          <iframe
            title="Movie Trailer"
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${trailer}?cc_load_policy=1`}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
        <div className="info">
          <h1>{idData.title}</h1>
          <p>평점: {String(idData.vote_average).slice(0,3)}/10</p>
          <div>주연: {actor}</div>
        </div>
      </div>
    </>
  );
      }
  
    