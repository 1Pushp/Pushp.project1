/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState } from 'react';
import { BuildingOffice2Icon, QrCodeIcon, TruckIcon, MapIcon, BuildingStorefrontIcon, ClipboardDocumentCheckIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface HeroProps {
    compact?: boolean;
}

const DrawingTransformation = ({ 
  initialIcon: InitialIcon, 
  finalIcon: FinalIcon, 
  label,
  delay, 
  x, 
  y,
  rotation = 0
}: { 
  initialIcon: React.ElementType, 
  finalIcon: React.ElementType, 
  label: string,
  delay: number,
  x: string,
  y: string,
  rotation?: number
}) => {
  const [stage, setStage] = useState(0); // 0: Hidden, 1: Drawing, 2: Alive

  useEffect(() => {
    const cycle = () => {
      setStage(0);
      setTimeout(() => setStage(1), 500); 
      setTimeout(() => setStage(2), 3500); 
    };

    const startTimeout = setTimeout(() => {
      cycle();
      const interval = setInterval(cycle, 9000);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  return (
    <div 
      className="absolute transition-all duration-1000 ease-in-out z-0 pointer-events-none"
      style={{ top: y, left: x, transform: `rotate(${rotation}deg)` }}
    >
      <div className={`relative w-20 h-28 md:w-28 md:h-40 rounded-lg backdrop-blur-md transition-all duration-1000 ${stage === 2 ? 'bg-teal-900/40 border-teal-500/50 shadow-xl scale-110 -translate-y-4' : 'bg-zinc-900/10 border-zinc-800 scale-100 border border-dashed'}`}>
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-100 text-teal-900 border border-teal-200 text-[8px] md:text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm transition-all duration-500 ${stage === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            {label}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`absolute transition-all duration-1000 ${stage === 1 ? 'opacity-100' : 'opacity-0'}`}>
             <InitialIcon className="w-8 h-8 md:w-12 md:h-12 text-zinc-500 stroke-1" />
             <div className="absolute -inset-2 border border-zinc-700/30 opacity-50"></div>
             <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-zinc-500"></div>
             <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-zinc-500"></div>
             <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-zinc-500"></div>
             <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-zinc-500"></div>
          </div>
          <div className={`absolute transition-all duration-700 flex flex-col items-center ${stage === 2 ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-75 blur-sm'}`}>
             <FinalIcon className="w-10 h-10 md:w-14 md:h-14 text-teal-400" />
             {stage === 2 && (
               <div className="mt-3 flex items-center gap-2 px-2 py-1 bg-zinc-900/80 rounded-full border border-zinc-700/50">
                 <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                 <div className="w-8 h-0.5 bg-zinc-700 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 w-2/3 animate-[pulse_1s_infinite]"></div>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Hero: React.FC<HeroProps> = ({ compact = false }) => {
  if (compact) {
    return (
        <div className="flex items-center space-x-2 shrink-0">
            <div className="h-8 w-8 rounded bg-teal-500/10 border border-teal-500/50 flex items-center justify-center">
                <ShieldCheckIcon className="w-5 h-5 text-teal-400" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                Pharma<span className="text-teal-500">-</span>Sure
            </span>
        </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="hidden lg:block">
            <DrawingTransformation initialIcon={BuildingOffice2Icon} finalIcon={QrCodeIcon} label="MANUFACTURING" delay={0} x="4%" y="8%" rotation={-3} />
        </div>
        <div className="hidden md:block">
            <DrawingTransformation initialIcon={BuildingStorefrontIcon} finalIcon={ClipboardDocumentCheckIcon} label="PHARMACY" delay={3000} x="88%" y="75%" rotation={2} />
        </div>
        <div className="hidden lg:block">
            <DrawingTransformation initialIcon={TruckIcon} finalIcon={MapIcon} label="LOGISTICS" delay={6000} x="88%" y="12%" rotation={1} />
        </div>
        <div className="hidden md:block">
            <DrawingTransformation initialIcon={UserIcon} finalIcon={ShieldCheckIcon} label="PATIENT" delay={4500} x="5%" y="72%" rotation={-2} />
        </div>
      </div>

      <div className="text-center relative z-10 max-w-6xl mx-auto px-4 pt-4 md:pt-8">
        <div className="inline-flex items-center space-x-2 bg-teal-900/30 border border-teal-500/30 rounded-full px-3 py-1 mb-4 md:mb-6">
            <ShieldCheckIcon className="w-4 h-4 text-teal-400" />
            <span className="text-teal-200 text-xs font-bold tracking-wide uppercase">System Operational</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-4 md:mb-6 leading-[1.1]">
          Pharma<span className="text-teal-500">-</span>Sure
        </h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl font-medium text-zinc-200 mb-4 px-4">
          Resilient & Authentic Medicine Supply Chains
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-xl md:max-w-2xl mx-auto leading-relaxed font-light px-4">
          Empowering rural healthcare with blockchain-backed authentication. 
        </p>
      </div>
    </>
  );
};