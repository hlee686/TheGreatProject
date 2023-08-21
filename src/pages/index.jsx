'use client'
import Image from 'next/image'
import Fetch from '@/app/components/page'
import axios from "axios"
import Main from "./Main"
import LoginBtn from '../app/components/LoginBtn'
import { Provider, useAtom } from 'jotai';
import { loggedId, loggedInAtom, tutorial, tutorialNum } from '@/app/atoms'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, useSession, SessionProvider } from 'next-auth/react';
import {Top} from "./Top"
import "./mainPage.css"
import Signup from '@/pages/Signup'


export default function Home() {

  const [email, setEmail] = useAtom(loggedId);
  const [tutorialConfig, setTutorialConfig] = useAtom(tutorial)
  const [tutorialT, setTutorialT] = useAtom(tutorialNum)
  const [loggedIn, setLoggedIn] = useAtom(loggedInAtom)
  const router = useRouter()


  // const route = () => {
  //   router.push("/Main")
  // }
  
  const topThirty = () => {
    router.push("/Top")
  }

  const signUp = () => {
    router.push("/Signup")
  }


  return (
    <div className="page-container">

    {/* {tutorialConfig && <button className="main-btn" onClick={route}>MAIN</button>} */}
    <LoginBtn />
    {loggedIn && <button className="top-thirty-btn" onClick={topThirty}>TUTORIAL</button>}
    <button onClick={signUp}>Sign Up</button>
  </div>
);
  }
