import { connectDB } from "../../../util/database";
import {atom, useAtom} from 'jotai';


export default async function handler(req, res) {
  const { email } = req.query;

  if (req.method === 'GET') {
    try {
      const db = (await connectDB).db('TimeKiller');
      const likedMoviesCollection = db.collection('likes');

      const likedMovies = await likedMoviesCollection
        .find({ email }, { projection: { movieId: 1 } })
        .toArray();

      const likedMovieIds = likedMovies.map((likedMovie) => likedMovie.movieId);

      return res.status(200).json({ likedMovies: likedMovieIds });
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed.' });
  }
}
