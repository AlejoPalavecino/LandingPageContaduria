import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onNavigate: (path: string) => void;
  onCtaClick: () => void;
  forceBackground?: boolean; // Para páginas con fondo claro (blog)
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onCtaClick, forceBackground = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollTo = (id: string) => {
    // Check if we are on the landing page using pathname
    const pathname = window.location.pathname;
    const isLanding = pathname === '/' || pathname === '';
    
    if (isLanding) {
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    } else {
      // If not on landing page, navigate there first then scroll
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 300);
    }
  };

  const navLinks = [
    { name: 'Quién Soy', href: '#about', action: () => onNavigate('about') },
    { name: 'Servicios', href: '#services', action: () => handleScrollTo('services') },
    { name: 'Proceso', href: '#process', action: () => handleScrollTo('process') },
    { name: 'Blog', href: '#blog', action: () => onNavigate('blog-list') },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-40 transition-all duration-500 border-b ${
          isScrolled || forceBackground
            ? 'bg-brand-navy/95 backdrop-blur-md border-brand-blue/30 py-3 shadow-glass' 
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.div 
              className="flex items-center cursor-pointer group" 
              onClick={() => onNavigate('landing')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl font-bold tracking-tighter text-white group-hover:text-brand-gold transition-colors">CDR</span>
              <motion.div 
                className="h-2 w-2 bg-brand-gold rounded-full ml-1 mb-1"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    if (link.action) {
                      link.action();
                    }
                  }}
                  className="text-sm font-medium text-white/80 hover:text-brand-gold transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-gold transition-all group-hover:w-full"></span>
                </a>
              ))}
              <Button onClick={onCtaClick} variant="primary" size="sm">Agendar Reunión</Button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMenuOpen ? <Icons.X size={24} /> : <Icons.Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden absolute top-full left-0 w-full bg-brand-navy border-b border-white/10 shadow-xl overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMenuOpen(false);
                      if (link.action) {
                        link.action();
                      }
                    }}
                    className="block px-3 py-3 rounded-md text-base font-medium text-white/90 hover:bg-white/10 hover:text-brand-gold"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="pt-4 border-t border-white/10 mt-4">
                   <Button onClick={() => { setIsMenuOpen(false); onCtaClick(); }} fullWidth variant="primary">
                     Agendar Reunión
                   </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export const Footer: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => (
  <footer className="bg-brand-navy text-brand-border pt-16 pb-8 border-t border-brand-blue/30 relative overflow-hidden">
    {/* Decorative Background */}
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue rounded-full opacity-5 blur-[120px] -translate-y-1/2 translate-x-1/3"></div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center mb-4 cursor-pointer" onClick={() => onNavigate('landing')}>
            <span className="text-2xl font-bold text-white tracking-tighter">CDR</span>
            <div className="h-2 w-2 bg-brand-gold rounded-full ml-1 mb-1"></div>
          </div>
          <p className="text-sm text-brand-border/60 leading-relaxed">
            Diagnóstico estratégico y dirección financiera para PYMEs que buscan crecer con orden y previsibilidad.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-6">Servicios</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#services" onClick={(e) => { e.preventDefault(); onNavigate('landing'); setTimeout(() => document.getElementById('services')?.scrollIntoView({behavior: 'smooth'}), 100); }} className="hover:text-brand-gold transition-colors">Planificación Fiscal</a></li>
            <li><a href="#services" onClick={(e) => { e.preventDefault(); onNavigate('landing'); setTimeout(() => document.getElementById('services')?.scrollIntoView({behavior: 'smooth'}), 100); }} className="hover:text-brand-gold transition-colors">CFO Fractional</a></li>
            <li><a href="#services" onClick={(e) => { e.preventDefault(); onNavigate('landing'); setTimeout(() => document.getElementById('services')?.scrollIntoView({behavior: 'smooth'}), 100); }} className="hover:text-brand-gold transition-colors">Diagnóstico Financiero</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-6">Empresa</h4>
          <ul className="space-y-3 text-sm">
            <li><button onClick={() => onNavigate('landing')} className="hover:text-brand-gold transition-colors">Inicio</button></li>
            <li><button onClick={() => onNavigate('about')} className="hover:text-brand-gold transition-colors">Quién Soy</button></li>
            <li><button onClick={() => onNavigate('blog-list')} className="hover:text-brand-gold transition-colors">Blog & Insights</button></li>
            <li><button onClick={() => onNavigate('test-salud')} className="hover:text-brand-gold transition-colors">Test de Salud</button></li>
            <li><button onClick={() => onNavigate('admin-login')} className="hover:text-brand-gold transition-colors">Acceso Clientes</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-6">Contacto</h4>
          <p className="text-sm text-brand-border/60 mb-2">Mendoza, Argentina</p>
          <a href="mailto:cdr.fin.plus@gmail.com" className="text-sm hover:text-brand-gold transition-colors font-medium">cdr.fin.plus@gmail.com</a>
        </div>
      </div>
      <div className="pt-8 border-t border-white/10 text-sm text-center text-brand-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
        <span>&copy; {new Date().getFullYear()} CDR Consulting.</span>
        <div className="flex gap-6">
           <a href="#" className="hover:text-white">Privacidad</a>
           <a href="#" className="hover:text-white">Términos</a>
        </div>
      </div>
    </div>
  </footer>
);

export const StickyMobileCTA: React.FC<{ onCtaClick: () => void; onTestClick?: () => void }> = ({ onCtaClick, onTestClick }) => (
  <motion.div 
    initial={{ y: 100 }}
    animate={{ y: 0 }}
    transition={{ delay: 1 }}
    className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg border-t border-brand-border p-3 z-50 flex gap-3 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]"
  >
    {onTestClick && (
      <Button onClick={onTestClick} variant="outline" size="sm" className="flex-1">
        Hacer Test
      </Button>
    )}
    <Button onClick={onCtaClick} variant="primary" size="sm" className={onTestClick ? "flex-[2]" : "w-full"}>
      Agendá reunión
    </Button>
  </motion.div>
);