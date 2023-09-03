import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { loggedInAtom, loginByEmail, loggedinViaEmail, loggedId, myPoint, tPoints, imgSrc } from '../app/atoms';
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

  const [imgSource, setImgSource] = useAtom(imgSrc)
  const [imageData, setImageData] = useState([]);
  const [view, setView] = useState(false)
  const [rank, setRank] = useState([])
  const [rankNum, setRankNum] = useState(0)

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
  
          setImageData(uniquePrio);
  
          const loggedInUserPoint = loginEmail ? totalList.find(item => item.email === loginEmail)?.points : 0;
          const userEmailPoint = email ? totalList.find(item => item.email === email)?.points : 0;
  
          // NaN이면 0으로 설정합니다.
          setPoint(loggedInUserPoint || 0);
          setPointVal(userEmailPoint || 0);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    rank();
  }, [imageData]); // prio 변수를 의존성 배열에 추가
  

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

  useEffect(() => {
    const userEmailAddress = loginEmail || email;
    const userRank = imageData.findIndex(item => (item.email || item.emailLogin) === userEmailAddress);
    const userRankDisplay = userRank >= 0 ? userRank + 1 : '등수 없음';
    setRankNum(userRankDisplay);
  }, [imageData, loginEmail, email]);
  
  const logOut = () => {
    signOut();
    localStorage.removeItem("id");
    localStorage.removeItem("email")
    setEmailLogin(false); 
    setEmail(''); 
  }

  useEffect(() => {
    const userImg = async () => {
      const res = await fetch(`api/userInfo`, {
        method: "GET"
      });
      if (res.ok) {
        const json = await res.json();
        setRank(json)
  
        // 모든 이미지 정보 추출
        const allImages = json.map((item, idx) => ({
          email: item.email || item.emailLogin,
          imgSrc: item.imgSrc 
        }));
        await setImageData(allImages);
        setView(!view)
      }
    };
    userImg();
  }, []);

  function getImgSrcForEmail(email) {
    const matchingItem = rank.find(item => (item.email || item.emailLogin) === email);
    return matchingItem ? matchingItem.imgSrc : ''; 
  }


  return (
    <div style={{textAlign: "center", margin:"50px", justifyContent: "center"}}>

<div style={{backgroundColor: "yellow", borderRadius: "10px", marginLeft: "550px", width: "500px", height: "30px", border: "1px solid black"}}>{point ? point+20 : pointVal +20}점 획득! {loginEmail || email} 님은 현재
       {rankNum} 
       등 입니다. 랭킹에 도전해보세요!</div>

<div style={{ display: "flex", flexDirection: "row" , justifyContent: "center"}}>
  {imageData.map((item, idx) => (
    (item.email || item.emailLogin) && (
      <div key={idx} style={{ marginLeft: "10px" }}>
        {/* {idx + 1}위: {(item.email || item.emailLogin)}님 /{" "}
        {item.points + 20}점 */}
        <img
          src={getImgSrcForEmail(item.email || item.emailLogin)}
          style={{ width: "120px", height: "120px", marginRight: "100px", border: "1px solid black", borderRadius: "50px" }}
        />
        <div>
        {idx+1}위
        {(item.email || item.emailLogin)}님
        {item.points + 20}점
        </div>
      </div>
    )
  ))}
</div>

      {/* {loginEmail && setPoint(prio.filter(item=>item.email==loginEmail)[0]?.points)}
      {email && setPoint(prio.filter(item=>item.email==email)[0]?.points)} */}

      {(loginEmail || email) ? (
        <div>
          <button onClick={() => logOut()}>로그아웃</button>
        </div>
      ) : (
        <div>
          <p>로그아웃 상태</p>
          <button onClick={() => router.push("/")}>로그인</button>
        </div>
      )}
      
      <Fetch />
    </div>
  );
}
