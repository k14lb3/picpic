import Head from 'next/head';
import Header from 'components/Header';

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
    </div>
  );
};

export default Home;
