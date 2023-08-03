import { connectDB } from "../../../util/database";
import {atom, useAtom} from 'jotai';

export default async function handler(req, res) {
    const { movieTitle } = req.query;
    
    const db = (await connectDB).db("TimeKiller");
    const existingPost = await db.collection("post").findOne({ movie: movieTitle });

    if (existingPost && existingPost.comment) {
      const slashIndex = existingPost.comment.indexOf('/');
      if (slashIndex !== -1) {
        const afterSlash = existingPost.comment.substring(slashIndex + 1);
        res.status(200).json(afterSlash)
      }
    }
  }