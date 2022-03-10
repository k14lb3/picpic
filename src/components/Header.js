import Link from 'next/link';
import Image from 'next/image';
import SearchBar from 'components/SearchBar';
import Button from 'components/Button';
import Navigation from './Navigation';

const Header = () => {
  const user = false;

  return (
    <header className="sticky w-full h-16 bg-white shadow-sm x-50">
      <div className="flex justify-between items-center max-w-4xl h-full m-auto px-5">
        <div className="hidden relative w-full max-w-[57px] h-full max-h-[30px] md:block">
          <Link href="/">
            <a>
              <Image
                src="/logo-word.png"
                alt="logo"
                layout="fill"
                objectFit="contain"
              />
            </a>
          </Link>
        </div>
        <div className="flex-shrink-0 relative w-8 h-8 md:hidden">
          <Link href="/">
            <a>
              <Image
                src="/logo.png"
                alt="logo"
                layout="fill"
                objectFit="contain"
              />
            </a>
          </Link>
        </div>
        <SearchBar />
        {user ? (
          <Navigation />
        ) : (
          <div>
            <Button className="mr-3">Log In</Button>
            <Button outlined>Sign Up</Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
