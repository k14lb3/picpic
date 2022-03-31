import { FC, ReactNode, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Modal } from '@/components/modal';

interface Props {
  className?: string;
  addClassName?: string;
}

const Layout: FC<Props> = ({ className, addClassName, children }) => {
  return (
    <>
      <Header />
      <main className={`${className}${addClassName ? ` ${addClassName}` : ''}`}>
        {children}
      </main>
      <Footer />
      <Modal />
    </>
  );
};

Layout.defaultProps = {
  className: 'w-full pt-[5.25rem] px-5',
};

export default Layout;
