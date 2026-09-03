'use client';
import { useEffect, useState } from 'react';

const works=[
  {title:'Eventos',img:'/images/eventos.jpg',text:'Fotografias para eventos sociais, culturais e corporativos — criativas, ágeis e alinhadas às necessidades de cada cliente.'},
  {title:'Retratos',img:'/images/retratos.png',text:'Direção leve e atenção à expressão. Imagens que comunicam presença, intenção e estilo com simplicidade e cuidado.'},
  {title:'Casamentos',img:'/images/casamentos.png',text:'Um registro discreto e sensível, construindo um acervo fiel e afetivo de cada história vivida.'},
  {title:'Gastronomia',img:'/images/gastronomia.jpg',text:'Clareza e apelo visual para cardápios, catálogos e campanhas que comunicam sabor, qualidade e identidade.'},
  {title:'Vídeos',img:'/images/videos.jpg',text:'Filmes sob medida para marcas, projetos culturais e pessoas criativas, com ritmo e linguagem alinhados ao propósito.'},
  {title:'Curadoria musical',img:'/images/curadoria.jpg',text:'Atmosferas sonoras para eventos, marcas e espaços. Repertório, pesquisa e estratégia para encontrar o tom exato.'}
];
const bio='Olá, me chamo Danilo Alvarez — pode me chamar de Dan. Nasci e cresci em Belo Horizonte e conheci a fotografia aos oito anos, com uma câmera analógica descartável. Há mais de uma década trabalho entre casamentos, retratos, gastronomia, eventos, moda e produções audiovisuais. Coordenei o audiovisual do Galpão Cine Horto e também a Casa Camô, espaço dedicado à cultura e à formação. O Estúdio Akaia atua com fotografia comercial, moda, vídeos publicitários, videoclipes, eventos, curtas, still para cinema e produções artísticas.';

function useSectionProgress(selector:string){const[p,setP]=useState(0);useEffect(()=>{let f=0;const u=()=>{f=0;const s=document.querySelector<HTMLElement>(selector);if(!s)return;const r=s.getBoundingClientRect(),d=s.offsetHeight-innerHeight;setP(Math.max(0,Math.min(1,-r.top/Math.max(d,1))))};const on=()=>{if(!f)f=requestAnimationFrame(u)};u();addEventListener('scroll',on,{passive:true});addEventListener('resize',on);return()=>{removeEventListener('scroll',on);removeEventListener('resize',on);cancelAnimationFrame(f)}},[selector]);return p}
function Lit({children,className=''}:{children:string,className?:string}){let n=0;return <span className={`lit ${className}`}>{children.split(' ').map((word,wi)=><span className="word" key={`${word}-${wi}`}>{[...word].map(c=><span className="char" key={n} style={{'--i':n++} as React.CSSProperties}>{c}</span>)}{wi<children.split(' ').length-1&&<span className="space">&nbsp;</span>}</span>)}</span>}
function Typed({text,progress}:{text:string,progress:number}){const shown=Math.floor(text.length*Math.min(1,progress*1.18));return <p className="typed" aria-label={text}>{[...text].map((c,i)=><span key={i} className={i<shown?'on':''}>{c}</span>)}<i/></p>}
function Observe(){useEffect(()=>{const io=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('seen',e.isIntersecting)),{threshold:.16});document.querySelectorAll('.reveal,.lit').forEach(e=>io.observe(e));return()=>io.disconnect()},[]);return null}

