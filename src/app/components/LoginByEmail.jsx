import {useState} from "react"

export default function LoginByEmail(){
  const [userEmail, setUserEmail] = useState('')
  const [password, setPassword] = useState('')
  const [login, setLogin] = useState(false)

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
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  return (
    <div> 
      <form onSubmit={handleSubmit}>
    <div><input type="text" placeholder="email입력" onChange={e=>setUserEmail(e.target.value)}></input></div>
    <div><input type="password" placeholder="비밀번호입력" onChange={e=>setPassword(e.target.value)}></input></div>
    <button type="submit">로그인</button>
  </form>
  {login && <p>로그인됨</p>}
  </div>
  )
}