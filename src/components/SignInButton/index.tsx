import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import styles from './styles.module.scss';

export const SignInButton = () => {
  const isUserLogged = true;

  return (
    <button type="button" className={styles.signInButton}>
      <FaGithub color={isUserLogged ? '#04d361' : '#eba417'} />
      {isUserLogged ? 'Pedro Leinar' : 'Sing in with GitHub'}
      {isUserLogged && <FiX color="#737380" className={styles.closeIcon} />}
    </button>
  );
};
