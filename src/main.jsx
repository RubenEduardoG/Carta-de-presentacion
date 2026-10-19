import React,{useEffect,useMemo,useRef,useState}from'react';
import{createRoot}from'react-dom/client';
import{Canvas,useFrame,useThree}from'@react-three/fiber';
import{Float,Sparkles,MeshDistortMaterial}from'@react-three/drei';
import*as THREE from'three';
import{RoomEnvironment}from'three/examples/jsm/environments/RoomEnvironment.js';
import'./style.css';

const PORTFOLIO='https://ruben-portfolio-steel.vercel.app/';
// Opcional: pegá tu número con código de país, solo números. Ej: 54911XXXXXXXX
const WHATSAPP_NUMBER='';

// Halo rosado detrás de la escena (textura generada por código, sin descargas)
function Halo(){
 const tex=useMemo(()=>{
  const c=document.createElement('canvas');c.width=c.height=256;
  const g=c.getContext('2d');
  const gr=g.createRadialGradient(128,128,0,128,128,128);
  gr.addColorStop(0,'rgba(255,22,132,0.55)');
  gr.addColorStop(.35,'rgba(255,22,132,0.14)');
  gr.addColorStop(1,'rgba(255,22,132,0)');
  g.fillStyle=gr;g.fillRect(0,0,256,256);
  return new THREE.CanvasTexture(c);
 },[]);
 useEffect(()=>()=>tex.dispose(),[tex]);
 return <mesh position={[0,0,-2.6]}><planeGeometry args={[9,9]}/><meshBasicMaterial map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
}

// Anillos orbitales finos que dan sensación de profundidad
function OrbitRing({radius,tilt,color,opacity,speed}){
 const ref=useRef();
 useFrame((_,dt)=>{if(ref.current)ref.current.rotation.z+=dt*speed});
 return <group rotation={tilt}><mesh ref={ref}><torusGeometry args={[radius,.004,8,220]}/><meshBasicMaterial color={color} transparent opacity={opacity}/></mesh></group>
}

function Core(){
 const group=useRef(),ring=useRef(),satA=useRef(),satB=useRef();
 const{gl,scene}=useThree();
 const drag=useRef({active:false,x:0,y:0,vx:0,vy:0});

 // Entorno de reflejos procedural: brillo metálico real sin descargar HDRI
 useEffect(()=>{
  const pm=new THREE.PMREMGenerator(gl);
  const env=pm.fromScene(new RoomEnvironment(),.04).texture;
  scene.environment=env;
  return()=>{scene.environment=null;env.dispose();pm.dispose()};
 },[gl,scene]);

 useFrame((state,dt)=>{
  if(!group.current)return;
  const px=state.pointer.x,py=state.pointer.y,d=drag.current;
  if(!d.active){
   group.current.rotation.y+=dt*.15;
   group.current.rotation.x=THREE.MathUtils.lerp(group.current.rotation.x,-py*.3,.05);
   group.current.rotation.z=THREE.MathUtils.lerp(group.current.rotation.z,px*.15,.045);
  }else{
   group.current.rotation.y+=d.vx;group.current.rotation.x+=d.vy;d.vx*=.9;d.vy*=.9;
  }
  group.current.position.x=THREE.MathUtils.lerp(group.current.position.x,-px*.3,.04);
  group.current.position.y=THREE.MathUtils.lerp(group.current.position.y,-py*.2,.04);
  ring.current.rotation.z+=dt*.12;
  const t=state.clock.elapsedTime*.5;
  satA.current.position.set(Math.cos(t)*2.3,Math.sin(t)*2.3*.35,0);
  satB.current.position.set(Math.cos(t+Math.PI)*2.3,Math.sin(t+Math.PI)*2.3*.35,0);
  state.camera.position.x=THREE.MathUtils.lerp(state.camera.position.x,px*.35,.025);
  state.camera.position.y=THREE.MathUtils.lerp(state.camera.position.y,py*.2,.025);
  state.camera.position.z=THREE.MathUtils.lerp(state.camera.position.z,5.9-Math.abs(px)*.15,.025);
  state.camera.lookAt(0,0,0);
 });

 const down=e=>{e.stopPropagation();drag.current.active=true;drag.current.x=e.clientX;drag.current.y=e.clientY;document.body.classList.add('grabbing')};
 const move=e=>{if(!drag.current.active)return;const dx=e.clientX-drag.current.x,dy=e.clientY-drag.current.y;drag.current.vx=dx*.006;drag.current.vy=dy*.006;drag.current.x=e.clientX;drag.current.y=e.clientY};
 const up=()=>{drag.current.active=false;document.body.classList.remove('grabbing')};

 return <>
  <Float speed={1.2} rotationIntensity={.1} floatIntensity={.45}>
   <group ref={group} scale={1.1} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerOut={up}>
    <mesh>
     <icosahedronGeometry args={[1.35,64]}/>
     <MeshDistortMaterial color="#0a0a0d" metalness={1} roughness={.12} clearcoat={1} clearcoatRoughness={.05} distort={.32} speed={1.4} envMapIntensity={1.4}/>
    </mesh>
    <mesh rotation={[Math.PI/2.4,0,0]}>
     <torusGeometry args={[1.62,.012,16,220]}/>
     <meshBasicMaterial color="#ff1684"/>
    </mesh>
   </group>
  </Float>
  <group ref={ring} position={[0,0,-.3]}>
   <mesh rotation={[1.2,.3,0]}>
    <torusGeometry args={[2.6,.004,8,260]}/>
    <meshBasicMaterial color="#ff1684" transparent opacity={.22}/>
   </mesh>
  </group>
  <mesh ref={satA} scale={.14}><sphereGeometry args={[1,32,24]}/><meshPhysicalMaterial color="#ff1684" emissive="#ff006c" emissiveIntensity={1.4} metalness={1} roughness={.1}/></mesh>
  <mesh ref={satB} scale={.09}><sphereGeometry args={[1,32,24]}/><meshPhysicalMaterial color="#e6e6ec" metalness={1} roughness={.05}/></mesh>
  <group position={[0,0,-.4]}>
   <OrbitRing radius={3.3} tilt={[1.2,0,.3]} color="#ff1684" opacity={.35} speed={.05}/>
   <OrbitRing radius={3.9} tilt={[.4,.6,-.5]} color="#ffffff" opacity={.12} speed={-.035}/>
   <OrbitRing radius={4.6} tilt={[1.45,.2,1.1]} color="#ff1684" opacity={.18} speed={.025}/>
  </group>
 </>
}

