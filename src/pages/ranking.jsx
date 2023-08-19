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

          let totalPoints = 0
          const filteredList = list.filter(item => item.email === email);
          filteredList.forEach(item => {
            totalPoints += item.points;
          });
          await setPoint(totalPoints)
          await setName(email)
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    pointsRank()
  },[])
  return (<div>
    <div>{name}</div>
    <div>{point}</div>
  </div>)
}