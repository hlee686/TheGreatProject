import { useState, useEffect } from "react"
import { useAtom } from "jotai"
import { loggedId } from "@/app/atoms"

export default function Ranking(){
  const [name, setName] = useAtom(loggedId)
  const [point, setPoint] = useState(0)

  useEffect(()=>{
    async function pointsRank(){
      try {
        const res = await fetch(`/api/myList`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (res.ok) {
          const list = await res.json();
          console.log('리스트', list)
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    pointsRank()
  },[])

  return (<div>
    <p onClick={()=>console.log("아이디는", loggedId)}>아이디</p>
    <div>{name}</div>
    <div>{point}</div>
  </div>)
}