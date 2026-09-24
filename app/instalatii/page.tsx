import { AdArticle } from "@/components/campaign/AdArticle";
export default function Page() {
  return <AdArticle
    title="Clientul cu țeava spartă te caută pe Google. Te găsește?"
    intro={["Omul vrea să afle repede ce lucrări faci și unde te deplasezi.", "Un site îi arată cum te poate contacta."]}
    slug="instalatii"
    installerDemo
    sections={[
      {title:"Tu știi meserie. Noi pregătim site-ul.",paragraphs:["Între lucrări și deplasări, prezentarea afacerii rămâne ușor pentru mai târziu.","Ne spui ce servicii faci și ne trimiți fotografii. Noi scriem textele și construim site-ul."]},
      {title:"Ce găsește clientul pe site?",paragraphs:["Serviciile tale, zona în care lucrezi și fotografii din lucrări.","Butoanele de apel și WhatsApp îl ajută să ia legătura cu tine."]},
      {title:"Un loc al tău online",paragraphs:["Poți trimite site-ul odată cu numărul de telefon sau cu o recomandare.","Planul Start include până la 3 pagini, adaptate pentru mobil. Domeniul rămâne al tău."]},
    ]}
  />;
}
