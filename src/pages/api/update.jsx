import { connectDB } from "../../../util/database";
import {atom, useAtom} from 'jotai';

export default async function handler(req, res) {
  const { updateVal } = req.body;

    const db = (await connectDB).db("TimeKiller");
    
    
    const filter = { _id: updateVal._id }; 
    const update = {
      $set: { comment: updateVal.comment }
    };

    const result = await db.collection("post").updateOne(filter, update);

    console.log("Update Result:", result);
  }