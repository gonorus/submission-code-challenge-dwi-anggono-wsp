import React from 'react';

export type BoxProps = React.HTMLAttributes<HTMLDivElement>;

export const PageLayout = ({ children, ...rest }: BoxProps) => {
  return <div {...rest}>{children}</div>;
};
