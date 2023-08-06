import { connectDB } from "../../../util/database";
import { atom, useAtom } from 'jotai';

export default async function handler(req, res) {
    const { title } = req.query;
    const { likeId } = req.body;

    try {
        const db = (await connectDB).db("TimeKiller");
        let result;

        const existingDocument = await db.collection("likes").findOne({ title: title });
        if (existingDocument) {
            result = await db.collection("likes").updateOne(
                { title: title },
                { $inc: { like: 1 } }
            );
        } else {
            result = await db.collection("likes").insertOne({ _id: likeId._id, title: title, like: 1 });
        }

        return existingDocument ? res.status(200).json(existingDocument) : res.status(200).json(result)
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "An error occurred." });
    }
}
