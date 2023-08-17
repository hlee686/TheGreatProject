import {useEffect, useState} from "react"
import { useRouter } from "next/router"
import { loggedInAtom } from "@/app/atoms"
import {useAtom} from "jotai"

export default function LoginByEmail(){
  const [userEmail, setUserEmail] = useState('')
  const [password, setPassword] = useState('')
  const [login, setLogin] = useState(false)
  const [logged, setLogged] = useAtom(loggedInAtom)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/emailLogin`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (res.ok) {
        const list = await res.json();
        const loginList = await list.some(item=>(item.email==userEmail && item.password==password))
        setLogin(loginList)
        setLogged(true)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    if (login && userEmail && password) {
      router.push("/Main");
    }
  }, [login, userEmail, password]);

  return (
    <div> 
      <form onSubmit={handleSubmit}>
    <div><input type="text" placeholder="email입력" onChange={e=>setUserEmail(e.target.value)}></input></div>
    <div><input type="password" placeholder="비밀번호입력" onChange={e=>setPassword(e.target.value)}></input></div>
    <button type="submit">로그인</button>
  </form>
  </div>
  )
}