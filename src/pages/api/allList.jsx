import { connectDB } from "../../../util/database";
import {atom, useAtom} from 'jotai';

export default async function handler(req, res) {
  const {title} = req.query
  const db = (await connectDB).db("TimeKiller");
  let list = await db.collection("post").find({movie: "GoodFellas"}).toArray();
  res.status(200).json(list)
}