function Scene(){return <Canvas dpr={[1,1.25]} camera={{position:[0,0,5.9],fov:39}} gl={{antialias:true,powerPreference:'high-performance',toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1.15}}>
 <fog attach="fog" args={['#050506',7,14]}/>
 <ambientLight intensity={.25}/>
 <pointLight position={[3,4,4]} intensity={60} color="#ff1684"/>
 <pointLight position={[-4,-2,3]} intensity={30} color="#8fb8ff"/>
 <pointLight position={[0,3,-3]} intensity={40} color="#ffffff"/>
 <Halo/>
 <Core/>
 <Sparkles count={120} scale={[10,7,6]} size={2} speed={.2} opacity={.6} color="#ff5aa5"/>
 <Sparkles count={60} scale={[10,7,6]} size={1.2} speed={.1} opacity={.35}/>
 </Canvas>}

const initial={name:'',company:'',contact:'',type:'Landing Page',idea:'',current:'',references:'',materials:[],design:'',features:'',deadline:'',budget:''};
function ProjectModal({close,initialType='Landing Page'}){
 const[f,setF]=useState({...initial,type:initialType});const[step,setStep]=useState(1);
 const set=(k,v)=>setF(x=>({...x,[k]:v}));
 const toggle=v=>setF(x=>({...x,materials:x.materials.includes(v)?x.materials.filter(a=>a!==v):[...x.materials,v]}));
 const message=useMemo(()=>`Hola Rubén, quiero consultar por un proyecto web.\n\n*Nombre:* ${f.name||'-'}\n*Empresa / marca:* ${f.company||'-'}\n*Contacto:* ${f.contact||'-'}\n*Proyecto:* ${f.type}\n*Idea / objetivo:* ${f.idea||'-'}\n*Web actual:* ${f.current||'-'}\n*Referencias:* ${f.references||'-'}\n*Material listo:* ${f.materials.join(', ')||'A definir'}\n*Diseño / modelo:* ${f.design||'-'}\n*Funciones necesarias:* ${f.features||'-'}\n*Fecha objetivo:* ${f.deadline||'-'}\n*Presupuesto estimado:* ${f.budget||'-'}\n\nQuiero coordinar para avanzar.`,[f]);
 const send=()=>{if(WHATSAPP_NUMBER){window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer')}else{window.location.href=`mailto:rubengutierrezdv@gmail.com?subject=${encodeURIComponent('Consulta de proyecto web')}&body=${encodeURIComponent(message)}`} };
 return <div className="modal" onMouseDown={e=>e.target===e.currentTarget&&close()}><div className="panel">
  <button className="close" onClick={close}>×</button><div className="formtop"><span>PROYECTO / 0{step}</span><b>{step}/3</b></div><div className="progress"><i style={{width:`${step*33.333}%`}}/></div>
  {step===1&&<div className="formpage"><small>PRIMERO, LO ESENCIAL</small><h2>Contame sobre<br/><em>tu proyecto.</em></h2><div className="grid"><label>Nombre<input value={f.name} onChange={e=>set('name',e.target.value)} placeholder="Tu nombre"/></label><label>Empresa / marca<input value={f.company} onChange={e=>set('company',e.target.value)} placeholder="Opcional"/></label></div><label>WhatsApp o email<input value={f.contact} onChange={e=>set('contact',e.target.value)} placeholder="¿Dónde te contacto?"/></label><label>¿Qué necesitás?<select value={f.type} onChange={e=>set('type',e.target.value)}><option>Landing Page</option><option>Web institucional</option><option>E-commerce</option><option>Automatización</option><option>Web + automatizaciones</option><option>Otro</option></select></label><label>Idea y objetivo<textarea value={f.idea} onChange={e=>set('idea',e.target.value)} placeholder="Qué querés lograr, qué vendés y a quién..."/></label></div>}
  {step===2&&<div className="formpage"><small>REFERENCIAS + MATERIAL</small><h2>Cuanto más listo,<br/><em>más rápido salimos.</em></h2><label>Web actual<input value={f.current} onChange={e=>set('current',e.target.value)} placeholder="Link, si ya existe"/></label><label>Referencias que te gustan<textarea value={f.references} onChange={e=>set('references',e.target.value)} placeholder="Pegá links de webs, Drive, Figma, etc."/></label><div className="labeltitle">¿Qué material ya tenés?</div><div className="chips">{['Logo / branding','Textos','Imágenes','Videos','Dominio','Hosting / accesos'].map(x=><button type="button" className={f.materials.includes(x)?'on':''} onClick={()=>toggle(x)} key={x}>{x}</button>)}</div><label>¿Tenés diseño o modelo?<input value={f.design} onChange={e=>set('design',e.target.value)} placeholder="Figma, PDF, maqueta o link"/></label></div>}
  {step===3&&<div className="formpage"><small>ÚLTIMOS DATOS</small><h2>Dejemos todo<br/><em>listo para arrancar.</em></h2><label>Funciones necesarias<textarea value={f.features} onChange={e=>set('features',e.target.value)} placeholder="WhatsApp, agenda, pagos, carrito, formularios..."/></label><div className="grid"><label>Fecha objetivo<input value={f.deadline} onChange={e=>set('deadline',e.target.value)} placeholder="Ej: 15/11"/></label><label>Presupuesto aproximado<input value={f.budget} onChange={e=>set('budget',e.target.value)} placeholder="Opcional"/></label></div><div className="speed"><b>¿LA QUERÉS EN TIEMPO RÉCORD?</b><p>Tené preparados textos, imágenes, videos, identidad visual, accesos y referencias. Con el material listo podemos reducir muchísimo los tiempos.</p></div></div>}
  <div className="formactions">{step>1&&<button className="back" onClick={()=>setStep(step-1)}>← ATRÁS</button>}<button className="next" onClick={()=>step<3?setStep(step+1):send()} disabled={step===1&&(!f.name||!f.idea)}>{step<3?'CONTINUAR →':(WHATSAPP_NUMBER?'ENVIAR POR WHATSAPP ↗':'ENVIAR POR EMAIL ↗')}</button></div>
 </div></div>
}
const services=[
 {number:'01',name:'Landing pages',detail:'Páginas pensadas para presentar tu propuesta, captar consultas y convertir visitas en oportunidades.',type:'Landing Page',glyph:'↗'},
 {number:'02',name:'Sitios web',detail:'Una presencia digital moderna, rápida y adaptada a la identidad de tu negocio.',type:'Web institucional',glyph:'⌘'},
 {number:'03',name:'E-commerce',detail:'Tiendas online para mostrar productos, organizar pedidos y facilitar la compra.',type:'E-commerce',glyph:'◇'},
 {number:'04',name:'Automatizaciones',detail:'Formularios, WhatsApp, agendas y flujos que reducen tareas repetitivas.',type:'Automatización',glyph:'∞'}
];
function App(){
 const[open,setOpen]=useState(false),[selectedType,setSelectedType]=useState('Landing Page');
 const start=(type='Landing Page')=>{setSelectedType(type);setOpen(true)};
 const move=React.useRef(null);
 const onMouseMove=e=>{if(move.current){const x=e.clientX/window.innerWidth-.5,y=e.clientY/window.innerHeight-.5;move.current.style.setProperty('--mx',`${x*25}px`);move.current.style.setProperty('--my',`${y*18}px`)}};
 return <main className="page" onMouseMove={onMouseMove}>
  <div className="scene"><Scene/></div><div className="grain"/>
  <nav><a className="brand" href="#inicio" aria-label="Inicio RG">RG<span>.</span></a><div className="navright"><a href="#servicios">SERVICIOS</a><a href={PORTFOLIO} target="_blank" rel="noreferrer">PORTFOLIO ↗</a><button onClick={()=>start()}>HABLEMOS ↗</button></div></nav>
  <section className="hero" id="inicio" ref={move}>
   <div className="eyebrow"><i/> RUBÉN GUTIÉRREZ · DESARROLLADOR WEB FREELANCE</div>
   <h1>TU IDEA<br/><em>MÁS LEJOS.</em></h1>
   <div className="pitch"><p>Diseño y desarrollo soluciones digitales que combinan <strong>identidad, tecnología y estrategia</strong> para que tu negocio crezca.</p>
   <div className="hero-tags"><span>WEB</span><span>E-COMMERCE</span><span>3D</span><span>AUTOMATIZACIONES</span></div>
   <div className="actions"><button className="primary" onClick={()=>start()}>CONTAME TU PROYECTO <b>→</b></button><a className="secondary" href={PORTFOLIO} target="_blank" rel="noreferrer">VER PORTFOLIO ↗</a></div>
   <div className="hint">MOVÉ EL MOUSE · EXPLORÁ EL 3D · DESLIZÁ PARA DESCUBRIR</div></div>
  </section>
  <section className="statement" id="concepto"><span className="section-kicker">01 / QUÉ HAGO</span><h2>NO SE TRATA SOLO<br/>DE ESTAR ONLINE.<br/><em>SE TRATA DE DESTACAR.</em></h2><p>Desde una landing enfocada en captar clientes hasta una tienda online o una solución a medida. Cada proyecto empieza con un objetivo claro y se construye alrededor de tu negocio.</p></section>
  <section className="services-section" id="servicios"><div className="section-heading"><span className="section-kicker">02 / SOLUCIONES DIGITALES</span><h2>QUÉ PODEMOS<br/><em>CREAR JUNTOS.</em></h2></div><div className="services-grid">{services.map(s=><button className="service-card" key={s.number} onClick={()=>start(s.type)}><span className="card-number">{s.number} / SERVICIO</span><span className="card-glyph">{s.glyph}</span><strong>{s.name}</strong><p>{s.detail}</p><span className="card-link">CONTAR MI IDEA ↗</span></button>)}</div></section>
  <section className="process-section" id="proceso"><span className="section-kicker">03 / CÓMO TRABAJO</span><h2>UNA IDEA. UN PLAN.<br/><em>UN RESULTADO.</em></h2><div className="steps">{[['01','CONVERSAMOS','Entiendo tu negocio y lo que necesitás.'],['02','PLANIFICAMOS','Definimos alcance, materiales y tiempos.'],['03','DESARROLLAMOS','Diseño, implementación y revisiones.'],['04','PUBLICAMOS','Pruebas, entrega y puesta en marcha.']].map(([n,t,d])=><div className="step" key={n}><span>{n}</span><strong>{t}</strong><p>{d}</p></div>)}</div></section>
  <section className="contact-section" id="contacto"><div className="contact-panel"><span className="section-kicker">04 / TU PRÓXIMO PROYECTO</span><h2>¿LO HACEMOS<br/><em>REALIDAD?</em></h2><p>Contame qué querés crear, qué materiales ya tenés y cuándo necesitás lanzarlo. Con esa información podemos empezar con un plan claro.</p><div className="actions"><button className="primary" onClick={()=>start()}>SOLICITAR PRESUPUESTO ↗</button><a className="secondary" href={PORTFOLIO} target="_blank" rel="noreferrer">CONOCÉ MI TRABAJO ↗</a></div></div></section>
  <footer className="footerline"><span>RG. · RUBÉN GUTIÉRREZ</span><a href="mailto:rubengutierrezdv@gmail.com">RUBENGUTIERREZDV@GMAIL.COM</a><span>© 2026 · DESARROLLO WEB FREELANCE</span></footer>
  {open&&<ProjectModal initialType={selectedType} close={()=>setOpen(false)}/>}
 </main>
}
createRoot(document.getElementById('root')).render(<App/>);
