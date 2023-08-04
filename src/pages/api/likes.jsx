import { connectDB } from "../../../util/database";
import {atom, useAtom} from 'jotai';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end(); 
  }

  try {
    const { title } = req.query;
    const db = (await connectDB).db("TimeKiller");

    const result = await db.collection("post").updateOne(
      { movie: title },
      { $inc: { likes: 1 } } 
    );

    if (result.matchedCount === 1) {
      return res.status(200).json({ message: "Likes updated successfully" });
    } else {
      return res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
