'use client'
import { signIn, signOut, getSession, useSession} from 'next-auth/react';
import { useAtom } from 'jotai';
import { loggedInAtom, loggedId } from "../atoms"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {useEffect, useState} from "react"

export default function LoginBtn() {

  const [logged, setLogged] = useAtom(loggedInAtom)
  const [email, setEmail] = useAtom(loggedId)
  const [loginClicked, setLoginClicked] = useState(false)
  const router = useRouter();
  const session = useSession()

  const handleSignIn = async () => {
    try {
      await setLoginClicked(true);
      await signIn("google");
      await setLogged(true)
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  useEffect(() => {
    if (session.data) {
      setEmail(session.data.user.email); 
    }
  }, [session.data]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };


  return (
    <div>

      {logged && <p>로그인 됨</p>}
      <p onClick={handleSignOut}>LogOut</p>
      <p onClick={handleSignIn}>LogIn</p>
    </div>
  );
}
