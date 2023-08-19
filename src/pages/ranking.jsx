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

  console.log(loggedId)
  return (<div>
    <div>{name}</div>
    <div>{point}</div>
  </div>)
}