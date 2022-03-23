import Header from '@components/Header';
import Footer from '@components/Footer';

const NotFound = () => {
  return (
    <>
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
