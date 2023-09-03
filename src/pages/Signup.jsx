import React, { useState } from 'react';
import { useRouter } from 'next/router';
import "./Signup.css"

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    imgSrc: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          imgSrc: formData.imgSrc
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.message) {
          router.push("/");
        } else {
          console.log("Signup failed. Response data:", responseData);
        }
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      imgSrc: ''
    });
  };

  const [image, setImage] = useState(null);
  const [imgSrc, setImgSrc] = useState('')
  const [upload, setUpload] = useState(false)

  const handleImageChange = (e) => {
    const selectedImage = e.target.files;
    setImage(selectedImage);
  };

  const handleUpload = async () => {
    if (!image) {
      alert('이미지를 선택하세요.');
      return;
    }
  
    try {
      const formData = new FormData();
      for (let i = 0; i < image.length; i++) {
        formData.append('image', image[i]);
      }
  
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        alert('이미지 업로드 성공!');
        console.log('이미지 URL:', data.imageUrls);
        // 이미지 URL을 formData.imgSrc로 설정
        setFormData((prevData) => ({
          ...prevData,
          imgSrc: data.imageUrls[0] // 여기에서 첫 번째 이미지 URL을 사용하거나 적절한 방식으로 선택
        }));
        setUpload(true);
      } else {
        alert('이미지 업로드 실패.');
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="SignupBody">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="email"
            placeholder="이메일"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="비밀번호 확인"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div><input type="file" onChange={handleImageChange} accept="image/*" multiple /></div>
        <button type="button" onClick={handleUpload}>업로드</button>

        <button type="submit">회원가입</button>
      </form>
    </div>
  )
}

export default Signup;
