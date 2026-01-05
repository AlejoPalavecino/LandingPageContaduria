import React, { useState, useEffect } from 'react';
import { Header, Footer, StickyMobileCTA } from './components/Layout';
import { CalendlyModal } from './components/CalendlyModal';
import { HealthTest } from './components/HealthTest';
import { Button } from './components/Button';
import { Section, Card, Badge, Input, Select } from './components/UI';
import { Post, PageRoute } from './types';
import { Icons, HeroIllustration, EmptyStateIllustration } from './components/Icons';
import { PageTransition, FadeInUp, StaggerContainer, StaggerItem, AnimatePresence } from './components/Motion';
import { AdminLogin, AdminPostList as AdminPostListComponent } from './components/Admin';
import { AdminPostEditor as AdminPostEditorComponent, PostFormData } from './components/AdminPostEditor';
import { useAdminPosts, useAdminPost } from './src/presentation/hooks/useAdminPosts';
import { usePosts } from './src/presentation/hooks/usePosts';
import { usePost } from './src/presentation/hooks/usePost';
import { SupabaseAuthService } from './src/infrastructure/supabase/SupabaseAuthService';

// Instancia del servicio de autenticación
const authService = new SupabaseAuthService();

// --- Components Refactored ---

const ServiceCard: React.FC<{ title: string; subtitle: string; benefits: string[]; icon: React.ReactNode; onNavigate: () => void }> = ({ title, subtitle, benefits, icon, onNavigate }) => (
  <Card className="h-full flex flex-col p-8 group relative overflow-hidden">
    {/* Abstract Shape Overlay */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out pointer-events-none"></div>

    <div className="h-14 w-14 bg-brand-light rounded-2xl flex items-center justify-center text-brand-blue mb-6 group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300 relative z-10">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-brand-navy mb-2 relative z-10">{title}</h3>
    <p className="text-brand-graySec font-medium mb-6 min-h-[48px] relative z-10">{subtitle}</p>
    
    <ul className="space-y-3 mb-8 flex-1 relative z-10">
      {benefits.map((b, i) => (
        <li key={i} className="flex items-start gap-3 text-brand-gray text-sm">
          <div className="mt-1 min-w-[6px] h-[6px] rounded-full bg-brand-gold"></div>
          {b}
        </li>
      ))}
    </ul>
    
    <button 
      onClick={onNavigate}
      className="text-brand-blue font-bold text-sm flex items-center group-hover:text-brand-gold transition-colors mt-auto relative z-10"
    >
      Ver cómo trabajamos <Icons.ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </button>
  </Card>
);

const LandingPage: React.FC<{ onCtaClick: () => void }> = ({ onCtaClick }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Auto-scroll effect for hash navigation
  useEffect(() => {
    // Check pathname for sections
    const pathname = window.location.pathname.slice(1);

    if (pathname === 'services' || pathname === 'process') {
      const element = document.getElementById(pathname);
      if (element) {
        // Delay to allow page transition/render
        setTimeout(() => {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }, 500);
      }
    } else if (!pathname) {
      // Force scroll to top if at root
      window.scrollTo(0, 0);
    }
  }, []);

  const scrollToProcess = () => {
    const element = document.getElementById('process');
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <PageTransition>
      {/* Hero */}
      <div className="relative bg-brand-navy overflow-hidden min-h-[85vh] flex items-center">
        {/* Real Background Image with Stronger Blur */}
        <div className="absolute inset-0 z-0 opacity-50 blur-[6px] scale-105 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-center bg-cover"></div>
        
        {/* Gradient Overlay to ensure blue tone and readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-brand-navy via-brand-navy/95 to-brand-blue/90 mix-blend-multiply"></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent opacity-80"></div>
        
        {/* Pattern */}
        <div className="absolute inset-0 opacity-10 z-0 bg-[radial-gradient(#FFC83D_1px,transparent_1px)] bg-[length:40px_40px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <FadeInUp className="max-w-2xl">
              <Badge variant="gold" className="mb-6 bg-brand-gold/20 text-brand-gold border-brand-gold/30 backdrop-blur-sm">Estrategia CFO Fractional y Gestión</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-8 shadow-black/10 drop-shadow-lg">
                Planificación fiscal y financiera para <span className="text-brand-gold">decidir mejor.</span>
              </h1>
              <p className="text-lg md:text-xl text-brand-light/95 mb-10 leading-relaxed font-light drop-shadow-md">
                Diagnóstico estratégico para emprendedores y pymes que comienzan a desarrollarse.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <Button onClick={onCtaClick} size="lg" variant="primary">
                  Agendá reunión 30 min
                </Button>
                <Button 
                  variant="white-outline" 
                  size="lg"
                  onClick={() => document.getElementById('health-test')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Hacer test de salud
                </Button>
              </div>

              {/* Trust Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 border-t border-white/20 pt-8 max-w-lg">
                {[
                  { label: "Control de Caja", icon: <Icons.Briefcase className="w-5 h-5 text-brand-gold"/> },
                  { label: "Plan Fiscal", icon: <Icons.ShieldCheck className="w-5 h-5 text-brand-gold"/> },
                  { label: "Datos Reales", icon: <Icons.TrendingUp className="w-5 h-5 text-brand-gold"/> },
                ].map((m, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md">{m.icon}</div>
                    <span className="text-white font-medium text-sm">{m.label}</span>
                  </div>
                ))}
              </div>
            </FadeInUp>

            {/* Illustration */}
            <FadeInUp delay={0.2} className="hidden lg:block relative">
               <HeroIllustration />
            </FadeInUp>
          </div>
        </div>
      </div>

      {/* Pain Points */}
      <Section bg="alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">¿Tu empresa muestra estos síntomas?</h2>
            <p className="text-brand-graySec">Detectar el problema es el primer paso para curar la rentabilidad.</p>
          </FadeInUp>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { text: "Pagás impuestos sin una estrategia clara", icon: <Icons.ShieldCheck /> },
              { text: "La caja es impredecible, vivís apagando incendios", icon: <Icons.Briefcase /> },
              { text: "No sabés tu margen real ni qué te conviene", icon: <Icons.PieChart /> },
              { text: "Crecés en ventas, pero la rentabilidad no aparece", icon: <Icons.TrendingUp /> },
              { text: "Tu contabilidad cumple, pero no te guía", icon: <Icons.FileText /> }
            ].map((point, i) => (
              <StaggerItem key={i}>
                <Card className="p-6 flex items-start gap-4 hover:border-brand-blue/30" hoverEffect={false}>
                   <div className="mt-1 text-brand-blue/80 bg-brand-light p-2 rounded-lg">
                     {React.cloneElement(point.icon as React.ReactElement<any>, { size: 20 })}
                   </div>
                   <p className="text-brand-gray font-medium leading-relaxed">{point.text}</p>
                </Card>
              </StaggerItem>
            ))}
            {/* Last card CTA */}
             <StaggerItem>
               <div className="h-full p-6 rounded-[20px] border border-dashed border-brand-blue/30 flex items-center justify-center bg-brand-light/50">
                 <p className="text-center text-brand-blue font-semibold">
                   Si marcaste más de 2, <button onClick={onCtaClick} className="underline text-brand-gold hover:text-brand-goldHover">hablemos.</button>
                 </p>
               </div>
             </StaggerItem>
          </StaggerContainer>
        </div>
      </Section>

      {/* Services */}
      <Section id="services" bg="white" pattern="dots">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
             <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">Soluciones a medida de tu etapa</h2>
                <p className="text-brand-graySec text-lg">Dejá de operar por intuición y empezá a gestionar con precisión quirúrgica.</p>
             </div>
             <Button onClick={onCtaClick} variant="ghost" className="hidden md:inline-flex">Ver planes completos <Icons.ArrowRight className="ml-2 w-4 h-4"/></Button>
          </FadeInUp>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StaggerItem>
              <ServiceCard 
                title="Planificación Fiscal"
                subtitle="Optimización legal para anticiparte a los vencimientos."
                benefits={["Auditoría de encuadre", "Proyección de impuestos", "Defensa de caja"]}
                icon={<Icons.ShieldCheck size={28} />}
                onNavigate={scrollToProcess}
              />
            </StaggerItem>
            <StaggerItem>
              <ServiceCard 
                title="Planificación Financiera"
                subtitle="Transformá la incertidumbre en un plan de acción concreto."
                benefits={["Cashflow proyectado", "Presupuesto anual", "Análisis de costos"]}
                icon={<Icons.BarChart3 size={28} />}
                onNavigate={scrollToProcess}
              />
            </StaggerItem>
            <StaggerItem>
              <ServiceCard 
                title="CFO Fractional"
                subtitle="Dirección financiera senior sin el costo de estructura fija."
                benefits={["Tablero de control (KPIs)", "Reuniones de directorio", "Estrategia de inversión"]}
                icon={<Icons.LineChart size={28} />}
                onNavigate={scrollToProcess}
              />
            </StaggerItem>
          </StaggerContainer>
        </div>
      </Section>

      {/* Process (Timeline) */}
      <Section id="process" bg="navy" className="text-white overflow-hidden relative py-32">
         {/* Background Elements */}
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-blue rounded-full opacity-20 blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-gold rounded-full opacity-5 blur-[120px] translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInUp className="text-center mb-24">
             <Badge variant="gold" className="bg-brand-gold/10 text-brand-gold border-brand-gold/30 mb-4 backdrop-blur-sm">El Método CDR</Badge>
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">De la intuición a la estrategia</h2>
             <p className="text-lg text-brand-light/70 max-w-2xl mx-auto">Un proceso cíclico diseñado para profesionalizar tu gestión financiera sin perder agilidad.</p>
          </FadeInUp>
          
          <StaggerContainer className="relative">
             {/* Connection Line (Desktop) */}
             <div className="hidden lg:block absolute top-[55%] left-0 w-full h-px bg-gradient-to-r from-white/0 via-brand-gold/30 to-white/0 z-0"></div>
             
             {/* Grid layout adjusted: Mobile 1, Tablet 3, Desktop 5 */}
             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
               {[
                 { step: '01', title: 'Diagnóstico', desc: 'Análisis profundo de la situación actual.', icon: <Icons.Search /> },
                 { step: '02', title: 'Estrategia', desc: 'Diseño del plan de acción a medida.', icon: <Icons.PieChart /> },
                 { step: '03', title: 'Ejecución', desc: 'Implementación de herramientas de gestión.', icon: <Icons.Briefcase /> },
                 { step: '04', title: 'Training', desc: 'Capacitación financiera para tu equipo.', icon: <Icons.TrendingUp /> },
                 { step: '05', title: 'Control', desc: 'Revisión mensual de objetivos y KPIs.', icon: <Icons.BarChart3 /> },
               ].map((item, idx) => (
                 <StaggerItem key={idx} className="relative group h-full">
                    {/* Connection Line (Mobile) */}
                    {idx !== 4 && <div className="lg:hidden absolute left-1/2 -translate-x-1/2 top-[90%] h-12 w-0.5 bg-brand-blue/30 z-0"></div>}

                    {/* Card container */}
                    <div className="relative z-10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:-translate-y-2 transition-all duration-300 group-hover:border-brand-gold/40 group-hover:shadow-[0_0_30px_-10px_rgba(255,200,61,0.3)] flex flex-col items-center text-center h-full min-h-[260px] w-full">
                        
                        {/* Step Badge */}
                        <div className="mb-5">
                            <span className="px-3 py-1 rounded-full bg-brand-navy/50 border border-white/10 text-[10px] font-bold text-brand-gold tracking-widest uppercase shadow-sm">
                                Paso {item.step}
                            </span>
                        </div>

                        {/* Icon */}
                        <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-brand-navy to-brand-blue border border-white/10 text-white group-hover:text-brand-gold group-hover:scale-110 transition-all duration-300 shadow-lg relative group-hover:shadow-gold/20">
                            {React.cloneElement(item.icon as React.ReactElement<any>, { size: 24, className: "relative z-10" })}
                        </div>

                        {/* Content */}
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-gold transition-colors">{item.title}</h3>
                        <p className="text-sm text-brand-light/70 leading-relaxed">
                          {item.desc}
                        </p>
                    </div>
                 </StaggerItem>
               ))}
             </div>
          </StaggerContainer>

          <div className="mt-20 text-center">
             <Button onClick={onCtaClick} variant="primary" className="shadow-gold hover:shadow-lg hover:scale-105 transition-all">
               Comenzar con el Diagnóstico
             </Button>
          </div>
        </div>
      </Section>

      {/* Health Test Embed */}
      <Section id="health-test" bg="alt" pattern="dots">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeInUp>
              <Badge variant="warning" className="mb-4">Herramienta Gratuita</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-6">Diagnóstico Express: ¿Qué tan saludable es tu empresa?</h2>
              <p className="text-lg text-brand-graySec mb-8 leading-relaxed">
                Hacé este test de 1 minuto. Sin registros complicados. Obtené un puntaje objetivo sobre la solidez de tu negocio.
              </p>
              <div className="space-y-6">
                {[
                  { title: 'Análisis de margen', desc: 'Entendé si estás ganando lo suficiente.' },
                  { title: 'Evaluación de runway', desc: 'Calculá tu oxígeno financiero.' },
                  { title: 'Nivel de control', desc: 'Medí tu capacidad de gestión.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                     <div className="mt-1 bg-brand-white p-1 rounded shadow-sm text-brand-gold">
                       <Icons.CheckCircle2 size={18} />
                     </div>
                     <div>
                       <h4 className="font-bold text-brand-navy">{item.title}</h4>
                       <p className="text-sm text-brand-graySec">{item.desc}</p>
                     </div>
                  </div>
                ))}
              </div>
            </FadeInUp>
            <FadeInUp delay={0.2} className="relative">
              <HealthTest onCtaClick={onCtaClick} />
            </FadeInUp>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section bg="white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-navy">Preguntas Frecuentes</h2>
          </FadeInUp>
          <div className="space-y-4">
            {[
              { q: "¿Para quién es este servicio?", a: "Para dueños de PYMEs de servicios o productos, con equipos de 5 a 50 personas, que sienten que la administración los desborda." },
              { q: "¿Qué pasa en la reunión de 30 minutos?", a: "Es una charla sin compromiso para entender tu situación actual. Si puedo ayudarte, te cuento cómo. Si no, te derivo." },
              { q: "¿Necesito tener todo ordenado para empezar?", a: "No. Justamente el orden es parte de lo que vamos a construir juntos." },
              { q: "¿Esto reemplaza a mi contador/estudio?", a: "No necesariamente. Trabajo en equipo con tu contador para darle una visión estratégica a los números que él liquida." }
            ].map((item, idx) => (
              <Card key={idx} className="overflow-hidden transition-all duration-300" hoverEffect={false}>
                <button 
                  className="w-full flex justify-between items-center p-6 text-left font-semibold text-brand-navy hover:bg-brand-alt transition-colors"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  {item.q}
                  <div className={`transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}>
                     <Icons.ChevronDown className="h-5 w-5 text-brand-graySec" />
                  </div>
                </button>
                <div 
                   className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-6 pt-0 text-brand-graySec leading-relaxed border-t border-brand-border/50 mt-2">
                    {item.a}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Bottom CTA */}
      <Section bg="alt" className="text-center">
        <FadeInUp className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-6">Dejá de decidir por intuición</h2>
          <p className="text-xl text-brand-graySec mb-10 max-w-2xl mx-auto">
            Agenda tu sesión de diagnóstico inicial. Es gratis y te llevás valor real desde el minuto uno.
          </p>
          <Button size="lg" onClick={onCtaClick} variant="primary">Agendá reunión 30 min</Button>
        </FadeInUp>
      </Section>
    </PageTransition>
  );
};

// 2. About Page (Dedicated)
const AboutPage: React.FC<{ onCtaClick: () => void }> = ({ onCtaClick }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageTransition>
      {/* Background con gradiente azulado y animaciones - sin padding top para que llegue hasta arriba */}
      <Section id="about" className="relative bg-gradient-to-br from-brand-navy via-[#0B2F5B] to-brand-blue overflow-hidden pt-32 pb-20">
        {/* Texturas y elementos decorativos animados */}
        <div className="absolute inset-0 z-0">
          {/* Patron de puntos animado */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFC83D_1px,transparent_1px)] bg-[length:40px_40px] animate-[pulse_8s_ease-in-out_infinite]"></div>
          
          {/* Círculos flotantes de fondo */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-gold/10 rounded-full blur-[100px] animate-[float_15s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-blue/20 rounded-full blur-[120px] animate-[float_20s_ease-in-out_infinite] animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/5 rounded-full blur-[80px] animate-[float_18s_ease-in-out_infinite] animation-delay-4000"></div>
          
          {/* Líneas diagonales decorativas */}
          <svg className="absolute top-0 right-0 w-full h-full opacity-5" preserveAspectRatio="none">
            <defs>
              <pattern id="diagonal-lines" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="40" stroke="currentColor" strokeWidth="1" className="text-brand-gold"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diagonal-lines)" />
          </svg>
          
          {/* Ondas SVG animadas */}
          <svg className="absolute bottom-0 left-0 w-full opacity-10 animate-[wave_20s_ease-in-out_infinite]" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" fillOpacity="1" className="text-brand-gold" d="M0,160L48,170.7C96,181,192,203,288,186.7C384,171,480,117,576,117.3C672,117,768,171,864,181.3C960,192,1056,160,1152,138.7C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <FadeInUp className="relative order-2 lg:order-1">
               {/* Sombra decorativa con efecto parallax */}
               <div className="absolute inset-0 bg-brand-gold rounded-[40px] rotate-3 opacity-20 translate-x-4 translate-y-4 group-hover:rotate-6 transition-transform duration-700"></div>
               <div className="absolute -inset-4 bg-gradient-to-r from-brand-gold/20 to-brand-blue/20 rounded-[48px] blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-700"></div>
               
               <div className="relative rounded-[40px] overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm group">
                 <img 
                   src="/images/Profile.png" 
                   alt="Antonio Scordia - CFO Fractional" 
                   className="w-full h-[600px] object-cover object-top hover:scale-105 transition-transform duration-700"
                 />
               </div>
            </FadeInUp>

            {/* Content */}
            <FadeInUp delay={0.2} className="order-1 lg:order-2">
               <Badge variant="gold" className="mb-4 bg-brand-gold/20 text-brand-gold border-brand-gold/30 backdrop-blur-sm">Tu Socio Estratégico</Badge>
               <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">Antonio Scordia</h1>
               <p className="text-xl text-brand-gold font-medium mb-8 drop-shadow-md">Fundador & CFO Fractional</p>

               <div className="space-y-6 text-lg text-white/90 leading-relaxed font-light">
                 <p className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10">
                   Soy Contador Público y Especialista en Finanzas Corporativas con más de 15 años de trayectoria.
                 </p>
                 <p className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10">
                   Fundé <strong className="text-brand-gold">CDR</strong> con una misión: democratizar la dirección financiera de alto nivel. Me di cuenta de que las PYMEs suelen tener excelentes productos, pero fallan en la gestión de caja y rentabilidad por falta de estrategia.
                 </p>
                 <p className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10">
                   Mi enfoque es 100% práctico. Me integro a tu equipo para ordenar la casa, optimizar impuestos legalmente y construir un plan de crecimiento sólido.
                 </p>
               </div>

               {/* Stats con efecto glassmorphism */}
               <div className="mt-8 pt-8 border-t border-white/20 grid grid-cols-2 gap-8">
                  <div className="backdrop-blur-md bg-white/10 p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                    <div className="text-4xl font-bold text-brand-gold tracking-tight drop-shadow-lg">+50</div>
                    <div className="text-sm text-white/80 uppercase tracking-wide font-semibold mt-1">PYMEs Potenciadas</div>
                  </div>
                  <div className="backdrop-blur-md bg-white/10 p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                    <div className="text-4xl font-bold text-brand-gold tracking-tight drop-shadow-lg">15+</div>
                    <div className="text-sm text-white/80 uppercase tracking-wide font-semibold mt-1">Años de Experiencia</div>
                  </div>
               </div>

               <div className="mt-10 flex gap-4">
                  <Button onClick={onCtaClick} variant="primary" className="shadow-gold hover:shadow-2xl hover:scale-105 transition-all">
                    Hablemos de tu empresa
                  </Button>
               </div>
            </FadeInUp>
          </div>
        </div>
      </Section>
    </PageTransition>
  );
}

// 3. Blog Pages (Improved UI with Sort and Multi-Select Filters + Tag Counts)
const BlogListPage: React.FC<{ onNavigate: (slug: string) => void }> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState('newest');

  // Cargar posts desde Supabase
  const { posts: publishedPosts, loading, error } = usePosts({
    search: search || undefined,
    tag: selectedTags[0] || undefined, // Por ahora solo un tag
  });

  // Calcular tags únicos y sus conteos
  const tagCounts = publishedPosts.reduce((acc, post) => {
    post.tags.forEach(tag => {
      acc[tag.name] = (acc[tag.name] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // Ordenar tags por popularidad
  const allTags = Object.keys(tagCounts).sort((a, b) => {
    const countDiff = tagCounts[b] - tagCounts[a];
    if (countDiff !== 0) return countDiff;
    return a.localeCompare(b);
  });
  
  // Filtrar posts (el backend ya filtra por search y tag principal)
  const filteredPosts = publishedPosts.filter(p => {
    const matchesTags = selectedTags.length === 0 
      ? true 
      : p.tags.some(tag => selectedTags.includes(tag.name));
      
    return matchesTags;
  });

  // Ordenar posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortOrder) {
      case 'newest':
        return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime();
      case 'oldest':
        return new Date(a.publishedAt || 0).getTime() - new Date(b.publishedAt || 0).getTime();
      case 'alpha_asc':
        return a.title.localeCompare(b.title);
      case 'alpha_desc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const getGradient = (id: string) => {
    const gradients = [
      'bg-gradient-to-br from-[#0B1F3B] to-[#123B7A]',
      'bg-gradient-to-br from-[#123B7A] to-[#0077b5]',
      'bg-gradient-to-br from-[#0B1F3B] to-[#FFC83D]',
      'bg-gradient-to-br from-[#FFC83D] to-[#FFD660]',
    ];
    return gradients[parseInt(id) % gradients.length];
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageTransition className="bg-brand-alt min-h-screen">
      {/* Blog Header */}
      <div className="bg-brand-navy text-center px-4 relative overflow-hidden pt-36 pb-32">
         <div className="absolute inset-0 z-0 bg-gradient-to-b from-brand-navy via-brand-navy to-brand-blue/30"></div>
         <div className="absolute inset-0 opacity-10 bg-hero-pattern z-0"></div>
         
         <FadeInUp className="relative z-10 max-w-4xl mx-auto">
           <Badge variant="gold" className="mb-4 bg-white/10 text-brand-gold border-brand-gold/20">Recursos para PYMEs</Badge>
           <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Blog & Insights Estratégicos</h1>
           <p className="text-brand-light/80 text-lg md:text-xl max-w-2xl mx-auto font-light">
             Artículos prácticos sobre finanzas, impuestos y gestión para dueños que quieren tomar el control.
           </p>
         </FadeInUp>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-20 relative z-20">
        {/* Search & Filters Toolbar */}
        <FadeInUp delay={0.1}>
          <div className="bg-white rounded-2xl shadow-premium p-6 mb-12 border border-brand-border">
            
            {/* Top Row: Search */}
            <div className="mb-6">
               <div className="relative w-full">
                <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-graySec h-5 w-5" />
                <Input 
                  type="text" 
                  placeholder="Buscar artículos por título o palabra clave..." 
                  className="pl-11 border-brand-border bg-white text-brand-navy w-full" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Bottom Row: Filters & Sort */}
            <div className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-start border-t border-brand-border/50 pt-6">
              
              {/* Tags Filter */}
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold text-brand-graySec uppercase tracking-wider">Explorar por temas</p>
                  {selectedTags.length > 0 && (
                     <span className="text-xs text-brand-blue font-semibold">{selectedTags.length} seleccionados</span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setSelectedTags([])}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all border ${
                      selectedTags.length === 0 
                        ? 'bg-brand-navy text-white border-brand-navy shadow-md ring-2 ring-brand-navy/20' 
                        : 'bg-white text-brand-graySec border-brand-border hover:bg-brand-light hover:border-brand-graySec/30'
                    }`}
                  >
                    Todos
                  </button>
                  {allTags.map(tag => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button 
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all border capitalize flex items-center gap-2 group ${
                          isSelected 
                            ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/40 shadow-sm ring-1 ring-brand-blue/20' 
                            : 'bg-white text-brand-graySec border-brand-border hover:bg-brand-light hover:border-brand-graySec/30'
                        }`}
                      >
                        {isSelected && <Icons.CheckCircle2 size={14} className="text-brand-blue" />}
                        {tag}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white text-brand-blue' : 'bg-brand-alt text-brand-graySec group-hover:bg-white'}`}>
                           {tagCounts[tag]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="w-full lg:w-64 flex-shrink-0">
                <p className="text-xs font-bold text-brand-graySec uppercase tracking-wider mb-3">Ordenar por</p>
                <Select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  options={[
                    { value: 'newest', label: 'Más recientes' },
                    { value: 'oldest', label: 'Más antiguos' },
                    { value: 'alpha_asc', label: 'Título (A-Z)' },
                    { value: 'alpha_desc', label: 'Título (Z-A)' },
                  ]}
                  className="bg-brand-alt"
                />
              </div>
            </div>
            
            {/* Active Filters Summary */}
            {(search || selectedTags.length > 0) && (
              <div className="mt-6 pt-4 border-t border-brand-border/50 flex items-center justify-between text-sm bg-brand-light/30 -mx-6 -mb-6 p-4 rounded-b-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                <span className="text-brand-graySec">
                  Se encontraron <strong>{sortedPosts.length}</strong> artículo{sortedPosts.length !== 1 && 's'}
                </span>
                <button 
                  onClick={() => { setSearch(''); setSelectedTags([]); setSortOrder('newest'); }}
                  className="text-brand-gold hover:text-brand-goldHover font-semibold flex items-center gap-1 transition-colors"
                >
                  Limpiar filtros <Icons.X size={14} />
                </button>
              </div>
            )}
          </div>
        </FadeInUp>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-blue border-r-transparent"></div>
              <p className="mt-4 text-brand-graySec">Cargando artículos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="text-brand-blue hover:underline font-bold">
                Reintentar
              </button>
            </div>
          ) : sortedPosts.length > 0 ? (
            <StaggerContainer 
              key={`${sortOrder}-${selectedTags.join(',')}-${search}`} 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {sortedPosts.map(post => (
                <StaggerItem key={post.id}>
                  <Card 
                    className="overflow-hidden flex flex-col group h-full hover:shadow-premium-hover border-transparent hover:border-brand-blue/20 transition-all duration-300 cursor-pointer"
                    onClick={() => onNavigate(post.slug)}
                  >
                    <div className={`h-52 relative overflow-hidden ${getGradient(post.id)}`}>
                       <div className="w-full h-full flex items-center justify-center text-white/20 group-hover:scale-105 transition-transform duration-500">
                         <Icons.FileText className="h-16 w-16" />
                       </div>
                       <div className="absolute top-4 left-4 flex gap-2">
                          {post.tags.slice(0, 2).map(t => (
                             <Badge key={t.slug} variant="default" className="bg-white/95 backdrop-blur text-brand-navy shadow-sm font-bold border-0 capitalize">{t.name}</Badge>
                          ))}
                       </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col bg-white">
                      <div className="flex items-center gap-2 mb-3">
                         <Icons.Calendar className="w-3 h-3 text-brand-graySec" />
                         <span className="text-xs text-brand-graySec font-semibold uppercase tracking-wider">
                           {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('es-AR', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Sin fecha'}
                         </span>
                      </div>
                      <h3 className="text-xl font-bold text-brand-navy mb-3 leading-tight group-hover:text-brand-blue transition-colors">{post.title}</h3>
                      <p className="text-brand-graySec text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">{post.excerpt || 'Sin descripción'}</p>
                      <div className="flex justify-between items-center mt-auto pt-6 border-t border-brand-border">
                        <span className="text-sm font-bold text-brand-navy flex items-center gap-2 group-hover:gap-3 transition-all">
                          Leer artículo <Icons.ArrowRight size={16} className="text-brand-gold" />
                        </span>
                      </div>
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <FadeInUp className="text-center py-20 flex flex-col items-center">
              <EmptyStateIllustration />
              <p className="text-brand-graySec text-lg mt-6">No se encontraron artículos con esos criterios.</p>
              <button onClick={() => { setSearch(''); setSelectedTags([]); setSortOrder('newest'); }} className="mt-4 text-brand-gold hover:underline font-bold">Limpiar filtros</button>
            </FadeInUp>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

const BlogDetailPage: React.FC<{ slug: string; onCtaClick: () => void; onBack: () => void; onNavigate: (slug: string) => void }> = ({ slug, onCtaClick, onBack, onNavigate }) => {
  // Usar hook para cargar el post desde Supabase
  const { post, loading, error } = usePost(slug);
  
  // Cargar posts relacionados (del mismo tag)
  const { posts: allPosts } = usePosts({ pageSize: 100 });
  const relatedPosts = post 
    ? allPosts.filter(p => 
        p.id !== post.id && 
        p.tags.some(t => post.tags.some(pt => pt.slug === t.slug))
      ).slice(0, 3)
    : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <PageTransition className="pt-32 pb-20 bg-brand-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 animate-pulse space-y-6 pt-12">
          <div className="h-8 bg-brand-light rounded w-3/4"></div>
          <div className="h-4 bg-brand-light rounded w-1/4"></div>
          <div className="h-64 bg-brand-light rounded w-full"></div>
          <div className="space-y-3">
            <div className="h-4 bg-brand-light rounded w-full"></div>
            <div className="h-4 bg-brand-light rounded w-full"></div>
            <div className="h-4 bg-brand-light rounded w-3/4"></div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error || !post) {
    return (
      <PageTransition className="pt-32 pb-20 bg-brand-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-red-500 mb-4">{error || 'Post no encontrado'}</p>
          <button onClick={onBack} className="text-brand-blue underline font-bold">Volver al blog</button>
        </div>
      </PageTransition>
    );
  }
  
  // Sharing URLs
  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://cdr.com.ar/blog/${slug}`;
  const shareTextBase = `Acabo de leer este artículo sobre "${post.title}" de CDR. Muy recomendado para dueños de PYMEs.`;
  const shareTextWhatsApp = `¡Hola! Mirá este artículo interesante de CDR: "${post.title}"`;
  
  const linkedinShareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareTextBase + " " + currentUrl)}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(shareTextWhatsApp)} ${encodeURIComponent(currentUrl)}`;

  return (
    <PageTransition className="pt-32 pb-20 bg-brand-white min-h-screen">
      {/* Reading Progress Bar (Simulated) */}
      <div className="fixed top-0 left-0 w-full h-1 bg-brand-light z-50 mt-[72px]">
        <div className="h-full bg-brand-gold w-1/3"></div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <button onClick={onBack} className="flex items-center text-brand-graySec hover:text-brand-navy mb-8 transition-colors text-sm font-medium group">
          <Icons.ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Volver al blog
        </button>
            
            <header className="mb-10">
              <div className="flex gap-2 mb-6">
                {post.tags.map(tag => (
                  <Badge key={tag.slug} variant="default">{tag.name}</Badge>
                ))}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-brand-navy mb-6 leading-tight">{post.title}</h1>
              <div className="flex items-center justify-between border-y border-brand-border py-4">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-full bg-brand-navy flex items-center justify-center text-white font-bold text-xs">CDR</div>
                   <div>
                      <p className="text-sm font-bold text-brand-navy">Equipo CDR</p>
                      <p className="text-xs text-brand-graySec">{new Date(post.publishedAt).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })} • 5 min de lectura</p>
                   </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => window.open(linkedinShareUrl, '_blank')}
                    className="p-2 rounded-full bg-brand-light text-brand-blue hover:bg-[#0077b5] hover:text-white transition-colors" 
                    aria-label="Compartir en LinkedIn"
                    title="Compartir en LinkedIn"
                  >
                    <Icons.Linkedin className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => window.open(whatsappShareUrl, '_blank')}
                    className="p-2 rounded-full bg-brand-light text-brand-blue hover:bg-[#25D366] hover:text-white transition-colors"
                    aria-label="Compartir en WhatsApp"
                    title="Compartir en WhatsApp"
                  >
                    <Icons.MessageCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </header>

            {/* Inline CTA Compact */}
            <FadeInUp className="mb-10 p-4 bg-brand-light/50 border-l-4 border-brand-gold rounded-r-lg flex items-center justify-between gap-4">
               <p className="text-sm font-medium text-brand-navy">¿Necesitás ayuda con este tema en tu empresa?</p>
               <Button onClick={onCtaClick} size="sm" variant="outline" className="whitespace-nowrap">Agendar 30 min</Button>
            </FadeInUp>

            <div className="prose prose-lg prose-slate max-w-none mb-16">
              <p className="lead text-xl text-brand-gray leading-relaxed font-medium mb-8">
                {post.excerpt}
              </p>
              {/* Content */}
              {post.contentMarkdown.split('\n').map((line, idx) => {
                if (line.startsWith('# ')) return <h2 key={idx} className="text-3xl font-bold text-brand-navy mt-10 mb-6">{line.replace('# ', '')}</h2>;
                if (line.startsWith('## ')) return <h3 key={idx} className="text-2xl font-bold text-brand-navy mt-8 mb-4">{line.replace('## ', '')}</h3>;
                if (line.startsWith('### ')) return <h4 key={idx} className="text-xl font-bold text-brand-navy mt-6 mb-3">{line.replace('### ', '')}</h4>;
                if (line.startsWith('* ')) return <ul key={idx}><li className="ml-4 list-disc text-brand-gray mb-2 pl-2 marker:text-brand-gold">{line.replace('* ', '')}</li></ul>;
                if (line.trim() === '') return <br key={idx} />;
                return <p key={idx} className="mb-5 text-brand-gray leading-loose">{line}</p>;
              })}
            </div>

            {/* CTA Bottom Large */}
            <Card className="bg-gradient-to-br from-brand-navy to-brand-blue text-white p-10 text-center mb-16 border-none shadow-premium relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">¿Te identificás con esto?</h3>
              <p className="mb-8 text-brand-light/80 max-w-lg mx-auto relative z-10">No dejes que la falta de estrategia limite tu crecimiento. Una charla de 30 minutos puede ahorrarte años de errores.</p>
              <Button onClick={onCtaClick} variant="primary" size="lg" className="shadow-lg relative z-10">Agendá reunión gratuita</Button>
            </Card>

            {/* Related */}
            {relatedPosts.length > 0 && (
              <div className="border-t border-brand-border pt-12">
                <h3 className="text-2xl font-bold text-brand-navy mb-8">Seguir leyendo</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map(p => (
                    <div key={p.id} className="cursor-pointer group" onClick={() => onNavigate(p.slug)}>
                       <div className="h-32 bg-brand-light rounded-xl mb-3 overflow-hidden">
                          <div className="w-full h-full bg-brand-navy/5 group-hover:scale-105 transition-transform duration-500"></div>
                       </div>
                      <h4 className="font-bold text-base text-brand-navy group-hover:text-brand-gold transition-colors mb-2 leading-tight">{p.title}</h4>
                      <p className="text-xs text-brand-graySec line-clamp-2">{p.excerpt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
    </PageTransition>
  );
};

// 4. Admin Layout
const AdminLayout: React.FC<{ children: React.ReactNode; onLogout: () => void }> = ({ children, onLogout }) => (
  <div className="min-h-screen bg-brand-alt flex font-sans">
    <aside className="w-64 bg-brand-navy text-brand-border flex-shrink-0 hidden md:flex flex-col border-r border-brand-blue/30 relative overflow-hidden">
      {/* Abstract sidebar bg */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-brand-blue/20 to-transparent"></div>
      
      <div className="p-6 flex items-center gap-2 relative z-10">
         <div className="h-6 w-6 bg-brand-gold rounded-full"></div>
         <span className="text-xl font-bold text-white tracking-tighter">CDR Admin</span>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4 relative z-10">
        <a href="#admin" className="flex items-center gap-3 px-4 py-3 bg-brand-blue/50 text-white rounded-xl shadow-sm border border-brand-blue/30">
          <Icons.FileText size={18} /> Posts
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-brand-border/60 cursor-not-allowed">
          <Icons.LayoutDashboard size={18} /> Dashboard
        </a>
      </nav>
      <div className="p-4 border-t border-brand-blue/30 relative z-10">
        <button onClick={onLogout} className="flex items-center gap-2 text-sm text-brand-border hover:text-white w-full px-4 py-2 transition-colors">
          <Icons.LogOut size={16} /> Cerrar sesión
        </button>
      </div>
    </aside>
    <main className="flex-1 overflow-y-auto">
      {children}
    </main>
  </div>
);


// --- Main Application Component ---

const App: React.FC = () => {
  const [route, setRoute] = useState<PageRoute>({ path: 'landing' });
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const adminPosts = useAdminPosts();
  const currentPost = useAdminPost((route as any).id);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          const isUserAdmin = await authService.isAdmin();
          setIsAdmin(isUserAdmin);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, []);

  // History-based Router
  useEffect(() => {
    const handleRouteChange = () => {
      // Get pathname without leading '/'
      const pathname = window.location.pathname.slice(1);
      
      // Default to landing if pathname is empty
      if (!pathname) {
        setRoute({ path: 'landing' });
        window.scrollTo(0,0);
        return;
      }
      
      // Handle Landing anchors (scroll is handled in LandingPage component)
      if (pathname.startsWith('landing') || pathname === 'services' || pathname === 'process') {
        setRoute({ path: 'landing' });
        return;
      }

      if (pathname === 'about') {
        setRoute({ path: 'about' });
      } else if (pathname === 'blog') {
        setRoute({ path: 'blog-list' });
      } else if (pathname.startsWith('blog/')) {
        const slug = pathname.split('/')[1];
        setRoute({ path: 'blog-detail', slug });
      } else if (pathname === 'test-salud') {
        setRoute({ path: 'test-salud' });
      } else if (pathname.startsWith('admin')) {
        // Si no está logueado y no es la ruta de admin base, redirigir
        if (!isAdmin && pathname !== 'admin') {
           window.history.pushState(null, '', '/admin');
           setRoute({ path: 'admin-login' });
           return;
        }
        
        // Si está en /admin y no está logueado, mostrar login
        if (pathname === 'admin' && !isAdmin) {
          setRoute({ path: 'admin-login' });
        }
        // Si está en /admin y está logueado, mostrar posts
        else if (pathname === 'admin' && isAdmin) {
          setRoute({ path: 'admin-posts' });
        }
        else if (pathname === 'admin/posts') setRoute({ path: 'admin-posts' });
        else if (pathname === 'admin/posts/new') setRoute({ path: 'admin-post-edit' });
        else if (pathname.startsWith('admin/posts/')) {
           setRoute({ path: 'admin-post-edit', id: pathname.split('/')[2] });
        }
      } else {
        // Fallback for unknown routes
        setRoute({ path: 'landing' });
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    // Initial check
    handleRouteChange();
    
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [isAdmin]);

  const navigate = (path: string) => {
    if (path === 'landing') {
      if (window.location.pathname === '/' || window.location.pathname === '') {
         window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
         window.history.pushState(null, '', '/');
         window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
    else if (path === 'about') {
      window.history.pushState(null, '', '/about');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    else if (path === 'blog-list') {
      window.history.pushState(null, '', '/blog');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    else if (path.startsWith('blog-detail')) {
      window.history.pushState(null, '', `/blog/${(route as any).slug}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    else if (path === 'admin-login' || path === 'admin-posts') {
      window.history.pushState(null, '', '/admin');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    else {
      window.history.pushState(null, '', `/${path}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };
  
  const goToSlug = (slug: string) => {
    window.history.pushState(null, '', `/blog/${slug}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  // Handle admin login
  const handleAdminLogin = async (email: string, password: string) => {
    setIsLoggingIn(true);
    setLoginError('');
    
    try {
      const user = await authService.signIn(email, password);
      const isUserAdmin = await authService.isAdmin();
      
      if (!isUserAdmin) {
        await authService.signOut();
        setLoginError('Usuario no autorizado como administrador');
        return;
      }
      
      setIsAdmin(true);
      window.history.pushState(null, '', '/admin');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (error) {
      console.error('Error en login:', error);
      setLoginError(error instanceof Error ? error.message : 'Error al iniciar sesión');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle admin logout
  const handleAdminLogout = async () => {
    try {
      await authService.signOut();
      setIsAdmin(false);
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  // Handle admin post save
  const handleAdminPostSave = async (data: PostFormData, isDraft: boolean) => {
    const postId = (route as any).id;
    
    if (postId) {
      // Update existing post
      await adminPosts.updatePost(postId, {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        contentMarkdown: data.contentMarkdown,
        coverImageUrl: data.coverImageUrl,
        category: data.category,
        tags: data.tags,
        seoMeta: data.seoTitle || data.seoDescription ? {
          title: data.seoTitle,
          description: data.seoDescription,
        } : undefined,
        status: isDraft ? 'draft' : 'published',
      }, isDraft);
    } else {
      // Create new post
      await adminPosts.createPost({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        contentMarkdown: data.contentMarkdown,
        coverImageUrl: data.coverImageUrl,
        category: data.category,
        tags: data.tags,
        seoMeta: data.seoTitle || data.seoDescription ? {
          title: data.seoTitle,
          description: data.seoDescription,
        } : undefined,
        status: isDraft ? 'draft' : 'published',
      }, isDraft);
    }
    
    // Navigate back to list
    window.history.pushState(null, '', '/admin');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  // Handle toggle publish
  const handleTogglePublish = async (postId: string, currentStatus: 'draft' | 'published') => {
    if (currentStatus === 'published') {
      await adminPosts.unpublishPost(postId);
    } else {
      await adminPosts.publishPost(postId);
    }
  };

  // Admin Render Logic
  if (route.path.startsWith('admin')) {
    // Show loading while checking auth
    if (isCheckingAuth) {
      return (
        <div className="min-h-screen bg-brand-navy flex items-center justify-center">
          <div className="text-white text-lg">Verificando autenticación...</div>
        </div>
      );
    }
    
    if (route.path === 'admin-login') {
      return (
        <div className="min-h-screen bg-brand-navy flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-blue opacity-20 bg-[radial-gradient(#FFC83D_1px,transparent_1px)] bg-[length:30px_30px]"></div>
          <FadeInUp>
            <AdminLogin 
              onLogin={handleAdminLogin} 
              error={loginError} 
              isLoading={isLoggingIn}
            />
          </FadeInUp>
        </div>
      );
    }
    
    return (
      <AdminLayout onLogout={handleAdminLogout}>
        <AnimatePresence mode="wait">
          <PageTransition key={route.path}>
            {route.path === 'admin-posts' && (
              <AdminPostListComponent
                posts={adminPosts.posts}
                isLoading={adminPosts.isLoading}
                onEdit={(id) => {
                  window.history.pushState(null, '', `/admin/posts/${id}`);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                onDelete={(id) => adminPosts.deletePost(id)}
                onTogglePublish={handleTogglePublish}
                onCreateNew={() => {
                  window.history.pushState(null, '', '/admin/posts/new');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
              />
            )}
            {route.path === 'admin-post-edit' && (
              <AdminPostEditorComponent
                initialData={currentPost.post ? {
                  title: currentPost.post.title,
                  slug: currentPost.post.slug,
                  excerpt: currentPost.post.excerpt || '',
                  contentMarkdown: currentPost.post.contentMarkdown,
                  coverImageUrl: currentPost.post.coverImageUrl || '',
                  category: currentPost.post.tags?.[0]?.name || '',
                  tags: currentPost.post.tags?.map((t: any) => t.name || t) || [],
                  seoTitle: currentPost.post.seoMeta?.title || '',
                  seoDescription: currentPost.post.seoMeta?.description || '',
                  readingTimeMin: currentPost.post.readingTimeMin || 0,
                } : undefined}
                isLoading={currentPost.isLoading}
                onSave={handleAdminPostSave}
                onCancel={() => {
                  window.history.pushState(null, '', '/admin');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
              />
            )}
          </PageTransition>
        </AnimatePresence>
      </AdminLayout>
    );
  }

  return (
    <div className="bg-brand-white min-h-screen font-sans selection:bg-brand-gold/30 selection:text-brand-navy">
      <Header 
        onNavigate={(p) => navigate(p)} 
        onCtaClick={() => setIsCalendlyOpen(true)} 
        forceBackground={route.path === 'blog-list' || route.path === 'blog-detail'}
      />
      
      <main>
        <AnimatePresence mode="wait">
          {/* Key on route.path ensures exit animations play */}
          <div key={route.path}>
            {route.path === 'landing' && <LandingPage onCtaClick={() => setIsCalendlyOpen(true)} />}
            {route.path === 'about' && <AboutPage onCtaClick={() => setIsCalendlyOpen(true)} />}
            {route.path === 'blog-list' && <BlogListPage onNavigate={goToSlug} />}
            {route.path === 'blog-detail' && (
              <BlogDetailPage 
                slug={(route as any).slug} 
                onCtaClick={() => setIsCalendlyOpen(true)} 
                onBack={() => {
                  window.history.pushState(null, '', '/blog');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                onNavigate={goToSlug}
              />
            )}
            {route.path === 'test-salud' && (
              <PageTransition className="pt-24 pb-20 px-4 max-w-4xl mx-auto min-h-screen flex flex-col justify-center">
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-bold text-brand-navy mb-4">Calculadora de Salud Financiera</h1>
                  <p className="text-brand-graySec">Herramienta de diagnóstico rápido para PYMEs.</p>
                </div>
                <HealthTest onCtaClick={() => setIsCalendlyOpen(true)} standalone />
              </PageTransition>
            )}
          </div>
        </AnimatePresence>
      </main>

      {/* Footer logic: show everywhere */}
      <Footer onNavigate={(p) => navigate(p)} />
      
      <StickyMobileCTA 
        onCtaClick={() => setIsCalendlyOpen(true)} 
        onTestClick={route.path === 'landing' ? () => document.getElementById('health-test')?.scrollIntoView({ behavior: 'smooth' }) : undefined}
      />
      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </div>
  );
};

export default App;