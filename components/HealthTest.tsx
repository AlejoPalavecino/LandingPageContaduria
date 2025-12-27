import React, { useState } from 'react';
import { Button } from './Button';
import { Input, Select, Card, Badge } from './UI';
import { HealthTestInput, HealthTestResult } from '../types';
import { Icons } from './Icons';
import { motion } from 'framer-motion';

interface HealthTestProps {
  onCtaClick: () => void;
  standalone?: boolean;
}

export const HealthTest: React.FC<HealthTestProps> = ({ onCtaClick, standalone = false }) => {
  const [step, setStep] = useState<'intro' | 'form' | 'result'>('form');
  const [inputs, setInputs] = useState<HealthTestInput>({
    revenue: 0,
    margin: 0,
    runway: '2-3',
    control: 'Parcial'
  });
  const [result, setResult] = useState<HealthTestResult | null>(null);

  const calculateScore = () => {
    let score = 0;
    const cappedMargin = Math.min(inputs.margin, 60);
    score += (cappedMargin / 60) * 30;

    switch (inputs.runway) {
      case '0-1': score += 0; break;
      case '2-3': score += 15; break;
      case '4-6': score += 25; break;
      case '7+': score += 35; break;
    }

    switch (inputs.control) {
      case 'No': score += 0; break;
      case 'Parcial': score += 10; break;
      case 'Sí': score += 25; break;
    }

    if (inputs.revenue > 0) score += 10;

    let category: HealthTestResult['category'] = 'stable';
    let message = '';

    if (score < 40) {
      category = 'critical';
      message = 'Tenés que coordinar una reunión ya antes de que la falta de control te cueste caja e impuestos.';
    } else if (score < 70) {
      category = 'risk';
      message = 'Hay señales de alerta. Con planificación fiscal y financiera podés evitar decisiones caras.';
    } else {
      category = 'stable';
      message = 'Vas bien, pero podés ganar previsibilidad y rentabilidad con estrategia y control.';
    }

    setResult({ score: Math.round(score), category, message });
    setStep('result');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: name === 'revenue' || name === 'margin' ? Number(value) : value
    }));
  };

  return (
    <Card className={`overflow-hidden border-0 shadow-premium ${standalone ? 'max-w-3xl mx-auto my-12' : 'h-full'}`}>
      {/* Widget Header */}
      <div className="bg-brand-navy p-6 md:p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
           <div className="flex items-center gap-2 mb-2">
             <Badge variant="gold" className="bg-brand-gold/20 text-brand-gold border-brand-gold/30">Diagnóstico Express</Badge>
           </div>
           <h3 className="text-2xl font-bold tracking-tight">Test de Salud Financiera</h3>
           <p className="text-brand-border/70 mt-2 text-sm max-w-md">
             Evaluamos 4 indicadores clave para darte un semáforo de la situación actual de tu empresa. 100% Confidencial.
           </p>
        </div>
        {/* Decorative circle */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-blue rounded-full opacity-30 blur-2xl"></div>
      </div>
      
      <div className="p-6 md:p-8 bg-white">
        {step === 'form' ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Facturación mensual (promedio)"
                helperText="Puede ser en ARS o USD."
                type="number"
                name="revenue"
                min="0"
                placeholder="Ej: 10000"
                onChange={handleInputChange}
              />
              <Input
                label="Margen neto estimado (%)"
                helperText="Lo que te queda limpio post-impuestos."
                type="number"
                name="margin"
                min="0"
                max="100"
                placeholder="0 - 60"
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Meses de caja (Runway)"
                name="runway"
                value={inputs.runway}
                onChange={handleInputChange}
                options={[
                  { value: '0-1', label: '0 a 1 mes (Vivo al día)' },
                  { value: '2-3', label: '2 a 3 meses' },
                  { value: '4-6', label: '4 a 6 meses' },
                  { value: '7+', label: '7 meses o más' },
                ]}
              />
              <Select
                label="¿Tenés control financiero?"
                name="control"
                value={inputs.control}
                onChange={handleInputChange}
                options={[
                   { value: 'No', label: 'No, solo miro el banco' },
                   { value: 'Parcial', label: 'Parcial (Excel básico)' },
                   { value: 'Sí', label: 'Sí, reportes y KPIs claros' },
                ]}
              />
            </div>
            
            <div className="pt-4">
               <Button onClick={calculateScore} fullWidth size="lg">
                Ver mi resultado
              </Button>
              <p className="text-center text-xs text-brand-graySec mt-3 flex items-center justify-center gap-1">
                <Icons.Info size={14}/> No guardamos tus datos.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-4"
          >
            <div className="flex justify-center mb-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className={`p-4 rounded-full bg-opacity-10 ${
                   result?.category === 'critical' ? 'bg-red-500' :
                   result?.category === 'risk' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              >
                {result?.category === 'critical' && <Icons.AlertTriangle className="w-12 h-12 text-red-600" />}
                {result?.category === 'risk' && <Icons.AlertCircle className="w-12 h-12 text-amber-600" />}
                {result?.category === 'stable' && <Icons.CheckCircle2 className="w-12 h-12 text-emerald-600" />}
              </motion.div>
            </div>
            
            <h4 className="text-2xl font-bold text-brand-navy mb-1">
              {result?.category === 'critical' && 'Salud Crítica'}
              {result?.category === 'risk' && 'En Riesgo'}
              {result?.category === 'stable' && 'Estable'}
            </h4>
            <p className="text-brand-graySec text-sm font-medium mb-6 uppercase tracking-wide">Score: {result?.score}/100</p>
            
            {/* Animated Progress Bar */}
            <div className="w-full bg-brand-light rounded-full h-3 mb-8 overflow-hidden">
              <motion.div 
                className={`h-full rounded-full ${
                  result?.category === 'critical' ? 'bg-red-500' :
                  result?.category === 'risk' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${result?.score}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>

            <Card className="bg-brand-alt border-brand-blue/10 p-5 mb-8 text-left shadow-none">
               <p className="text-brand-gray text-lg leading-relaxed font-medium">
                 {result?.message}
               </p>
            </Card>

            <Button onClick={onCtaClick} fullWidth size="lg" className="mb-4">
              Agendá reunión estratégica <Icons.ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            
            <button 
              onClick={() => setStep('form')}
              className="text-sm text-brand-graySec hover:text-brand-navy flex items-center justify-center gap-2 mx-auto transition-colors mt-6"
            >
              <Icons.RefreshCw size={14} /> Volver a calcular
            </button>
          </motion.div>
        )}
      </div>
       {standalone && (
          <div className="bg-brand-alt p-6 border-t border-brand-border">
             <h4 className="text-sm font-bold text-brand-navy mb-2">¿Cómo calculamos esto?</h4>
             <p className="text-xs text-brand-graySec leading-relaxed">
               Ponderamos tu margen neto (30%), runway (35%), nivel de control (25%) y tracción (10%). Esta métrica es una simplificación para diagnóstico rápido y no reemplaza una auditoría completa.
             </p>
          </div>
       )}
    </Card>
  );
};