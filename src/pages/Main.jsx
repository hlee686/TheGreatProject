import Image from 'next/image';
import Fetch from "../app/components/page";
import axios from "axios";
import Link from "next/link";
import Detail from "./Detail"
import { loggedId, loggedInAtom , loginByEmail, loggedinViaEmail} from '../app/atoms';
import {useState} from "react"
import {useAtom, useAtomValue} from "jotai"
import { useEffect } from 'react';
import {useRouter} from "next/navigation"
import { signIn, signOut, getSession, useSession} from 'next-auth/react';

export default function Main() {
  const router = useRouter()
  const [logged, setLogged] = useAtom(loggedInAtom)
  const [email, setEmail] = useAtom(loggedId)
  const [loginEmail, setLoginEmail] = useAtom(loginByEmail)
  const [loggedinByEmail, setLoggedinByEmail] = useAtom(loggedinViaEmail)

  
  return (
    <>

      {!logged ? <div><p>로그인 상태 {email}</p> <button onClick={()=>signOut()}>로그아웃</button></div> : <div><p>로그아웃 상태</p><button onClick={()=>router.push("/")}>로그인</button></div>}
      {loggedinByEmail && <p>{loginEmail}</p>}
      <Fetch />
    </>
  );
}