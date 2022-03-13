import { useState, forwardRef } from 'react';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';

const InputText = forwardRef(({ className, type = 'text', ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex">
      <input
        ref={ref}
        className={`w-full px-2 py-1 bg-downy-100 border-solid border border-downy rounded-sm outline-none${
          type === 'password' ? ' pr-0 rounded-r-none border-r-0' : ''
        }${className ? ` ${className}` : ''}`}
        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
        {...props}
      />
      {type === 'password' && (
        <div
          className="w-9 p-2 text-downy border-solid border border-l-0 border-downy bg-downy-100"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeIcon /> : <EyeOffIcon />}
        </div>
      )}
    </div>
  );
});

export default InputText;
