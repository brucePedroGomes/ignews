import styles from './styles.module.scss';

export const Home = () => {
  return (
    <main className={styles.contentContainer}>
      <section className={styles.hero}>
        <span>👏 Hey, welcome</span>
        <h1>
          News about the <span>React</span> world.
        </h1>
        <p>
          Get access to tall the publications <br />
          <span>for $9.90 month</span>
        </p>
      </section>
      <img src="/images/avatar.svg" alt="Girl coding" />
    </main>
  );
};
