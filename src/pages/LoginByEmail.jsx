import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai';
import { loggedInAtom, loginByEmail, loggedinViaEmail } from '@/app/atoms';
import { useRouter } from 'next/router';

export default function LoginByEmail() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [login, setLogin] = useState(false);
  const [logged, setLogged] = useAtom(loggedInAtom);
  const [byEmail, setByEmail] = useAtom(loginByEmail);
  const [emailLogin, setEmailLogin] = useAtom(loggedinViaEmail);
  const router = useRouter();

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
        router.push("/Main"); 
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

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input type="text" placeholder="email입력" {...register("userEmail", { required: true })} />
          {errors.userEmail && <p>Email is required</p>}
        </div>
        <div>
          <input type="password" placeholder="비밀번호입력" {...register("password", { required: true })} />
          {errors.password && <p>Password is required</p>}
        </div>
        <button type="submit">로그인</button>
      </form>
      {emailLogin && (
        <button onClick={handleLogout}>로그아웃</button>
      )}
    </div>
  );
}

