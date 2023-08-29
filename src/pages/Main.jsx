import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAtom, useUpdateAtom, useAtomValue } from 'jotai'; // useUpdateAtom 추가
import { loggedInAtom, loginByEmail, loggedinViaEmail, loggedId, myPoint } from '../app/atoms';
import Fetch from '@/app/components/page';
import Ranking from '../app/components/ranking';

export default function Main() {
  const router = useRouter();
  const [emailLogin, setEmailLogin] = useAtom(loggedinViaEmail);
  const [loginEmail, setLoginEmail] = useAtom(loginByEmail);
  const [prio, setPrio] = useState([]);
  const [point, setPoint] = useAtom(myPoint)
  const email = useAtomValue(loggedId); // 값을 읽어오기 위해 useAtomValue 사용

  const [loggedState, setLoggedState] = useAtom(loggedInAtom)// 아톰 업데이트를 위한 함수

  const { data: session, status } = useSession();

  console.log(email)

  useEffect(() => {
    const savedEmailLogin = localStorage.getItem('id');
    if (savedEmailLogin) {
      setEmailLogin(savedEmailLogin);
    }
  }, [session]);

  useEffect(() => {
    async function rank() {
      try {
        const res = await fetch(`/api/ranking`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const list = await res.json();

         const filteredList = list.filter(
  (item) => (
    (item.email !== null && item.email !== "") || 
    (item.emailLogin !== null && item.emailLogin !== "")
  )
);
const uniqueEmails = Array.from(new Set(filteredList.map((item) => item.email || item.emailLogin)));

const emailPointsMap = {};

filteredList.forEach((item) => {
  const email = item.email || item.emailLogin;
  if (email !== null) {
    if (emailPointsMap[email]) {
      emailPointsMap[email] += item.points;
    } else {
      emailPointsMap[email] = item.points;
    }
  }
});

const totalList = uniqueEmails.map((email) => ({
  email,
  points: emailPointsMap[email] || 0, 
}));


totalList.sort((a, b) => b.points - a.points);


const uniquePrio = totalList.slice(0, 5);

setPrio(uniquePrio);

          console.log(totalList);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    rank();
  }, []);
 
  useEffect(() => {
    async function loginMain() {
      try {
        const res = await fetch(`/api/emailMain?loginEmail=${loginEmail}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const list = await res.json();
          localStorage.setItem("id", list[0].email);
          updateEmailAtom(list[0].email); // 아톰 업데이트
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    loginMain();
  }, []); 
  
  useEffect(()=>{
    setLoginEmail(localStorage.getItem("id"))
  },[])
  useEffect(() => {
    if (emailLogin) {
      localStorage.setItem('id', emailLogin);
    } else {
      localStorage.removeItem('id');
    }
  }, [emailLogin]);
  
  const logOut = () => {
    signOut()
    localStorage.removeItem("id")
    setLoggedState(false)
    //localStorage.removeItem("total")
    // setLoginEmail(localStorage.getItem("id"))
    // setPoint(localStorage.getItem("total"))
  }

  return (
    <>
      {prio.map((item, idx) => (
        (item.email || item.emailLogin) &&
        <p
          style={{
            backgroundColor: "lightgreen",
            color: "black",
            border: "1px solid black",
          }}
          key={idx}
        >
          {idx+1}위: {(item.email || item.emailLogin)}님 /{" "}
          {item.points}점
        </p>
      ))}
      <Ranking />
      {(loggedState || loginEmail) ? (
        <div>
          <p>
            로그인 상태 <span>{email}</span>
          </p>
          <button onClick={() => logOut()}>로그아웃</button>
        </div>
      ) : (
        <div>
          <p>로그아웃 상태</p>
          <button onClick={() => router.push("/")}>로그인</button>
        </div>
      )}
      <p>{email || emailLogin}님, 안녕하세요!</p>
      <Fetch />
    </>
  );
}
