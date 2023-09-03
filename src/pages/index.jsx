'use client'
import Image from 'next/image'
import Fetch from '@/app/components/page'
import axios from "axios"
import Main from "./Main"
import LoginBtn from './LoginBtn'
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
    <>
    <div className="page-container">
    <h1 style={{lineHeight: "0.5em"}}>허니비와 함께</h1>
    <h1 style={{lineHeight: "0.5em"}}>재미있는 영어</h1>
    <br /><br /><br />

    {/* {tutorialConfig && <button className="main-btn" onClick={route}>MAIN</button>} */}
    {/* {loggedIn && <button className="top-thirty-btn" onClick={topThirty}>TUTORIAL</button>} */}
    <button style={{width: "140px", height: "45px", borderRadius: "15px"}} onClick={signUp}>가입하기</button>
    <br />
    <LoginBtn />
  </div>
  </>
);
  }
