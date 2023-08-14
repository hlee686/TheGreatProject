'use client'
import Image from 'next/image'
import Fetch from '@/app/components/page'
import axios from "axios"
import Main from "./Main"
import LoginBtn from '../app/components/LoginBtn'
import { Provider, useAtom } from 'jotai';
import { loggedId, loggedInAtom, tutorial } from '@/app/atoms'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, useSession, SessionProvider } from 'next-auth/react';
import {Top} from "./Top"
import "./mainPage.css"


export default function Home() {

  const [email, setEmail] = useAtom(loggedId);
  const [tutorialConfig, setTutorialConfig] = useAtom(tutorial)
  const router = useRouter()

  const route = () => {
    router.push("/Main")
  }
  
  const topThirty = () => {
    router.push("/Top")
  }

  return (
    <div className="page-container">
    <button className="main-btn" onClick={route}>MAIN</button>
    <LoginBtn />
    {tutorialConfig && <button className="top-thirty-btn" onClick={topThirty}>TOP 30</button>}
  </div>
);
  }
