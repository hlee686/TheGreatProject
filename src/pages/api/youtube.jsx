import axios from 'axios';

export default async (req, res) => {
  try {
    const apiKey = 'AIzaSyBn6uaEI3OfsjLXdMSiYvyuke7ijZdBBas'
    const videoId = req.query.videoId; // 동적으로 동영상 ID를 전달받을 수 있음

    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${apiKey}`
    );

    const captionTracks = response.data.items;
    res.status(200).json({ captionTracks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
