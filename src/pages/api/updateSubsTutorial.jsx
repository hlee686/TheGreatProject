import { connectDB } from "../../../util/database";

export default async function handler(req, res) {
  const { updateVal } = req.body;
  const { movieTitle } = req.query;

  const db = (await connectDB).db("TimeKiller");

  try {
    const filter = { _id: updateVal._id }; 
    const update = {
      $set: { text: updateVal.text, updateTimes: updateVal.updateTimes + 1 }
    };
    
    const result = await db.collection("tutorial").updateOne(filter, update);

    if (result.modifiedCount === 1) {
      // 업데이트 성공 시 success: true를 반환
      res.status(200).json({ success: true });
    } else {
      // 업데이트 실패 시 success: false를 반환
      res.status(200).json({ success: false });
    }
  } catch (error) {
    console.error('Database update error:', error);
    res.status(500).json({ success: false });
  }
}

