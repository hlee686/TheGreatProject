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
    const userRankDisplay = userRank >= 0 ? userRank + 1 : '데뷔 전';
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
<h2 style={{marginLeft: "-500px"}}>이번주 랭킹</h2>
<div style={{ display: "flex", flexDirection: "row" , justifyContent: "center"}}>
  {imageData.slice(0,3).map((item, idx) => (
    (item.email || item.emailLogin) && (
      <div key={idx} style={{ marginLeft: "10px" }}>
        {/* {idx + 1}위: {(item.email || item.emailLogin)}님 /{" "}
        {item.points + 20}점 */}
        {idx+1}
        <img
          src={getImgSrcForEmail(item.email || item.emailLogin)}
          style={{ width: "120px", height: "120px", marginRight: "100px", border: "1px solid black", borderRadius: "50px" }}
        />
        <div>
          <br />
        <span style={{alignContent: "center", marginLeft: "-80px"}}>{(item.email || item.emailLogin)}</span>
        <div style={{marginLeft:"-80px"}}><img style={{width: "10px", height: "10px"}} src="data:image/png;base64,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"></img>{item.points + 20}p</div>
        </div>
      </div>
    )
  ))}
</div>

      {/* {loginEmail && setPoint(prio.filter(item=>item.email==loginEmail)[0]?.points)}
      {email && setPoint(prio.filter(item=>item.email==email)[0]?.points)} */}
      <br />
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
