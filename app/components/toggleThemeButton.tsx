'use client';

import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from '../context/global.context';
import styles from '../style/component/toggleThemeButton.module.scss';

const ToggleThemeButton = () => {
  const { theme, setTheme } = useGlobalState();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button className={styles['theme-toggle-button']} onClick={toggleTheme}>
      <FontAwesomeIcon icon={theme === 'light' ? faSun : faMoon} />
    </button>
  );
};

export default ToggleThemeButton;
