import React from 'react';

type DivProps = {
  children: React.ReactNode;
  centered?: boolean;
  evenlySpaced?: boolean;
  width?: string;
  height?: string;
  className?: string;
};
const ColumnDiv = ({
  children,
  centered = false,
  evenlySpaced = false,
  className = '',
  ...props
}: DivProps) => (
  <>
    <div
      className={`flex flex-col mb-0 ${className}  ${
        evenlySpaced ? 'justify-around' : ''
      } ${centered ? 'justify-center' : ''}`}
      {...props}>
      {children}
    </div>
  </>
);
export default ColumnDiv;