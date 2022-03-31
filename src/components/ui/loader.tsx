import { FC } from 'react';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  bgColor?: string;
  className?: string;
}

export const Loader: FC<Props> = ({
  size,
  color,
  bgColor,
  className,
  ...rest
}) => {
  return (
    <div
      className={`flex justify-center ${
        size === 'sm'
          ? 'w-4 h-4 border-2'
          : size === 'md'
          ? 'w-6 h-6 border-4'
          : size === 'lg'
          ? 'w-12 h-12 border-8'
          : ''
      } border-solid border-${bgColor} border-t-${color} rounded-full animate-spin${
        className ? ` ${className}` : ''
      }`}
      {...rest}
    />
  );
};

Loader.defaultProps = {
  size: 'sm',
  color: 'downy',
  bgColor: 'downy-100',
};
