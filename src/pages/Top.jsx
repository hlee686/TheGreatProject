import React, {useState, useEffect} from "react"
import { useRouter } from 'next/router';
import {loggedId, tutorial, tutorialNum, loginByEmail, editSc} from "../app/atoms"
import {useAtom} from 'jotai'
import { v4 as uuidv4 } from 'uuid';
import "./Top.css"
import "./DetailPage.css"
import { splitParagraphIntoSentences } from '../../util/openai'

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
  const [tutorialT, setTutorialT] = useAtom(tutorialNum)
  const [tutorialCnt, setTutorialCnt] = useState(0)
  const [highlighted, setHighlighted] = useState(false)
  const [editSuccess, setEditSuccess] = useAtom(editSc)
  const [paragraph, setParagraph] = useState('');
  const [sentences, setSentences] = useState([]);
  const [splitP, setSplitP] = useState(false)
  const [byEmail, setByEmail] = useAtom(loginByEmail)


  const router = useRouter();
  const { id } = useRouter().query;

  const embedUrl = "https://www.youtube.com/embed/uYPbbksJxIg";
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  
  const fetchSubtitles = async () => {
    alert("5초 후 자막이 나타납니다")
    const url = `https://subtitles-for-youtube.p.rapidapi.com/subtitles/uYPbbksJxIg.srt`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '3c2c74efdcmsh0332beb878c66c5p107718jsne3e0d5bcb02e',
        'X-RapidAPI-Host': 'subtitles-for-youtube.p.rapidapi.com'
      }
    };
  
    try {
      const response = await fetch(url, options);
      const result = await response.text();
  
      const cleanedResult = result.replace(/(\d+|EMBER|AIR PERSON)|(::,|\.| --> |::,::,|::::|:|,\s*,)/g, '\n')
        .split('\n')
        .filter((line) => line.trim() !== '')
        .join('\n');
  
      await Promise.all([
        setSubtitles(cleanedResult),
        setParagraph(cleanedResult),
      ]);
  
      setSplitP(true);
    } catch (error) {
      alert("자막이 없어요 아쉽게도");
    }
  };


useEffect(()=>{
  async function split(){
    if(splitP){
      await handleSplit()
    }
  }
  split()
},[splitP])

const highlight = async (event) => {
  const selectedText = window.getSelection().toString();
  setHighlighted(!highlighted)
  alert("표현이 저장되었습니다.")

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
        body: JSON.stringify({ selectedText, userIdVal, byEmail }),
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
    const res = await fetch(`/api/seeHighlightsTutorial?byEmail=${byEmail}`, {
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
    const response = await fetch(`/api/updateSubsTutorial?movieTitle=${movieTitle}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updateVal: { _id: selectedItem, text: updateVal, updateTimes: 0 }})
    });

    console.log("Fetch completed:", response);

    if (response.ok) {
      setEditSuccess(true)
      const responseBody = await response.json();
      
      if (responseBody.success) {
        const updatedList = highlightList.map((item) =>
          item._id === selectedItem ? { ...item, text: updateVal } : item
        );
        setHighlightList(updatedList);
        
        const updatedAllExp = allExp.map((item) =>
          item._id === selectedItem ? { ...item, text: updateVal} : item
        );
        setAllExp(updatedAllExp);
      
      } else {
        console.error('Update failed:', responseBody.message);
      }
    } else {
      const responseBody = await response.json();
      console.error('Error:', responseBody.message);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
};


// const completeTutorial = async() => {
//   try {
//     const res = await fetch(`/api/completeTutorial?email=${email}`, {
//       method: "GET",
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     });
//     if (res.ok) {
//       const list = await res.json();
//       setTutorialT(list.length)
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// };

const [pass, setPass] = useState(false)

const passTutorial = async() =>{
  try {
      const res = await fetch(`/api/tutorialCnt?byEmail=${byEmail}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (res.ok) {
        const list = await res.json();
        await setTutorialCnt(list.length+1)
        console.log(tutorialCnt)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  if(tutorialCnt > 1 && editSuccess){
    alert('튜토리얼 완료, 축하합니다!');
    router.push("/Main")
  }

useEffect(()=>{
  passTutorial()
},[highlight, editSuccess])

const handleSplit = async () => {
  try {
    const result = await splitParagraphIntoSentences(paragraph);
    await setSentences(result);
  } catch (error) {
    console.error('Error splitting paragraph:', error);
  }
}

return (
  <div>
    {/* <button onClick={handleSplit}>Split</button> */}
    <iframe
      width="560"
      height="315"
      src={embedUrl}
      title="YouTube video player"
      frameBorder="0"
      allow="autoplay; encrypted-media"
      allowFullScreen
    />
    <div>
        <h2>튜토리얼에 오신걸 환영합니다</h2>
        <div style={{ overflowY: 'scroll', maxHeight: '300px' }}>
          {sentences.map((sentence, index) => (
            <p onClick={highlight} key={index}>{sentence}</p>
          ))}
        </div>

      </div>

    {/* {tutorialConfig && <button onClick={completeTutorial} className="tutorial-button">Tutorial 완료</button>} */}
    <h1>자막보기를 켜고, 무작위로 표현 3개만 하이라이트 해 보세요!</h1>
    <button onClick={fetchSubtitles}>자막보기</button>
      <button onClick={seeHighlights}>나의 표현집</button>
    {/* <p onClick={highlight}>{subtitles}</p> */}
    {isModalOpen && (
      <div className="modal-overlay">
        <div className="modal">
          <button className="close-button" onClick={closeModal}>
            닫기
          </button>
          <ul>
          <p style={{color: "red"}}>대사를 클릭해서 응용해보세요!</p>
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