'use client'
import Image from 'next/image'
import Fetch from '@/app/components/page'
import axios from "axios"
import Main from "./Main"
import LoginBtn from '../app/components/LoginBtn'
import { Provider, useAtom } from 'jotai';
import { loggedId } from '@/app/atoms'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, useSession, SessionProvider } from 'next-auth/react';


export default function Home() {

  const [email, setEmail] = useAtom(loggedId)
  const router = useRouter()

  // useEffect(()=>{
  //   setEmail("FUNNIEST MOVIE EVER")
  // },[])

  const route = () => {
    router.push("/Main")
  }

  return (
    <div>
      <button onClick={route}>MAIN</button>
      <LoginBtn />
    </div>
  )
}
