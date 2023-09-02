import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai';
import { loggedInAtom, loginByEmail, loggedinViaEmail, loggedId } from '@/app/atoms';
import { useRouter } from 'next/router';
import { signIn, signOut, getSession, useSession} from 'next-auth/react';
import "./Login.css"

export default function LoginByEmail() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [login, setLogin] = useState(false);
  const [logged, setLogged] = useAtom(loggedInAtom);
  const [byEmail, setByEmail] = useAtom(loginByEmail);
  const [emailLogin, setEmailLogin] = useAtom(loggedinViaEmail);
  const router = useRouter();
  const [google, setGoogle] = useAtom(loggedId)
  const session = useSession()
  const [loginClicked, setLoginClicked] = useState(false)

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`/api/emailLogin`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (res.ok) {
        const list = await res.json();
        const loginList = list.some(item => (item.email === data.userEmail && item.password === data.password));
        setLogin(loginList);
        setLogged(true);
        setByEmail(list.find(item => item.email === data.userEmail)?.email || ''); 
        setEmailLogin(true);
        router.push("/Top"); 
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogout = () => {
    setLogin(false);
    setLogged(false);
    setEmailLogin(false);
    router.push("/"); 
  }

  const handleSignIn = async () => {
    try {
      setLoginClicked(true);
      await signIn("google");
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };
  useEffect(() => {
    async function fetchData() {
      if (session.data) {
        const userEmail = session.data.user.email;
        setGoogle(userEmail);
        setLogged(true);
      }
    }
  
    fetchData();
  }, [session.data]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  return (
    <div className="LoginBody">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input type="text" placeholder="email입력" {...register("userEmail", { required: true })} />
          {errors.userEmail && <p>Email is required</p>}
        </div>
        <div>
          <input type="password" placeholder="비밀번호입력" {...register("password", { required: true })} />
          {errors.password && <p>Password is required</p>}
        </div>
        <button type="submit" style={{backgroundColor: "yellow", borderRadius: "15px"}}>로그인</button>
      </form>
      {emailLogin && (
        <button onClick={handleLogout}>로그아웃</button>
      )}
      {google ? (
        <>
          <p className="status">로그인 됨</p>
          <button className="logout-btn" onClick={handleSignOut}>로그아웃</button>
        </>
      ) : (
        <div><button style={{width: "140px", height: "45px", borderRadius: "15px"}} className="login-btn" onClick={handleSignIn}>구글 로그인</button></div>
      )}
    </div>
  );
}

