import Head from 'next/head';
import { RecoilRoot } from 'recoil';
import Auth from '@components/Auth';
import 'globals.css';

const MyApp = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Picpic</title>
      </Head>
      <RecoilRoot>
        <Auth>
          <Component {...pageProps} />
        </Auth>
      </RecoilRoot>
    </>
  );
};

export default MyApp;
