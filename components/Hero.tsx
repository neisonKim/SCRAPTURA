type P={eyebrow:string;titleKo:string;titleEn:string;summary:string;image:string};
export default function Hero(p:P){return <section className="detailHero" style={{backgroundImage:`url("${p.image}")`}}>
 <div className="heroShade"/><div className="heroCopy"><small>{p.eyebrow}</small><h1>{p.titleKo}</h1><h2>{p.titleEn}</h2><p>{p.summary}</p></div>
 </section>}