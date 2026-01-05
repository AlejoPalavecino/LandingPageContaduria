import React from 'react';
import { Icons } from './Icons';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendlyModal: React.FC<CalendlyModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm transition-opacity" 
              onClick={onClose}
              aria-hidden="true"
            />

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            {/* Modal Panel */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-white/20"
            >
              <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
                <button
                  type="button"
                  className="bg-white/50 rounded-full p-1 text-brand-graySec hover:text-brand-navy focus:outline-none transition-colors"
                  onClick={onClose}
                >
                  <span className="sr-only">Cerrar</span>
                  <Icons.X className="h-5 w-5" />
                </button>
              </div>

              <div className="bg-white px-4 pt-8 pb-6 sm:p-8">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full bg-brand-light sm:mx-0">
                    <Icons.Calendar className="h-7 w-7 text-brand-blue" />
                  </div>
                  <div className="mt-4 text-center sm:mt-0 sm:ml-5 sm:text-left">
                    <h3 className="text-2xl leading-7 font-bold text-brand-navy" id="modal-title">
                      Agendá tu reunión de 30 minutos
                    </h3>
                    <div className="mt-3">
                      <p className="text-base text-brand-graySec leading-relaxed">
                        Hablemos sobre tu negocio. En esta llamada gratuita analizaremos tu situación actual y te diré si mis servicios de planificación fiscal y CFO Fractional es para vos.
                      </p>
                      
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-8 p-6 bg-gradient-to-r from-brand-blue to-brand-navy rounded-xl border border-brand-gold/30 group hover:border-brand-gold transition-all cursor-pointer shadow-lg" 
                        onClick={() => window.open('https://calendly.com/scordia-asesorfinanciero/30min', '_blank')}
                      >
                         <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">Calendly</p>
                              <span className="text-white font-bold text-xl group-hover:text-brand-gold transition-colors">
                                Ver horarios disponibles
                              </span>
                            </div>
                            <Icons.ExternalLink className="w-6 h-6 text-brand-gold group-hover:scale-110 transition-transform" />
                         </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-brand-alt px-4 py-4 sm:px-8 sm:flex sm:flex-row-reverse border-t border-brand-border">
                <Button onClick={onClose} variant="ghost" className="w-full sm:w-auto">
                  Cancelar
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};