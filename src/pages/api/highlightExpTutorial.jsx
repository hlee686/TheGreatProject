import { connectDB } from "../../../util/database";
import {atom, useAtom} from 'jotai';

export default async function handler(req, res) {
  const {selectedText, userIdVal, email} = req.body
  const db = (await connectDB).db("TimeKiller");
  let result = await db.collection("tutorial").insertOne({
    _id: userIdVal,
    text: selectedText,
    email: email
  });
}