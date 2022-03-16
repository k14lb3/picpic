import { useState, forwardRef } from 'react';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';

const InputText = forwardRef(
  ({ className, type, placeholder, hasShowPassword, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className={`relative flex${className ? ` ${className}` : ''}`}>
        <input
          ref={ref}
          className={`peer w-full px-2 pt-4 pb-1 bg-downy-100 border-solid border border-downy-300 rounded-sm text-xs outline-none placeholder-transparent placeholder-shown:py-1.5 placeholder-shown:text-base focus:border-downy-600${
            type === 'password' && hasShowPassword
              ? ' pr-0 rounded-r-none border-r-0'
              : ''
          }`}
          placeholder={placeholder}
          type={
            type === 'password' && hasShowPassword
              ? showPassword
                ? 'text'
                : 'password'
              : type
          }
          {...props}
        />
        {placeholder && (
          <label className="absolute top-1 left-2 pl-[1px] pr-5 w-full text-xs text-gray-400 whitespace-nowrap overflow-hidden overflow-ellipsis ease-out duration-200 pointer-events-none peer-placeholder-shown:top-1/2 peer-placeholder-shown:transform peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-base">
            {placeholder}
          </label>
        )}
        {type === 'password' && hasShowPassword && (
          <div
            className="w-9 p-2 text-downy border-solid border border-l-0 border-downy bg-downy-100"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
          </div>
        )}
      </div>
    );
  }
);

InputText.defaultProps = {
  type: 'text',
};

export default InputText;
