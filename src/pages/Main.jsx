import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { loggedInAtom, loginByEmail, loggedinViaEmail, loggedId, myPoint, tPoints } from '../app/atoms';
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
  const [point, setPoint] = useAtom(myPoint);

  const { data: session, status } = useSession();

  const [initialEmail, setInitialEmail] = useState('');
  const [initialGoogle, setInitialGoogle] = useState('');

  const [pointVal, setPointVal] = useAtom(tPoints)

  useEffect(() => {
    const savedEmailLogin = localStorage.getItem('id');
    if (savedEmailLogin) {
      setEmailLogin(true); 
      setInitialEmail(savedEmailLogin);
    }
  }, []);

  useEffect(() => {
    const savedLogin = localStorage.getItem('email');
    if (savedLogin) {
      setEmail(true);
      setInitialGoogle(savedLogin); 
    }
  }, []);

  useEffect(() => {
    // 로그인 상태가 변경될 때 로컬 스토리지에 이메일을 설정
    if (loginEmail) {
      localStorage.setItem('id', loginEmail);
      setLoginEmail(loginEmail);
    } else if (email) {
      localStorage.setItem('email', email);
      setEmail(email);
    } else {
      const savedEmail = localStorage.getItem('email') || localStorage.getItem('id');
      if (savedEmail) {
        setEmail(savedEmail);
      } else {
        localStorage.removeItem('id');
      }
    }
  }, [loginEmail, email]);
  

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

          const uniquePrio = totalList;

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
          const userEmail = list[0].email;
          localStorage.setItem("id", userEmail);
          setLoginEmail(userEmail); 

        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    loginMain();
  }, [loginEmail]); 

  useEffect(() => {
    async function emailMain() {
      try {
        const res = await fetch(`/api/emailMain?loginEmail=${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const list = await res.json();
          const userEmail = list[0].email;
          localStorage.setItem("email", userEmail);
          setEmail(userEmail);  
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    emailMain();
  }, [email]); 
  
  const logOut = () => {
    signOut();
    localStorage.removeItem("id");
    localStorage.removeItem("email")
    setEmailLogin(false); 
    setEmail(''); 
  }


  return (
    <>
      {prio.slice(0,5).map((item, idx) => (
        (item.email || item.emailLogin) &&
        <><p
          style={{
            backgroundColor: "lightgreen",
            color: "black",
            border: "1px solid black",
          }}
          key={idx}
        >
          {idx + 1}위: {(item.email || item.emailLogin)}님 /{" "}
          {item.points+20}점
        </p></>
      ))}
      {loginEmail && setPoint(prio.filter(item=>item.email==loginEmail)[0]?.points)}
      {email && setPoint(prio.filter(item=>item.email==email)[0]?.points)}

      <div>나의 포인트: {point}</div>
      {(loginEmail || email) ? (
        <div>
          <p>
            로그인 상태 <span>{loginEmail || email}</span>
          </p>
          <button onClick={() => logOut()}>로그아웃</button>
        </div>
      ) : (
        <div>
          <p>로그아웃 상태</p>
          <button onClick={() => router.push("/")}>로그인</button>
        </div>
      )}
      <p>{loginEmail || email}님, 안녕하세요!</p>
      
      <Fetch />
    </>
  );
}
