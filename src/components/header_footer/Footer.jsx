import "./header_styles.css";

function Footer() {
  return (
    <footer className="footer">

      <div>
        <h3>NeighbourGig</h3>
        <p>Get in touch</p>
      </div>

      <div className="socials">
        <a
          href="https://www.facebook.com/share/1BV9DLXNsk/?mibextid=wwXIfr"
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook
        </a>

        <span>Instagram</span>

        <span>LinkedIn</span>

        <a
          href="https://whatsapp.com/channel/0029VbD0QWUInlqUxqkXw22q"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
      </div>

    </footer>
  );
}

export default Footer;