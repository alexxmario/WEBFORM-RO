"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Monitor, Smartphone } from "lucide-react";

const directions = [
  { name: "Arhitectură", brand: "FORMA", label: "ARHITECTURĂ & INTERIOARE", title: "Spații care\nse simt.", image: "architecture-editorial", alt: "Vilă sculpturală din piatră cu arc monumental și piscină", theme: "architecture", description: "Linii curate, spațiu generos și fotografie care lasă proiectele să vorbească.", detail: "Compoziție editorială", cta: "Descoperă proiectele", colors: ["#e8e2d4", "#94816a", "#292a26"] },
  { name: "Gastronomie", brand: "SERA", label: "BUCĂTĂRIE DE SEZON", title: "Seri de\nținut minte.", image: "restaurant-editorial", alt: "Preparat de sezon servit pe o masă elegantă în tonuri burgundy", theme: "restaurant", description: "O atmosferă care începe înainte de prima vizită. Caldă, expresivă, memorabilă.", detail: "Atmosferă & contrast", cta: "Descoperă experiența", colors: ["#491b21", "#d6a979", "#f4e8d7"] },
  { name: "Beauty", brand: "botanica.", label: "ÎNGRIJIRE, ÎN RITMUL TĂU", title: "Mai aproape\nde natural.", image: "beauty-editorial", alt: "Flacoane cosmetice din sticlă verde și chihlimbar pe piatră naturală", theme: "beauty", description: "Texturi naturale, tonuri calme și o identitate vizuală coerentă în fiecare detaliu.", detail: "Textură & identitate", cta: "Explorează ritualul", colors: ["#dce0c7", "#626b40", "#e9dcbf"] },
];

export function DesignStudio() {
  const [selected, setSelected] = useState(0);
  const [mobile, setMobile] = useState(false);
  const direction = directions[selected];
  return (
    <section className="design-studio" id="design-studio">
      <div className="shell home-section">
        <div className="studio-heading">
          <div><p className="eyebrow">DIRECȚIE CREATIVĂ / WEBFORM</p><h2>Același serviciu.<br /><em>O lume diferită pentru tine.</em></h2></div>
          <p>Un restaurant nu trebuie să arate ca un birou de arhitectură. Explorează trei moduri în care un site poate exprima personalitatea unei afaceri.</p>
        </div>
        <div className="studio-controls">
          <div className="studio-directions" aria-label="Direcție vizuală">
            {directions.map((item, index) => <button key={item.name} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}><span>0{index + 1}</span>{item.name}</button>)}
          </div>
          <div className="studio-devices" aria-label="Dimensiune previzualizare">
            <button type="button" aria-label="Previzualizare desktop" aria-pressed={!mobile} onClick={() => setMobile(false)}><Monitor size={18} /></button>
            <button type="button" aria-label="Previzualizare mobil" aria-pressed={mobile} onClick={() => setMobile(true)}><Smartphone size={18} /></button>
          </div>
        </div>
        <div className={`studio-stage ${mobile ? "is-mobile" : ""}`}>
          <div className="studio-browser">
            <div className="studio-browser-bar"><span aria-hidden="true">● ● ●</span><span>{direction.brand.toLowerCase()} / concept webform</span><span>↗</span></div>
            <div key={selected} className={`studio-concept ${direction.theme}`}>
              <Image src={`/images/${direction.image}.png`} alt={direction.alt} fill sizes="(max-width: 760px) 100vw, 1100px" />
              <div className="concept-shade" />
              <div className="concept-nav"><strong>{direction.brand}</strong><span>O poveste. Un loc. O experiență.</span><span aria-hidden="true">☰</span></div>
              <div className="concept-copy"><p>{direction.label}</p><h3>{direction.title}</h3><a href="#plans">{direction.cta}<ArrowUpRight size={17} /></a></div>
              <div className="concept-index"><span>DESIGN CU PERSONALITATE</span><span>0{selected + 1} / 03</span></div>
            </div>
          </div>
        </div>
        <div className="studio-caption" aria-live="polite">
          <div><span className="studio-detail">{direction.detail}</span><p>{direction.description}</p></div>
          <div className="studio-palette" aria-label="Paleta cromatică">{direction.colors.map(color => <span key={color} style={{background:color}} />)}</div>
        </div>
        <p className="studio-disclaimer">Concepte demonstrative, cu imagini generate. Direcția finală se adaptează afacerii tale și se aprobă împreună.</p>
      </div>
    </section>
  );
}
