import Head from 'next/head';
import Header from 'components/Header';
import Modal from 'components/Modal';

const Home = () => {
  return (
    <div className="bg-downy-100 h-screen">
      <Head>
        <title>Picpic</title>
        <meta
          name="Picpic"
          content="Image sharing and social media platform."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Modal />
    </div>
  );
};

export default Home;
