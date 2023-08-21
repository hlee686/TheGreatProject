import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { loggedInAtom, loginByEmail, loggedinViaEmail, loggedId } from '../app/atoms';
import { useAtomValue } from 'jotai';
import Fetch from '@/app/components/page';
import Ranking from '../app/components/ranking';
import { useEffect, useState } from 'react';

export default function Main() {
  const router = useRouter();
  const [emailLogin, setEmailLogin] = useAtom(loggedinViaEmail);
  const [loginEmail, setLoginEmail] = useAtom(loginByEmail);
  const logged = useAtomValue(loggedInAtom);
  const email = useAtomValue(loggedId);
  const [prio, setPrio] = useState([])

useEffect(() => {
  async function rank() {
    try {
      const res = await fetch(`/api/ranking`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (res.ok) {
        const list = await res.json();

        const filteredList = list.filter(item => item.email !== null || item.emailLogin !== null);

        const emailPointsMap = {};

        filteredList.forEach(item => {
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
          .filter(email => email !== "undefined") 
          .map(email => ({
            email,
            points: emailPointsMap[email],
          }));


        totalList.sort((a, b) => b.points - a.points);
        setPrio(totalList)

        console.log(totalList);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  rank();
}, []);

  
  return (
    <>
    {prio.map((item, idx)=><p key={idx}>{item.email || item.emailLogin} / {item.points}</p>)}
    <Ranking />
      {emailLogin ? (
        <div>
          <p>로그인 상태 {loginEmail && <span>{email}</span>}</p>
          <button onClick={() => signOut()}>로그아웃</button>
        </div>
      ) : (
        <div>
          <p>로그아웃 상태</p>
          <button onClick={() => router.push("/")}>로그인</button>
        </div>
      )}
      {emailLogin && <p>{loginEmail}님, 안녕하세요!</p>}
      <Fetch />
    </>
  );
}
