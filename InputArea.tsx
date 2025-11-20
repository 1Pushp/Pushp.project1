
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useCallback, useState, useEffect } from 'react';
import { QrCodeIcon, BeakerIcon, ClipboardDocumentListIcon, ShieldCheckIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

type UserRole = 'manufacturer' | 'pharmacist' | 'patient';

interface User {
  name: string;
  role: UserRole;
  companyName?: string;
}

interface InputAreaProps {
  onGenerate: (prompt: string, file?: File) => void;
  isGenerating: boolean;
  disabled?: boolean;
  user: User;
}

const CyclingText = ({ role }: { role: UserRole }) => {
    const textMap = {
        manufacturer: ["Batch Sheet", "Recall Monitor", "Sales Dashboard", "Delivery Tracker"],
        pharmacist: ["Invoice", "Recall Check", "Safety Video", "Trend Analytics"],
        patient: ["Medicine Box", "Dosage Plan", "Safety Score", "Prescription"]
    };
    
    const words = textMap[role];
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        setIndex(0); // Reset when role changes
    }, [role]);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false); 
            setTimeout(() => {
                setIndex(prev => (prev + 1) % words.length);
                setFade(true); 
            }, 500); 
        }, 3000); 
        return () => clearInterval(interval);
    }, [words.length, role]);

    const colors = {
        manufacturer: "text-blue-300 border-blue-500/50",
        pharmacist: "text-teal-300 border-teal-500/50",
        patient: "text-indigo-300 border-indigo-500/50"
    };

    return (
        <span className={`inline-block whitespace-nowrap transition-all duration-500 transform ${fade ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-2 blur-sm'} ${colors[role]} font-bold pb-1 border-b-2`}>
            {words[index]}
        </span>
    );
};

export const InputArea: React.FC<InputAreaProps> = ({ onGenerate, isGenerating, disabled = false, user }) => {
  const [isDragging, setIsDragging] = useState(false);

  const getRoleStyles = () => {
    switch (user.role) {
        case 'manufacturer': return {
            border: 'border-blue-500',
            bgDrag: 'bg-blue-900/10',
            shadow: 'shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]',
            textHover: 'text-blue-400',
            icon: BeakerIcon
        };
        case 'pharmacist': return {
            border: 'border-teal-500',
            bgDrag: 'bg-teal-900/10',
            shadow: 'shadow-[inset_0_0_20px_rgba(20,184,166,0.1)]',
            textHover: 'text-teal-400',
            icon: ClipboardDocumentListIcon
        };
        case 'patient': return {
            border: 'border-indigo-500',
            bgDrag: 'bg-indigo-900/10',
            shadow: 'shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]',
            textHover: 'text-indigo-400',
            icon: ShieldCheckIcon
        };
    }
  };

  const styles = getRoleStyles();
  const RoleIcon = styles.icon;

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/') || file.type === 'application/pdf' || file.type.startsWith('video/')) {
      onGenerate("", file);
    } else {
      alert("Please upload an image, video, or PDF document.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isGenerating) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [disabled, isGenerating]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (!disabled && !isGenerating) {
        setIsDragging(true);
    }
  }, [disabled, isGenerating]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto perspective-1000">
      <div 
        className={`relative group transition-all duration-300 ${isDragging ? 'scale-[1.01]' : ''}`}
      >
        <label
          className={`
            relative flex flex-col items-center justify-center
            h-56 sm:h-64 md:h-[22rem]
            bg-zinc-900/30 
            backdrop-blur-sm
            rounded-xl border border-dashed
            cursor-pointer overflow-hidden
            transition-all duration-300
            ${isDragging 
              ? `${styles.border} ${styles.bgDrag} ${styles.shadow}` 
              : `border-zinc-700 hover:${styles.border}/50 hover:bg-zinc-900/40`
            }
            ${isGenerating ? 'pointer-events-none' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
            {/* Technical Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px'}}>
            </div>
            
            {/* Corner Brackets */}
            <div className={`absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 transition-colors duration-300 ${isDragging ? styles.border : 'border-zinc-600'}`}></div>
            <div className={`absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 transition-colors duration-300 ${isDragging ? styles.border : 'border-zinc-600'}`}></div>
            <div className={`absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 transition-colors duration-300 ${isDragging ? styles.border : 'border-zinc-600'}`}></div>
            <div className={`absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 transition-colors duration-300 ${isDragging ? styles.border : 'border-zinc-600'}`}></div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-6 md:space-y-8 p-4 md:p-8 w-full">
                <div className={`relative w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center transition-transform duration-500 ${isDragging ? 'scale-110' : 'group-hover:-translate-y-1'}`}>
                    <div className={`absolute inset-0 rounded-2xl bg-zinc-800 border border-zinc-700 shadow-xl flex items-center justify-center ${isGenerating ? 'animate-pulse' : ''}`}>
                        {isGenerating ? (
                            <div className={`w-7 h-7 md:w-10 md:h-10 border-4 ${styles.textHover} border-t-transparent rounded-full animate-spin`}></div>
                        ) : (
                            <RoleIcon className={`w-7 h-7 md:w-10 md:h-10 text-zinc-300 transition-all duration-300 ${isDragging ? `-translate-y-1 ${styles.textHover}` : ''}`} />
                        )}
                    </div>
                </div>

                <div className="space-y-2 md:space-y-4 w-full max-w-3xl">
                    <h3 className="flex flex-col items-center justify-center text-lg sm:text-2xl md:text-4xl text-zinc-100 leading-none font-bold tracking-tighter gap-2 md:gap-3">
                        <span>
                            {user.role === 'manufacturer' ? 'Upload Production Data' : 
                             user.role === 'pharmacist' ? 'Scan Inventory or Upload Video' : 
                             'Check Authenticity'}
                        </span>
                        {/* Fixed height container */}
                        <div className="h-8 sm:h-10 md:h-14 flex items-center justify-center w-full">
                           <CyclingText role={user.role} />
                        </div>
                    </h3>
                    <p className="text-zinc-500 text-xs sm:text-base md:text-lg font-light tracking-wide">
                        <span className="md:hidden">Tap</span>
                        <span className="hidden md:inline">Drag & Drop</span> to {user.role === 'manufacturer' ? 'generate QR' : user.role === 'pharmacist' ? 'verify or upload guide' : 'verify'}
                        {user.companyName ? <span className="hidden md:inline md:ml-1 opacity-70"> for {user.companyName}</span> : ''}
                    </p>
                </div>
            </div>

            <input
                type="file"
                accept="image/*,application/pdf,video/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isGenerating || disabled}
            />
        </label>
      </div>
    </div>
  );
};
