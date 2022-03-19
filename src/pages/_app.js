import Head from 'next/head';
import { RecoilRoot } from 'recoil';
import 'globals.css';

const MyApp = ({ Component, pageProps }) => {
  return (
    <RecoilRoot>
      <Head>
        <title>Picpic</title>
      </Head>
      <Component {...pageProps} />
    </RecoilRoot>
  );
};

export default MyApp;
