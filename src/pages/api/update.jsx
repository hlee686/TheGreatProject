import { connectDB } from "../../../util/database";
import {atom, useAtom} from 'jotai';

export default async function handler(req, res) {
  const { updateVal } = req.body;
  const {movieTitle} = req.query

    const db = (await connectDB).db("TimeKiller");

    const existingPost = await db.collection("post").findOne({ movie: movieTitle });

  let existingComment = ""; 

  if (existingPost && existingPost.comment !== undefined) {
    existingComment = existingPost.comment;
  }

    const filter = { _id: updateVal._id }; 
    const update = {
      $set: { comment: `${updateVal.comment} / ${existingComment}` },
    };

    const result = await db.collection("post").updateOne(filter, update);

  }