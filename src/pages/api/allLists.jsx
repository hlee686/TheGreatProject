import { connectDB } from "../../../util/database";
import {atom, useAtom} from 'jotai';

export default async function handler(req, res) {
  try {
    const { title } = req.query;
    const db = (await connectDB).db("TimeKiller");
    let list = await db.collection("post").find({ title: title }).toArray();
    res.status(200).json(list);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}