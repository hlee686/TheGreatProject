import { connectDB } from "../../../util/database";
import { atom, useAtom } from 'jotai';

export default async function handler(req, res) {
  const { loginId } = req.query;
  const db = (await connectDB).db("TimeKiller");
  let list = await db.collection("post").find({ email: loginId }).toArray();

    const updatedPoints = list[0].points - 2;
    await db.collection("post").updateOne(
      { _id: list[0]._id },
      { $set: { points: updatedPoints } }
    );
    list[0].points = updatedPoints; 


  res.status(200).json(list);
}
