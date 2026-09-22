import Image from "next/image";
import { ArrowDown, ArrowUpRight, Check, Droplets, Flame, MapPin, Phone, ShieldCheck, Wrench } from "lucide-react";
import "./exemplu.css";

const services = [
  { icon: Droplets, name: "Instalații sanitare", text: "De la o baterie care picură la o baie complet nouă. Montaj, reparații și înlocuiri făcute cu atenție.", tags: "Băi & bucătării · Alimentare cu apă" },
  { icon: Flame, name: "Confort termic", text: "Căldură exact acolo unde ai nevoie. Soluții de încălzire gândite pentru casa și ritmul tău.", tags: "Calorifere · Încălzire în pardoseală" },
  { icon: Wrench, name: "Reparații & intervenții", text: "Identificăm cauza, îți explicăm soluția și ne apucăm de treabă. Fără complicații inutile.", tags: "Pierderi de apă · Desfundări · Revizii" },
];
export default function Page() {
  return <main id="main" className="inst-example">
    <div className="ie-demo"><span>Un exemplu de site creat de <strong>WEBFORM</strong></span><a href="/instalatii#formular">Vreau un site ca acesta <ArrowUpRight size={14} /></a></div>
    <header className="ie-header ie-wrap">
      <a href="#" className="ie-logo" aria-label="Acasă — Nord Instal"><span className="ie-mark"><Droplets size={25}/></span>nord<span className="ie-logo-light">instal</span><span className="ie-logo-dot">.</span></a>
      <nav aria-label="Navigare exemplu"><a href="#servicii">Servicii</a><a href="#echipa">Despre noi</a><a href="#lucrari">Lucrări</a></nav>
      <a className="ie-header-contact" href="#contact"><Phone size={16}/> Hai să vorbim <ArrowUpRight size={17}/></a>
    </header>
    <section className="ie-hero">
      <Image src="/images/instalatii-exemplu/baie.webp" alt="Baie contemporană cu lavoar din piatră, baterie din alamă și mobilier din lemn" fill priority sizes="100vw" className="ie-hero-image"/>
      <div className="ie-hero-shade"/>
      <div className="ie-wrap ie-hero-inner">
        <p className="ie-label"><span/> INSTALAȚII SANITARE & TERMICE</p>
        <h1>O casă în care<br/>totul merge.<br/><em>Așa cum trebuie.</em></h1>
        <p className="ie-hero-copy">De la prima țeavă la ultimul detaliu.<br/>Instalații bine făcute, pentru liniștea de acasă.</p>
        <a className="ie-button" href="#contact">Spune-ne ce ai nevoie <ArrowUpRight size={20}/></a>
        <div className="ie-hero-location"><MapPin size={15}/> București & Ilfov <span/> Pentru case și afaceri</div>
      </div>
      <a href="#servicii" className="ie-scroll" aria-label="Descoperă serviciile"><ArrowDown size={21}/></a>
      <div className="ie-hero-note"><ShieldCheck size={25}/><span>Lucrăm atent.<br/><strong>Lăsăm totul în ordine.</strong></span></div>
    </section>
    <div className="ie-trust"><div className="ie-wrap">{["Soluții explicate pe înțelesul tău", "Deviz înainte de lucrare", "Atenție la fiecare detaliu"].map(t=><span key={t}><Check size={17}/>{t}</span>)}</div></div>
    <section id="servicii" className="ie-wrap ie-section">
      <div className="ie-section-heading"><div><p className="ie-kicker">01 / CU CE TE AJUTĂM</p><h2>Tu te bucuri de casă.<br/>Noi avem grijă de instalații.</h2></div><p>O reparație mică sau un proiect de la zero.<br/>Aceeași grijă pentru o treabă bine făcută.</p></div>
      <div className="ie-services">{services.map(({icon:Icon,name,text,tags},i)=><article key={name}><div className="ie-service-top"><Icon size={30} strokeWidth={1.5}/><span>0{i+1}</span></div><h3>{name}</h3><p>{text}</p><div className="ie-service-bottom"><small>{tags}</small><a href="#contact" aria-label={`Discută despre ${name}`}><ArrowUpRight size={21}/></a></div></article>)}</div>
    </section>
    <section id="echipa" className="ie-about ie-wrap">
      <div className="ie-about-photo"><Image src="/images/instalatii-exemplu/echipa.webp" alt="Instalator lucrând cu atenție la distribuitorul unui sistem de încălzire" fill sizes="(max-width: 760px) 100vw, 50vw"/><div className="ie-photo-caption"><span className="ie-caption-line"/> Meserie făcută cu grijă.</div></div>
      <div className="ie-about-copy"><p className="ie-kicker">02 / OAMENI PE CARE TE BAZEZI</p><h2>În casa ta,<br/>lucrăm ca într-a noastră.</h2><p>Știm că nu chemi un instalator în fiecare zi. De aceea, începem prin a asculta. Îți spunem ce trebuie făcut, ce presupune și cât costă.</p><p>Apoi ne ocupăm de fiecare detaliu. Protejăm spațiul, verificăm lucrarea și lăsăm curat în urma noastră.</p><ul><li><Check size={17}/> Comunicare clară, de la primul telefon</li><li><Check size={17}/> Materiale potrivite, alese împreună</li><li><Check size={17}/> Lucrare verificată înainte de predare</li></ul><a href="#contact" className="ie-text-link">Să ne cunoaștem <ArrowUpRight size={19}/></a></div>
    </section>
    <section id="lucrari" className="ie-wrap ie-section">
      <div className="ie-section-heading"><div><p className="ie-kicker">03 / ATENȚIA SE VEDE</p><h2>Detalii mici.<br/>Diferențe mari.</h2></div><p>De la instalațiile ascunse în perete<br/>până la finisajele pe care le vezi zilnic.</p></div>
      <div className="ie-projects"><article><div className="ie-project-image"><Image src="/images/instalatii-exemplu/baie.webp" alt="Exemplu vizual de amenajare pentru o baie modernă" fill sizes="(max-width: 760px) 100vw, 58vw"/></div><div className="ie-project-title"><div><small>INSTALAȚII SANITARE</small><h3>Confort, până la ultimul detaliu.</h3></div><ArrowUpRight size={25}/></div></article><article><div className="ie-project-image"><Image src="/images/instalatii-exemplu/echipa.webp" alt="Exemplu vizual de execuție a unei instalații termice" fill sizes="(max-width: 760px) 100vw, 40vw" className="ie-detail-image"/></div><div className="ie-project-title"><div><small>INSTALAȚII TERMICE</small><h3>Bine făcut, din interior.</h3></div><ArrowUpRight size={25}/></div></article></div>
    </section>
    <section className="ie-process"><div className="ie-wrap"><p className="ie-kicker">SIMPLU, DE LA ÎNCEPUT LA SFÂRȘIT</p><div className="ie-steps">{[["Ne spui ce ai nevoie", "Ne descrii problema sau proiectul. Stabilim împreună următorul pas."],["Găsim soluția potrivită", "Evaluăm lucrarea și îți prezentăm un deviz clar, înainte să începem."],["Ne ocupăm de treabă", "Venim pregătiți, lucrăm îngrijit și verificăm totul împreună."]].map(([title,desc],i)=><div key={title}><span>0{i+1}</span><h3>{title}</h3><p>{desc}</p></div>)}</div></div></section>
    <section id="contact" className="ie-contact"><div className="ie-wrap ie-contact-inner"><div><p className="ie-label">HAI SĂ REZOLVĂM</p><h2>O problemă mai puțin.<br/>Un confort în plus.</h2><p>Spune-ne ce ai în plan. De aici, găsim soluția împreună.</p></div><div className="ie-contact-action"><button type="button" className="ie-button"><Phone size={19}/> Solicită o discuție <ArrowUpRight size={20}/></button><span><MapPin size={14}/> București și județul Ilfov</span></div></div></section>
    <footer className="ie-footer ie-wrap"><a href="#" className="ie-logo"><span className="ie-mark"><Droplets size={22}/></span>nord<span className="ie-logo-light">instal</span>.</a><p>Grijă pentru casa ta. Respect pentru meseria noastră.</p><small>Model demonstrativ · Imagini generate AI</small></footer>
  </main>;
}
