import { connectDB } from "../../../util/database";
import {atom, useAtom} from 'jotai';

export default async function handler(req, res) {
  const db = (await connectDB).db("TimeKiller");
  let list = await db.collection("post").find({logged: "ersatz.dev@gmail.com"}).toArray();
  res.status(200).json(list)
}