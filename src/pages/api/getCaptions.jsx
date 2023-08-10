// api/getCaptions.js

import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { videoId } = req.query;
    const apiKey = 'AIzaSyAeukRa6bO4MvPqb1Kj_iNCduI43ezWCTU'

    // Fetch video details to get captions track ID
    const videoResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
      params: {
        part: 'contentDetails',
        id: videoId,
        key: apiKey,
      },
    });

    const captionsTrackId = videoResponse.data.items[0].contentDetails.caption;
    const downloadLink = `https://www.googleapis.com/youtube/v3/captions/${captionsTrackId}/download?key=${apiKey}`;

    res.status(200).json({ downloadLink });
  } catch (error) {
    console.error('Error generating download link:', error);
    res.status(500).json({ error: 'Error generating download link' });
  }
}
