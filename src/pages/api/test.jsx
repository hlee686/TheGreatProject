import { connectDB } from "../../../util/database";
import {atom, useAtom} from 'jotai';
import { userId, idAtom, loggedId, likes} from "../../app/atoms";

export default async function handler(req, res) {

  const likeCnt = atom(likes)

  const { dataId, userIdVal, comment, title, updateVal, update} = req.body;

  const emailDB = (await connectDB).db("test");
  const userDocument = await emailDB.collection("users").findOne({ email: dataId });

  if (!userDocument) {
    return res.status(400).json({ error: "User not found" });
  }

  const db = (await connectDB).db("TimeKiller");
  let result = await db.collection("post").insertOne({
    _id: userIdVal,
    movie: title.title,
    comment: comment,
    logged: userDocument.email,
    likes: likeCnt.init.init
  });


  let list = await db.collection("post").find().toArray();

  return res.status(200).json(list);
}