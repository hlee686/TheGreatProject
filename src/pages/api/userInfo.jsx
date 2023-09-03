import { connectDB } from "../../../util/database";
import {atom, useAtom} from 'jotai';

export default async function handler(req, res) {
  try {
    const db = (await connectDB).db("TimeKiller");
    let list = await db.collection("users").find().toArray();
    res.status(200).json(list);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
