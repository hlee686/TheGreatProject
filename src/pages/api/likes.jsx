import { connectDB } from "../../../util/database";
import {atom, useAtom} from 'jotai';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end(); 
  }

    const { title } = req.query;
    const db = (await connectDB).db("TimeKiller");

    const result = await db.collection("post").updateOne(
      { movie: title },
      { $inc: { likes: 1 } } 
    )
    return res.status(200).json(result);
  }