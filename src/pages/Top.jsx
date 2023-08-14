import React, {useState, useEffect} from "react"
import { useRouter } from 'next/router';
import {loggedId, tutorial} from "../app/atoms"
import {useAtom} from 'jotai'
import { v4 as uuidv4 } from 'uuid';

export default function Top() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [highlightList, setHighlightList] = useState([]);
  const [logged, setLogged] = useState(false);
  const [subtitles, setSubtitles] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trailer, setTrailer] = useState('');
  const [highlightedText, setHighlightedText] = useState('');
  const [userIdVal, setUserIdVal] = useState('');
  const [movieTitle, setMovieTitle] = useState('');
  const [email, setEmail] = useAtom(loggedId);
  const [allExp, setAllExp] = useState([]);
  const [emailBool, setEmailBool] = useState(false);
  const [updateVal, setUpdateVal] = useState('');
  const [tutorialConfig, setTutorialConfig] = useAtom(tutorial)

  const router = useRouter();
  const { id } = useRouter().query;

  const embedUrl = "https://www.youtube.com/embed/0Jg8AeuPFSc";
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };


  const fetchSubtitles = async () => {
    const url = `https://subtitles-for-youtube.p.rapidapi.com/subtitles/0Jg8AeuPFSc.srt`;
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
    } catch (error) {
      console.log("자막이 없어요 아쉽게도")
    }
};

const highlight = async (event) => {
  const selectedText = window.getSelection().toString();
  alert('표현이 저장되었습니다.');

  if (selectedText) {
    console.log(selectedText);
    localStorage.setItem('highlight', selectedText);

    try {
      await setUserIdVal(uuidv4());
      const response = await fetch('/api/highlightExpTutorial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedText, userIdVal, email }),
      });

      if (response.ok) {
        const range = window.getSelection().getRangeAt(0);
        const mark = document.createElement('mark');
        range.surroundContents(mark);
      } else {
        const errorResponse = await response.json(); 
        console.error("Failed to save highlight on the server:", errorResponse.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
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

const completeTutorial = async() => {
  try {
    const res = await fetch(`/api/completeTutorial`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (res.ok) {
      const list = await res.json();
      console.log("리스트는", list.length)
      if(list.length > 4){
        await setTutorialConfig(true)
        console.log("튜토리얼", tutorialConfig)
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

return (
  <div>
    <iframe
      width="560"
      height="315"
      src={embedUrl}
      title="YouTube video player"
      frameBorder="0"
      allow="autoplay; encrypted-media"
      allowFullScreen
    />

    <button onClick={completeTutorial}>Tutorial 완료</button>

    <button onClick={fetchSubtitles}>자막보기</button>
    {logged ? (
      <button onClick={seeHighlights}>나의 표현집</button>
    ) : (
      <button disabled>나의 표현집</button>
    )}
    <p onClick={highlight}>{subtitles}</p>
    {isModalOpen && (
      <div className="modal-overlay">
        <div className="modal">
          <button className="close-button" onClick={closeModal}>
            닫기
          </button>
          <ul>
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
                      <div style={{ color: "blue", fontStyle: "italic" }}>{item.title}</div>
                      <button onClick={() => updateExp()}>응용하기</button>
                    </div>
                  ) : (
                    <div className="collapsed-view">
                      <p>{item.text}</p>
                      <div style={{ color: "blue", fontStyle: "italic" }}>{item.title}</div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )}
  </div>
);
}