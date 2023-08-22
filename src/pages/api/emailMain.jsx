import { connectDB } from "../../../util/database";
import {atom, useAtom} from 'jotai';

export default async function handler(req, res) {
  const {loginEmail} = req.query;
  const db = (await connectDB).db("TimeKiller");
  let list = await db.collection("users").find({email: loginEmail}).toArray();
  res.status(200).json(list)
}