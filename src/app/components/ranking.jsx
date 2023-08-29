import { useState, useEffect } from "react"
import { useAtom, useAtomValue } from "jotai"
import { loginByEmail, myPoint, loggedId } from "@/app/atoms"

export default function Ranking(){
  const [name, setName] = useAtom(loginByEmail)
  const [point, setPoint] = useAtom(myPoint)
  const [email, setEmail] = useAtom(loggedId)

useEffect(()=>{
  async function formData() {
    try {
      const res = await fetch(`/api/myEmailList`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (res.ok) {
        const list = await res.json();
        const filtered = await list.filter(item=>item.emailLogin==name)
        const filteredTwo = await list.filter(item=>item.email==name)
        await setName(filtered[0].emailLogin)
        await setEmail(filteredTwo[0].email)
        const totalPoints = filtered.reduce((total, item) => total + item.points, 0);
        localStorage.setItem("total", totalPoints)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  formData()
},[name])

useEffect(()=>{
  async function total(){
    await setPoint(localStorage.getItem("total"))
  }
  total()
},[])

  return (<div>
    <div>나의 이름: {name || email}</div>
    <div>나의 포인트: {point}</div>
  </div>)
}