import { Provider } from 'jotai';
import { SessionProvider, useSession } from 'next-auth/react';

function MyApp({ Component, pageProps }) {

  return (
    <SessionProvider>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
