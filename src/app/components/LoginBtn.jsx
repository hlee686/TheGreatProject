import React, { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useAtom } from 'jotai';
import { loggedInAtom, loggedId } from "../atoms"
import { useRouter } from 'next/navigation';
import "./LoginLayout.css"

export default function LoginBtn() {
  const [logged, setLogged] = useAtom(loggedInAtom);
  const [email, setEmail] = useAtom(loggedId);
  const [loginClicked, setLoginClicked] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();
  const session = useSession();

  const handleSignIn = async () => {
    try {
      setLoginClicked(true);
      await signIn("google");
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  useEffect(() => {
    if (session.data) {
      setEmail(session.data.user.email); 
      setLogged(true);
    }
  }, [session.data]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const pureLogin = async () => {
    try {
      const response = await fetch(`/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("리스트", responseData);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    pureLogin(); 
  };

  return (
    <div className="login-container">
      {logged ? (
        <>
          <p className="status">로그인 됨</p>
          <button className="logout-btn" onClick={handleSignOut}>LogOut</button>
        </>
      ) : (
        <>
          <button className="login-btn" onClick={handleSignIn}>구글로그인</button>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="email"
              placeholder="이메일"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Login</button>
          </form>
        </>
      )}
    </div>
  );
}

