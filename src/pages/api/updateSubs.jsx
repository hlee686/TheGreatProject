import { connectDB } from "../../../util/database";

export default async function handler(req, res) {
  const { updateVal } = req.body;
  const { movieTitle } = req.query;

  const db = (await connectDB).db("TimeKiller");

  try {
    const filter = { _id: updateVal._id }; 
    const update = {
      $set: { text: updateVal.text } ,
      $inc: { points: 2}
    };

    const result = await db.collection("post").updateOne(filter, update);

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "Post updated successfully" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error('Database update error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
}
