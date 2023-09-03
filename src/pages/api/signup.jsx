import { connectDB } from "../../../util/database";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, imgSrc } = req.body;

    try {
      const db = (await connectDB).db("TimeKiller");

      // Check if email already exists in the collection
      const existingUser = await db.collection("users").findOne({ email });

      if (existingUser) {
        res.status(400).json({ message: 'Email already exists' });
      } else {
        await db.collection("users").insertOne({
          email,
          password,
          imgSrc
        });

        res.status(200).json({ message: 'Signup successful' });
      }
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Signup failed' });
    }
  } else {
    res.status(405).end(); 
  }
}
