import { connectDB } from "../../../util/database";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); 
  }

  const { email, password } = req.body;

  try {
    const db = (await connectDB).db("TimeKiller");
    
    await db.collection("users").insertOne({
      email,
      password, 
    });

    res.status(200).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Signup failed' });
  }
}
