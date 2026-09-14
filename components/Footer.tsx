import Link from "next/link";
import Image from "next/image";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-top">
          <div>
            <Link className="wordmark" href="/">
              <span className="brand-logo-shell">
                <Image
                  className="brand-logo"
                  src="/logo.png"
                  alt="WebForm"
                  width={1137}
                  height={314}
                />
              </span>
            </Link>
            <p>
              Site-ul tău, fără bătăi de cap.
              <br />
              Construit și îngrijit în România.
            </p>
          </div>
          <div>
            <h3>DESCOPERĂ</h3>
            <Link href="/#how-it-works">Cum funcționează</Link>
            <Link href="/templates">Modele de site</Link>
            <Link href="/#plans">Prețuri</Link>
            <Link href="/faq">Întrebări frecvente</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/account">Contul meu</Link>
          </div>
          <div>
            <h3>INFORMAȚII UTILE</h3>
            <Link href="/legal/terms">Termeni și condiții</Link>
            <Link href="/legal/privacy">Confidențialitate</Link>
            <Link href="/legal/delivery">Politica de livrare</Link>
            <Link href="/legal/cancellation">Politica de anulare</Link>
            <a
              href="https://anpc.ro/ce-spune-legea/sal/"
              target="_blank"
              rel="noopener noreferrer"
            >
              ANPC · SAL
            </a>
          </div>
          <div>
            <h3>HAI SĂ VORBIM</h3>
            <a href="mailto:alexionescu870@gmail.com">
              alexionescu870@gmail.com
            </a>
            <a href="tel:+40764902801">+40 764 902 801</a>
            <p>
              IONESCU ALEXANDRU-MARIO PFA
              <br />
              CUI: 52801591 · F2025043137007
              <br />
              Bd. Bucureștii Noi 136, parter, ap. 5<br />
              Sector 1, București, România
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} WebForm. Toate drepturile rezervate.
          </span>
          <span>Plăți securizate prin NETOPIA Payments</span>
        </div>
      </div>
    </footer>
  );
}
