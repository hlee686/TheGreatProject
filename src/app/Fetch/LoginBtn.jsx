'use client'
import { signIn, signOut, getSession} from 'next-auth/react';
import { useAtom } from 'jotai';
import { loggedInAtom, loggedId } from "../atoms"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {useEffect, useState} from "react"

export default function LoginBtn() {

  const [logged, setLogged] = useAtom(loggedInAtom)
  const [id, setId] = useAtom(loggedId)
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const session = await getSession();
      if (session) {
        setLogged(true);
      }
    };
    fetchData();
  }, [logged]);


  return (
    <div>
      {logged && <p>로그인 됨</p>}
      <p onClick={handleSignOut}>LogOut</p>
      <p onClick={handleSignIn}>LogIn</p>
    </div>
  );
}
