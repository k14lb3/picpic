import Link from 'next/link';
import Image from 'next/image';
import SearchBar from 'components/SearchBar';
import NavigationButton from 'components/NavigationButton';
import { HomeIcon, ChatIcon, BellIcon } from '@heroicons/react/outline';

const Header = () => {
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
        <nav className="flex items-center">
          <NavigationButton href="/" icon={<HomeIcon />} />
          <NavigationButton icon={<ChatIcon />} />
          <NavigationButton icon={<BellIcon />} />
          <div className="group relative flex w-11 h-11 p-2 rounded-full overflow-hidden cursor-pointer ease-in duration-200 hover:scale-90">
            <div className="absolute w-9 h-9 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-solid border-2 border-downy opacity-0 ease-in duration-200 group-hover:opacity-100" />
            <img
              className="w-7 h-7 rounded-full ease-in duration-200"
              src="/doge.jpg"
              alt=""
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
