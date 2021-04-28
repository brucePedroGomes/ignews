import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import styles from './styles.module.scss';
import { signIn, useSession, signOut } from 'next-auth/client';

export const SignInButton = () => {
  const [session] = useSession();

  return (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => (session ? signOut() : signIn())}
    >
      <FaGithub color={session ? '#04d361' : '#eba417'} />
      {session ? session.user.name : 'Sing in with GitHub'}
      {session && <FiX color="#737380" className={styles.closeIcon} />}
    </button>
  );
};
