import { GoHeart } from "react-icons/go";
import { PiCoffee } from "react-icons/pi";

import "./styles.scss";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" style={{ textAlign: "center" }}>
      Développé avec
      <GoHeart className="icon" />
      et
      <PiCoffee className="icon" />
      par <a href="https://github.com/chloebatillet">Chloé Batillet </a>© {year}
    </footer>
  );
}

export default Footer;
