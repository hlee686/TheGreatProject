import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { loggedInAtom, loginByEmail, loggedinViaEmail, loggedId } from '../app/atoms';
import { useAtomValue } from 'jotai';
import Fetch from '@/app/components/page';

export default function Main() {
  const router = useRouter();
  const [emailLogin, setEmailLogin] = useAtom(loggedinViaEmail);
  const loginEmail = useAtomValue(loginByEmail);
  const logged = useAtomValue(loggedInAtom);
  const email = useAtomValue(loggedId);

  return (
    <>
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
