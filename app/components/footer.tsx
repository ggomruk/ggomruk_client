// components/Footer.tsx
import styles from '../style/component/footer.module.scss';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <p>&copy; {new Date().getFullYear()} Ggomruk</p>
        </footer>
    );
}

export default Footer;
