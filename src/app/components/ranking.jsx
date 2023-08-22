import { useState, useEffect } from "react"
import { useAtom, useAtomValue } from "jotai"
import { loginByEmail } from "@/app/atoms"

export default function Ranking(){
  const name = useAtomValue(loginByEmail)
  const [point, setPoint] = useState(0)


  const myScore = async() => {
    try {
      const res = await fetch(`/api/myEmailList`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (res.ok) {
        const list = await res.json();
        console.log('리스트', list)
        const filtered = await list.filter(item=>item.emailLogin==name)
        console.log(filtered)
        const totalPoints = filtered.reduce((total, item) => total + item.points, 0);
        console.log('총 포인트:', totalPoints);
        setPoint(totalPoints)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  return (<div>
    <button onClick={myScore}>나의점수</button>
    <div>{name.split("@")[0]}</div>
    <div>{point}</div>
  </div>)
}