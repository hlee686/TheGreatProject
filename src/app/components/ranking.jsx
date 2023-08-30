import { useState, useEffect } from "react"
import { useAtom, useAtomValue } from "jotai"
import { loginByEmail, myPoint, loggedId, loggedinViaEmail, loggedInAtom } from "@/app/atoms"

export default function Ranking(){
  const [name, setName] = useAtom(loginByEmail)
  const [points, setPoints] = useAtom(myPoint)
  const [email, setEmail] = useAtom(loggedId)
  const [logged, setLogged] = useAtom(loggedinViaEmail)
  const [google, setGoogle] = useAtom(loggedInAtom)

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
    await setPoints(localStorage.getItem("total"))
  }
  total()
},[])

  return (<div>
    <div>나의 포인트: {logged && points+20} {google && points+20}</div>
  </div>)
}