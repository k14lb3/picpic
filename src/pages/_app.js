import { RecoilRoot } from 'recoil';
import 'globals.css';
import Modal from '@components/Modal';

const MyApp = ({ Component, pageProps }) => {
  return (
    <RecoilRoot>
      <>
        <Component {...pageProps} />
        <Modal />
      </>
    </RecoilRoot>
  );
};

export default MyApp;