const cameraParts=[
  {src:'/images/part-lens.png',ax:350,ay:0,az:30,ex:-130,ey:10,ez:250,ry:-16},
  {src:'/images/part-optics.png',ax:190,ay:0,az:20,ex:-55,ey:0,ez:140,ry:-10},
  {src:'/images/part-body.png',ax:0,ay:0,az:0,ex:0,ey:20,ez:0,ry:5},
  {src:'/images/part-sensor.png',ax:-20,ay:0,az:-10,ex:15,ey:-5,ez:190,ry:12},
  {src:'/images/part-top-shell.png',ax:0,ay:115,az:-15,ex:0,ey:-120,ez:110,ry:-12},
  {src:'/images/part-top-board.png',ax:0,ay:65,az:-20,ex:15,ey:-65,ez:-120,ry:9},
  {src:'/images/part-main-board.png',ax:-185,ay:0,az:-25,ex:90,ey:10,ez:-170,ry:18},
  {src:'/images/part-rear.png',ax:-315,ay:0,az:-35,ex:170,ey:15,ez:210,ry:24}
] as const;
export default function Home(){const p=useSectionProgress('.camera-scene'),aboutP=useSectionProgress('.about');const explode=Math.sin(Math.PI*p);return <main><Observe/>
<header className="topbar"><a href="#inicio" className="mini-logo">AKAIA®</a><nav aria-label="Navegação principal"><a href="#trabalhos">Portfólio</a><a href="#sobre">Sobre</a><a href="#contato">Contato</a></nav></header>
<section className="camera-scene" id="inicio"><div className="camera-sticky"><div className="grain"/><p className="eyebrow">ESTÚDIO DE FOTOGRAFIA + FILME</p><h1 aria-label="Akaia" className="brand">AKAIA</h1><div className="camera-stage" aria-label="Câmera fotorealista desmontando peça a peça, girando uma vez e remontando conforme a rolagem"><div className="camera-rig" style={{transform:`rotateY(${p*360}deg) rotateX(${Math.sin(p*Math.PI)*5}deg)`}}>{cameraParts.map((part,i)=><img className="camera-component" key={part.src} src={part.src} alt="" style={{transform:`translate3d(${part.ax*(1-explode)+part.ex*explode}px,${part.ay*(1-explode)+part.ey*explode}px,${part.az*(1-explode)+part.ez*explode}px) rotateY(${part.ry*explode}deg) rotateX(${part.ry*.35*explode}deg)`,transitionDelay:`${i*8}ms`}}/>)}</div></div><p className="hero-note">IMAGENS QUE GUARDAM<br/>O QUE O TEMPO MOVE.</p><a className="scroll-cue" href="#manifesto"><span>ROLE PARA DESMONTAR</span><i>↓</i></a></div></section>
<section className="manifesto" id="manifesto"><p className="kicker">UM ESTÚDIO, MUITAS FORMAS DE VER.</p><h2><Lit>Histórias reais.</Lit><br/><Lit className="serif">Presença em cada quadro.</Lit></h2><div className="manifesto-grid"><img className="reveal" src="/images/eventos.jpg" alt="Fotografia de evento do Estúdio Akaia"/><div className="manifesto-copy reveal"><p>Fotografia não é só o que permanece.</p><p>É o instante em que luz, pessoa e lugar se reconhecem. O Estúdio Akaia cria imagens e filmes para guardar memória, construir identidade e mover pessoas.</p></div></div></section>
<section className="work-intro" id="trabalhos"><p className="kicker">PORTFÓLIO SELECIONADO</p><h2><Lit>O olhar muda.</Lit><br/><Lit>A essência fica.</Lit></h2></section>
<section className="works">{works.map(w=><article className="work" key={w.title}><div className="work-sticky"><figure className="work-image"><img src={w.img} alt={`Fotografia de ${w.title} por Estúdio Akaia`}/></figure><div className="work-copy"><h3><Lit>{w.title}</Lit></h3><p className="reveal">{w.text}</p><a href="#contato">CONVERSAR SOBRE UM PROJETO <b>↗</b></a></div></div></article>)}</section>
<section className="about" id="sobre"><div className="about-sticky"><div className="about-photo"><img src="/images/danilo.jpg" alt="Danilo Alvarez, fotógrafo e fundador do Estúdio Akaia"/></div><div className="about-copy"><p className="kicker">SOBRE · DANILO ALVAREZ</p><h2><Lit>Curiosidade como método.</Lit></h2><Typed text={bio} progress={aboutP}/></div></div></section>
<section className="quote"><p>“</p><h2><Lit>Fazer história é aprender a enxergar o que ainda não foi visto.</Lit></h2></section>
<footer id="contato"><p className="kicker">TEM UMA IDEIA?</p><h2><Lit>Vamos fazer</Lit><br/><Lit className="serif">história?</Lit></h2><p>Conte sua ideia, projeto ou consulte disponibilidade. Quanto mais detalhes você enviar, melhor poderemos responder.</p><a className="contact-button" href="https://wa.me/5531998662272">INICIAR CONVERSA ↗</a><div className="footer-line"><span>BELO HORIZONTE · BRASIL</span><a href="http://instagram.com/dan.alvarezzz">INSTAGRAM ↗</a><span>© {new Date().getFullYear()} AKAIA</span></div></footer>
</main>}
