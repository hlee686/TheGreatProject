import { useAtom, useAtomValue } from 'jotai';
import { userId, idAtom, loggedInAtom, loggedId, commentData, commentBool, grammar } from '../atoms';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {getSession} from "next-auth/react"

export default function Comments() {
  const [comment, setComment] = useAtom(commentData);
  const [userIdVal, setUserIdVal] = useAtom(userId);
  const [commentsList, setCommentsList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null)
  const [title, setTitle] = useAtom(idAtom)
  const [myExp, setMyExp] = useState([])
  const [myBool, setMyBool] = useState(false)

  const [dataId, setDataId] = useAtom(loggedId)

  const [update, setUpdate] = useState(false)
  const [updateVal, setUpdateVal] = useState('')

  const [movieTitle, setMovieTitle] = useState('')
  const [pastData, setPastData] = useState({})

  const [commentB, setCommentB] = useAtom(commentBool)

  useEffect(() => {
    setUserIdVal(uuidv4());
  }, []);

  const myList = async (e) => {
    setMyBool(true)
    e.preventDefault();
    try {
      const res = await fetch(`/api/myList?dataId=${dataId}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (res.ok) {
        const list = await res.json();
        console.log('Response data:', list);
        await setMyExp(list);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async () => {
    console.log('Request payload:', { dataId, userIdVal, comment, title })
  
    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dataId, userIdVal, comment, title }),
      });
  
      console.log('Response status:', response.status);
  
      if (response.ok) {
        const list = await response.json();
        console.log('Response data:', list);
        await setCommentsList(list);
        await setComment("He will happy")
        await setCommentB(true)
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const applyExp = async(itemId) => {
    setSelectedItem(itemId === selectedItem ? null : itemId);
  };
  const updateExp = async(comment) => {
    try {
      const response = await fetch(`/api/update?movieTitle=${movieTitle}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updateVal: { _id: selectedItem, comment }})
      });
  
      if (response.ok) {
        const list = await response.json();
        await setPastExpression([...pastExpression, list])
        setComment('');
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const pastExp = async (comment, movieTitle) => {
    try {
      const response = await fetch(`/api/past?movieTitle=${movieTitle}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const list = await response.json();
        setPastData(prevPastData => ({ ...prevPastData, [movieTitle]: list }));
        setComment('');
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  
  
  return (
    <div>

<form onSubmit={handleSubmit}>
        <input type="hidden" name="dataId" value={dataId} />
        <input type="hidden" name="userIdVal" value={userIdVal} />
        <input type="hidden" name="title" value={title.title} />
        <textarea
          name="comment"
          type="textarea"
          placeholder="표현"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">표현 추가</button>
      </form>

      <button onClick={myList}>나의 표현들</button>

      {myBool && myExp.map((item) => (
  <li key={item._id} onClick={() => applyExp(item._id)}>
    {selectedItem === item._id ? (
      <div>
        <input
          type="text"
          placeholder="응용"
          onClick={(e) => e.stopPropagation()}
          value={updateVal}
          onChange={(e) => {
            const updatedCommentsList = myExp.map((commentItem) =>
              commentItem._id === item._id
                ? { ...commentItem, comment: e.target.value }
                : commentItem
            );
            setMyExp(updatedCommentsList);
            setUpdateVal(e.target.value)
            setMovieTitle(item.movie)
          }}
        />
        <p style={{ fontStyle: 'italic', color: "blue" }}>{item.movie}</p>
      </div>
    ) : (
      <div>
        {item.comment.indexOf('/') !== -1 ? item.comment.substring(0, item.comment.indexOf('/')) : item.comment}
        <p style={{ fontStyle: 'italic', color: "blue" }}>{item.movie}</p>
      </div>
    )}
      <button onClick={() => updateExp(item.comment)}>응용하기</button>
      <button onClick={(comment, movie)=>  pastExp(item.comment, item.movie)}>과거표현들</button>
      <p style={{ backgroundColor: "skyblue" }}>{pastData[item.movie]}</p>
  </li>
))}


     
      <div>
        {/* <h3>나의 표현:</h3>
        <ul>
          {commentsList.map((item) => (
            <li key={item._id} onClick={() => applyExp(item._id)}>
              {item.comment}
              {selectedItem === item._id && (
                <input
                  type="text"
                  placeholder="응용"
                  onClick={(e) => e.stopPropagation()}
                  value={item.comment}
                  onChange={(e) => {
                    const updatedCommentsList = commentsList.map((commentItem) =>
                      commentItem._id === item._id
                        ? { ...commentItem, comment: e.target.value }
                        : commentItem
                    );
                    setCommentsList(updatedCommentsList);
                  }}
                />
              )}
              <p style={{fontStyle: 'italic', color: "blue"}}>{item.movie}</p>
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
}
