
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { XMarkIcon, ShieldCheckIcon, LockClosedIcon, EyeSlashIcon, ServerIcon, CpuChipIcon } from '@heroicons/react/24/outline';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0E0E10] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 shrink-0 bg-zinc-900/50 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-teal-500/10 rounded-lg border border-teal-500/20">
                <ShieldCheckIcon className="w-6 h-6 text-teal-400" />
            </div>
            <div>
                <h2 className="text-lg font-bold text-white leading-tight">Privacy & Data Protection</h2>
                <p className="text-xs text-zinc-500 font-mono">Protocol: PS-SEC-2024</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500 hover:text-white"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar text-zinc-400 text-sm space-y-8">
           
           <div className="space-y-3">
                <h3 className="text-white font-semibold flex items-center space-x-2">
                    <LockClosedIcon className="w-4 h-4 text-indigo-400" />
                    <span>Data Encryption & User Anonymity</span>
                </h3>
                <p className="leading-relaxed text-zinc-400">
                    Pharma-Sure employs end-to-end encryption for all personal identifiable information (PII). 
                    Patient health data is stored off-chain in HIPAA-compliant secure enclaves. Only cryptographic hashes 
                    of medicine verification events are committed to the public blockchain, ensuring transparency without 
                    compromising individual privacy.
                </p>
           </div>

           <div className="space-y-3">
                <h3 className="text-white font-semibold flex items-center space-x-2">
                    <CpuChipIcon className="w-4 h-4 text-blue-400" />
                    <span>AI Processing & Image Handling</span>
                </h3>
                <p className="leading-relaxed text-zinc-400">
                    Images and videos uploaded for verification (e.g., medicine strips, prescriptions) are processed 
                    ephemerally by our AI engines. 
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-500">
                        <li>We do not retain raw image data after the verification session ends.</li>
                        <li>Data is processed solely for the purpose of extracting batch numbers, expiration dates, and authenticity features.</li>
                        <li>No user content is used to train public AI models.</li>
                    </ul>
                </p>
           </div>

           <div className="space-y-3">
                <h3 className="text-white font-semibold flex items-center space-x-2">
                    <ServerIcon className="w-4 h-4 text-teal-400" />
                    <span>Role-Based Data Access</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                    <div className="p-3 bg-zinc-900/50 rounded border border-zinc-800">
                        <span className="text-xs font-bold text-indigo-300 block mb-1">PATIENTS</span>
                        <p className="text-[10px] leading-tight text-zinc-500">Only access own verification history. Medical adherence data is private.</p>
                    </div>
                    <div className="p-3 bg-zinc-900/50 rounded border border-zinc-800">
                        <span className="text-xs font-bold text-teal-300 block mb-1">PHARMACISTS</span>
                        <p className="text-[10px] leading-tight text-zinc-500">Access to inventory logs and verification certificates. License data is public.</p>
                    </div>
                    <div className="p-3 bg-zinc-900/50 rounded border border-zinc-800">
                        <span className="text-xs font-bold text-blue-300 block mb-1">MANUFACTURERS</span>
                        <p className="text-[10px] leading-tight text-zinc-500">Full visibility into supply chain logistics. No access to end-patient identities.</p>
                    </div>
                </div>
           </div>

           <div className="space-y-3">
                <h3 className="text-white font-semibold flex items-center space-x-2">
                    <EyeSlashIcon className="w-4 h-4 text-red-400" />
                    <span>Third-Party Disclosure</span>
                </h3>
                <p className="leading-relaxed text-zinc-400">
                    We do not sell, trade, or otherwise transfer your PII to outside parties. Aggregated, anonymized 
                    verification data may be shared with public health organizations (e.g., CDSCO, FDA) solely for 
                    detecting counterfeit drug outbreaks and improving supply chain resilience in rural regions.
                </p>
           </div>

        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-zinc-800 shrink-0 bg-zinc-900/30 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-b-2xl">
            <p className="text-[10px] text-zinc-600 text-center sm:text-left">
                Last updated: October 24, 2023
            </p>
            <button 
                onClick={onClose} 
                className="w-full sm:w-auto px-6 py-2 bg-white hover:bg-zinc-200 text-black font-bold text-xs tracking-wide uppercase rounded shadow-lg transition-colors"
            >
                Acknowledge & Close
            </button>
        </div>
      </div>
    </div>
  );
};
