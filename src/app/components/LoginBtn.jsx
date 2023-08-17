'use client'
import { signIn, signOut, getSession, useSession} from 'next-auth/react';
import { useAtom } from 'jotai';
import { loggedInAtom, loggedId } from "../atoms"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {useEffect, useState} from "react"
import "./LoginLayout.css"
import Signup from './LoginByEmail';

export default function LoginBtn() {

  const [logged, setLogged] = useAtom(loggedInAtom)
  const [email, setEmail] = useAtom(loggedId)
  const [loginClicked, setLoginClicked] = useState(false)
  const router = useRouter();
  const session = useSession()
  const [userEmail, setUserEmail] = useState('')
  const [password, setPassword] = useState('')

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
      console.log(email, "이메일")
      setLogged(true)
    }
  }, [session.data]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   try {
  //     const res = await fetch(`/api/emailLogin`, {
  //       method: "GET",
  //       headers: {
  //         'Content-Type': 'application/json',
  //       }
  //     });
  //     if (res.ok) {
  //       const list = await res.json();
  //       const loginList = await list.some(item=>(item.email==userEmail && item.password==password))
  //       console.log("로그인은여기", loginList)
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  return (
    <div className="login-container">
      {logged ? (
        <>
          <p className="status">로그인 됨</p>
          <button className="logout-btn" onClick={handleSignOut}>로그아웃</button>
        </>
      ) : (
        <button className="login-btn" onClick={handleSignIn}>구글 로그인</button>
      )}
      {/* <form onSubmit={handleSubmit}>
        <div><input type="text" placeholder="email입력" onChange={e=>setUserEmail(e.target.value)}></input></div>
        <div><input type="password" placeholder="비밀번호입력" onChange={e=>setPassword(e.target.value)}></input></div>
        <button type="submit">로그인</button>
      </form> */}
      <button onClick={()=>router.push("/LoginByEmail")}>이메일 로그인</button>
    </div>
  );
}