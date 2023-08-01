'use client'
import Image from 'next/image'
import Fetch from "./Fetch/page"
import axios from "axios"
import Main from "../pages/Main"
import LoginBtn from './Fetch/LoginBtn'

export default function Home() {

  return (
    <div>
      Hello Start
      <LoginBtn />
    </div>
  )
}
