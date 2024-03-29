import { FC, useState, useRef } from 'react';
import { SearchIcon } from '@heroicons/react/outline';
import { XCircleIcon } from '@heroicons/react/solid';

interface Props {
  className?: string;
}

export const SearchBar: FC<Props> = ({ className }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [focus, setFocus] = useState(false);

  return (
    <div
      className={`flex items-center w-full max-w-xs h-full max-h-9 bg-downy-100 px-2 rounded-sm${
        className ? ` ${className}` : ''
      }`}
    >
      {!focus && (
        <SearchIcon
          className="flex-shrink-0 h-5 w-5 mr-2 text-downy cursor-text"
          onClick={() => inputRef.current!.focus()}
        />
      )}
      <input
        ref={inputRef}
        className="w-full bg-downy-100 placeholder-downy-500 outline-none"
        type="text"
        placeholder="Search"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
      {focus && (
        <XCircleIcon
          className="flex-shrink-0 h-5 w-5 ml-2 text-downy cursor-pointer"
          onMouseDown={() => {
            inputRef.current!.value = '';
          }}
        />
      )}
    </div>
  );
};
