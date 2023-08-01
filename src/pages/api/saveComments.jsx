import { useState, useEffect } from 'react';
import { connectDB } from '/util/database.js';

export default function Display() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchData(req, res) {
      try {
        const db = (await connectDB).db('TimeKiller');
        const result = await db.collection('post').insertOne(req.body);
        setPosts(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
    댓글저장완료
    </>
  );
}
