import { connectDB } from "../../../util/database";
import {atom, useAtom} from 'jotai';
import { userId, idAtom } from "../../app/atoms";
export default async function handler(req, res) {
  const userIdAtom = atom(userId);

  const emailDB = (await connectDB).db("test");
  const userDocument = await emailDB.collection("users").findOne({ email: "slee0628@ersatz.kr" });

  if (!userDocument) {
    return res.status(400).json({ error: "User not found" });
  }

  const db = (await connectDB).db("TimeKiller");
  let result = await db.collection("post").insertOne({
    _id: req.body.userIdVal,
    movie: req.body.title.title,
    comment: req.body.comment,
    logged: userDocument.email
  });

  let list = await db.collection("post").find().toArray();

  return res.status(200).json(list);
}