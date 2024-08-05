// components/Navbar.tsx
import Link from 'next/link';
import styles from '../style/component/navbar.module.scss';
import ToggleThemeButton from './toggleThemeButton';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        Logo
      </Link>
      <ul className={styles.navLinks}>
        <li><ToggleThemeButton /></li>
        <li>
          <Link href="/">
            Home
          </Link>
        </li>
        <li>
          <Link href="/about">
            About
          </Link>
        </li>
        <li>
          <Link href="/contact">
            Contact
          </Link>
        </li>
        <li className={`${styles.navLinks} ${styles.launch}`}>
          <Link href="/app">
            Launch App
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
