import Header from '@components/Header';
import Footer from '@components/Footer';

const Layout = ({ children, className }) => {
  return (
    <>
      <Header />
      <main className={className}>{children}</main>
      <Footer />
    </>
  );
};

Layout.defaultProps = {
  className: 'w-full pt-[5.25rem] px-5',
};

export default Layout;
