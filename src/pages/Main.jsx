import Image from 'next/image';
import Fetch from "../app/components/page";
import axios from "axios";
import Link from "next/link";
import Detail from "./Detail"
import { loggedId } from '../app/atoms';
import {useState} from "react"
import {useAtom, useAtomValue} from "jotai"
import { useEffect } from 'react';
import {useRouter} from "next/navigation"

export default function Main() {
  const [id, setId] = useAtom(loggedId);
  const router = useRouter()

  useEffect(()=>{
    console.log(id, "입니다")
  },[id])

  return (
    <>
      <h2>Welcome</h2>
      <Fetch />
    </>
  );
}