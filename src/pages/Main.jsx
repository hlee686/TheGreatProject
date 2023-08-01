import Image from 'next/image';
import Fetch from "../app/Fetch/page";
import axios from "axios";
import Link from "next/link";
import Detail from "./Detail"
import { loggedIn } from '@/app/atoms';
import {useState} from "react"
import {useAtom, useAtomValue} from "jotai"
import { loggedInAtom } from '@/app/atoms';

export default function Main() {
  const logged = useAtomValue(loggedInAtom);

  return (
    <>
      <h2>Welcome</h2>
      <Fetch />
    </>
  );
}