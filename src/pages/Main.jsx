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

          const emailPointsMap = {};

          filteredList.forEach((item) => {
            if (item.email !== null) {
              if (emailPointsMap[item.email]) {
                emailPointsMap[item.email] += item.points;
              } else {
                emailPointsMap[item.email] = item.points;
              }
            }

            if (item.emailLogin !== null) {
              if (emailPointsMap[item.emailLogin]) {
                emailPointsMap[item.emailLogin] += item.points;
              } else {
                emailPointsMap[item.emailLogin] = item.points;
              }
            }
          });

          const totalList = Object.keys(emailPointsMap)
            .filter((email) => email !== "undefined")
            .map((email) => ({
              email,
              points: emailPointsMap[email],
            }));

          totalList.sort((a, b) => b.points - a.points);
          setPrio(totalList.splice(0, 5));

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
      {emailLogin ? (
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