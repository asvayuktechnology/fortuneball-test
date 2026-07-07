import React from 'react';

type Props = {
    children: React.ReactNode;
    className?: string;
};
const Grid = ({ className = '', children, ...props }: Props) => (
    <div className={`my-4 grid  grid-cols-12 justify-between p-4 ${className}`} {...props}>
        {children}
    </div>
);

export default Grid;