import Image from "next/image";
import { ArrowUpRight, Check, Droplets, Flame, Wrench } from "lucide-react";

export function Demo() {
  return (
    <div className="installer-demo">
      <div className="demo-brand">
        <span className="demo-logo"><Droplets size={18} /> <strong>nord</strong>instal.</span>
        <span className="demo-nav">Servicii · Despre noi</span>
      </div>
      <div className="demo-content">
        <Image src="/images/instalatii-exemplu/baie.webp" alt="Baie modernă — exemplu de site Nord Instal" fill sizes="(max-width: 760px) 300px, 520px" />
        <div className="demo-hero-copy">
          <small>INSTALAȚII SANITARE & TERMICE</small>
          <h2>O casă în care<br />totul merge.<br /><em>Așa cum trebuie.</em></h2>
          <p>De la prima țeavă la ultimul detaliu.<br />Instalații bine făcute, pentru liniștea de acasă.</p>
          <span className="demo-call">Spune-ne ce ai nevoie <ArrowUpRight size={14} /></span>
          <p className="demo-location">București & Ilfov · Pentru case și afaceri</p>
        </div>
      </div>
      <div className="demo-assurance"><Check size={12} /> Deviz clar <Check size={12} /> Lucrăm îngrijit</div>
      <div className="demo-services">
        <small>CU CE TE AJUTĂM</small>
        <h3>Tu te bucuri de casă.<br />Noi avem grijă de instalații.</h3>
        <div className="demo-service-list">
          <span><Droplets size={17} /> Sanitare</span>
          <span><Flame size={17} /> Termice</span>
          <span><Wrench size={17} /> Reparații</span>
        </div>
      </div>
    </div>
  );
}
