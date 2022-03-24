import Head from 'next/head';
import { RecoilRoot } from 'recoil';
import Root from '@components/Root';
import 'globals.css';

const MyApp = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Picpic</title>
      </Head>
      <RecoilRoot>
        <Root>
          <Component {...pageProps} />
        </Root>
      </RecoilRoot>
    </>
  );
};

export default MyApp;
