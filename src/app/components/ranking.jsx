import { useState, useEffect } from "react"
import { useAtom, useAtomValue } from "jotai"
import { loginByEmail, myPoint } from "@/app/atoms"

export default function Ranking(){
  const [name, setName] = useAtom(loginByEmail)
  const [point, setPoint] = useAtom(myPoint)

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
        await setName(filtered[0].emailLogin)
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
    <div>나의 이름: {name}</div>
    <div>나의 포인트: {point}</div>
  </div>)
}