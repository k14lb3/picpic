import { NextPage } from 'next';
import Head from 'next/head';
import Header from '@/components/header';
import Footer from '@/components/footer';

const NotFound: NextPage = () => {
  return (
    <>
      <Head>
        <title>Page Not Found</title>
      </Head>
      <Header />
      <main className="w-full pt-[5.25rem] px-5">
        <h2 className="mb-4 text-2xl font-bold text-center">
          Sorry, this page isn&apos;t available
        </h2>
        <p className="text-center">
          The link you followed may be broken, or the page may have been
          removed.
        </p>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;
