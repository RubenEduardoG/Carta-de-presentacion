import React, { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Services from './components/Services.jsx';
import Projects from './components/Projects.jsx';
import Process from './components/Process.jsx';
import Why from './components/Why.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import ProjectModal from './components/ProjectModal.jsx';

// Revela las secciones al entrar en pantalla. Sin IntersectionObserver o con "reduce motion", todo se ve de una.
function useReveal() {
  useEffect(() => {
    const els = [...document.querySelectorAll('.reveal')];
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function App() {
  const [modal, setModal] = useState(null); // null | tipo de proyecto preseleccionado
  const start = useCallback((type = 'Landing Page') => setModal(type), []);
  useReveal();

  return (
    <>
      <a className="skip" href="#contenido">Saltar al contenido</a>
      <div className="grain" aria-hidden="true" />
      <Header onStart={() => start()} />
      <main id="contenido">
        <Hero onStart={start} />
        <Services onStart={start} />
        <Projects />
        <Process />
        <Why />
        <Contact onStart={start} />
      </main>
      <Footer />
      {modal && <ProjectModal initialType={modal} close={() => setModal(null)} />}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
