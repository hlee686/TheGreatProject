import { connectDB } from "../../../util/database";
import {atom, useAtom} from 'jotai';

export default async function handler(req, res) {
  const {email} = req.query()
  const db = (await connectDB).db("TimeKiller");
  let list = await db.collection("tutorial").find({email: email}).toArray()

  res.status(200).json(list)
}