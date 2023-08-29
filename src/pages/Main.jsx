import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { loggedInAtom, loginByEmail, loggedinViaEmail, loggedId, myPoint } from '../app/atoms';
import { useAtomValue } from 'jotai';
import Fetch from '@/app/components/page';
import Ranking from '../app/components/ranking';
import { useEffect, useState } from 'react';

export default function Main() {
  const router = useRouter();
  const [emailLogin, setEmailLogin] = useAtom(loggedinViaEmail);
  const [loginEmail, setLoginEmail] = useAtom(loginByEmail);
  const logged = useAtomValue(loggedInAtom);
  const [email, setEmail] = useAtom(loggedId);
  const [prio, setPrio] = useState([]);
  const [point, setPoint] = useAtom(myPoint)


  const { data: session, status } = useSession();

  const [initialEmail, setInitialEmail] = useState('');

  useEffect(() => {
    const savedEmailLogin = localStorage.getItem('id');
    if (savedEmailLogin) {
      setEmailLogin(savedEmailLogin);
      setInitialEmail(savedEmailLogin); 
    }
  }, [session]);

  useEffect(() => {
    if (loginEmail !== initialEmail) {
      if (loginEmail) {
        localStorage.setItem('id', loginEmail);
      } else {
        localStorage.removeItem('id');
      }
    }
  }, [loginEmail, initialEmail]);
  

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

// 각 이메일 주소의 합산 점수를 계산
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

// 이메일 주소와 합산 점수를 배열로 변환
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
          localStorage.setItem("id", list[0].email)
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    loginMain();
  }, [loginEmail]); 
  
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
    setEmailLogin(false)
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
          {idx + 1}위: {(item.email || item.emailLogin)}님 /{" "}
          {item.points}점
        </p>
      ))}
      <Ranking />
      {loginEmail ? (
        <div>
          <p>
            로그인 상태 <span>{loginEmail}</span>
          </p>
          <button onClick={() => logOut()}>로그아웃</button>
        </div>
      ) : (
        <div>
          <p>로그아웃 상태</p>
          <button onClick={() => router.push("/")}>로그인</button>
        </div>
      )}
      <p>{loginEmail}님, 안녕하세요!</p>
      
      <Fetch />
    </>
  );
}