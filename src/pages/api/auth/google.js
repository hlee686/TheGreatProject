import { connectDB } from "../../../util/database";
import { OAuth2Client } from "google-auth-library";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { code } = req.body;
  const db = (await connectDB).db("TimeKiller");

 
  const client = new OAuth2Client({
    clientId: "250547107253-fv03f4g3rmib6o1dh4icqe2j2m77m9ln.apps.googleusercontent.com",
    clientSecret: "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",
    redirectUri: "https://the-great-project.vercel.app/api/auth/callback/google",
  });

  try {
    const { tokens } = await client.getToken(code);

    res.status(200).json({ message: "Google OAuth succeeded" });
  } catch (error) {
    console.error("Google OAuth error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}