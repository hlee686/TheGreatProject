import { connectDB } from "../../../util/database";
import {atom, useAtom} from 'jotai';

export default async function handler(req, res) {
  const { email } = req.query;
  const db = (await connectDB).db("TimeKiller");
  try {
    const list = await db.collection("tutorial").find({ email: email }).toArray();
    res.status(200).json(list);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
}
