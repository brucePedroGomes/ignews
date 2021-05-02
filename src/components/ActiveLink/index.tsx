import { useRouter } from 'next/dist/client/router';
import Link, { LinkProps } from 'next/link';
import { ReactElement, cloneElement } from 'react';

type Props = LinkProps & {
  children: ReactElement;
  activeClassName?: string;
};

export const ActiveLink = ({
  children,
  activeClassName,
  ...props
}: Props) => {
  const { asPath } = useRouter();

  const className =
    asPath === props.href ? activeClassName : '';

  return (
    <Link {...props}>
      {cloneElement(children, { className })}
    </Link>
  );
};
