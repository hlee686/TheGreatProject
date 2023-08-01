import { useAtom, useAtomValue } from 'jotai';
import { userId, idAtom, loggedInAtom, loggedId } from '../atoms';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function Comments() {
  const [comment, setComment] = useState('');
  const [userIdVal, setUserIdVal] = useAtom(userId);
  const [commentsList, setCommentsList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null)
  const [title, setTitle] = useAtom(idAtom)

  const [id, setId] = useAtom(loggedId)

  useEffect(() => {
    setUserIdVal(uuidv4());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userIdVal, comment, title }),
    });
    if (response.ok) {
      const list = await response.json();
      await setCommentsList(list);
      setComment('');
    }
  };
  const applyExp = async(itemId) => {
    setSelectedItem(itemId === selectedItem ? null : itemId);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
      <div>
        <h3>나의 표현:</h3>
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
        </ul>
      </div>
    </div>
  );
}
