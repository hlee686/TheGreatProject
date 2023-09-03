import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const uploadDir = './public/uploads/'; // 이미지를 저장할 디렉토리

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // 디렉토리가 없으면 생성
    fs.mkdirSync(uploadDir, { recursive: true });
    callback(null, uploadDir);
  },
  filename: (req, file, callback) => {
    // 이미지 파일의 이름 설정 (예: 유니크한 이름 사용)
    const imageName = `${uuidv4()}_${file.originalname}`;
    callback(null, imageName);
  },
});

const upload = multer({ storage: storage });

export const config = {
  api: {
    bodyParser: false, // 파일 업로드를 위해 bodyParser를 비활성화합니다.
  },
};

export default async (req, res) => {
  try {
    upload.single('image')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: '파일 업로드 오류' });
      } else if (err) {
        return res.status(500).json({ message: '서버 오류' });
      }
      
      // 파일 업로드 성공 시, 이미지 URL을 반환합니다.
      const imageUrl = `/uploads/${req.file.filename}`;
      res.status(200).json({ imageUrls: [imageUrl] });
    });
  } catch (error) {
    console.error('이미지 업로드 오류:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
