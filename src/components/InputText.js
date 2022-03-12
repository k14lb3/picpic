import { forwardRef } from 'react';

const InputText = forwardRef(({ className, type = 'text', ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full px-2 py-1 bg-downy-100 border-solid border border-downy rounded-sm outline-none${
        className ? ` ${className}` : ''
      }`}
      type={type}
      {...props}
    />
  );
});

export default InputText;
