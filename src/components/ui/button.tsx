import { FC, HTMLAttributes } from 'react';
import { Loader } from '@/components/ui';

const variant = {
  default:
    'bg-downy-600 border-downy-600 text-white hover:bg-downy-650 hover:border-downy-550 disabled:bg-downy-400 disabled:border-downy-400 ',
  outlined: 'border-downy text-downy',
};

interface Props {
  label?: string;
  outlined?: boolean;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Button: FC<Props & HTMLAttributes<HTMLButtonElement>> = ({
  label,
  outlined,
  loading,
  disabled,
  className,
  ...rest
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`relative px-3 py-1 border-solid border rounded-sm font-medium tracking-wide ease-in duration-200 outline-none select-none ${
        outlined ? variant.outlined : variant.default
      }${className ? ` ${className}` : ''}`}
      {...rest}
    >
      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
          <Loader />
        </div>
      )}
      <span className={`whitespace-nowrap${loading ? ' invisible' : ''}`}>
        {label}
      </span>
    </button>
  );
};

Button.defaultProps = {
  label: 'Button',
};
