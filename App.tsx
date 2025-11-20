
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { InputArea } from './components/InputArea';
import { LivePreview } from './components/LivePreview';
import { CreationHistory, Creation } from './components/CreationHistory';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { ChatInterface } from './components/ChatInterface';
import { bringToLife } from './services/gemini';
import { 
  ArrowUpTrayIcon, 
  QrCodeIcon, 
  TruckIcon, 
  BuildingStorefrontIcon, 
  UserIcon, 
  ChartBarIcon, 
  ArrowPathIcon,
  BuildingOffice2Icon,
  ArrowLeftOnRectangleIcon,
  EnvelopeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

type UserRole = 'manufacturer' | 'pharmacist' | 'patient';

interface User {
  name: string;
  email: string;
  role: UserRole;
  companyName?: string; // For Manufacturer & Pharmacist
  licenseId?: string;   // For Pharmacist
  factoryId?: string;   // For Manufacturer
}

interface RoleConfig {
  id: UserRole;
  title: string;
  icon: React.ElementType;
  description: string;
  color: string;
  stepIds: number[]; // Which steps in the process flow are relevant
}

const ROLES: RoleConfig[] = [
  {
    id: 'patient',
    title: 'Patient / Consumer',
    icon: UserIcon,
    description: 'Verify medicine authenticity, check expiration, and manage adherence.',
    color: 'text-indigo-400',
    stepIds: [4, 6]
  },
  {
    id: 'pharmacist',
    title: 'Pharmacist (MSME)',
    icon: BuildingStorefrontIcon,
    description: 'Manage inventory, verify incoming stock, and track sales analytics.',
    color: 'text-teal-400',
    stepIds: [2, 3]
  },
  {
    id: 'manufacturer',
    title: 'Industrial Manufacturing',
    icon: BuildingOffice2Icon,
    description: 'Generate secure QR codes, log production batches, and initiate supply chain.',
    color: 'text-blue-400',
    stepIds: [1, 5]
  }
];

// System Process Steps Component
const SystemProcessSteps = ({ activeRole }: { activeRole: UserRole | null }) => {
  const steps = [
    { id: 1, title: "Manufacturing & QR Gen", desc: "Blockchain-backed QR codes generated during manufacturing.", icon: QrCodeIcon },
    { id: 2, title: "Distribution Chain", desc: "Medicines distributed with each transfer logged in the system.", icon: TruckIcon },
    { id: 3, title: "Pharmacy Management", desc: "Inventory tracking and authenticity verification at store.", icon: BuildingStorefrontIcon },
    { id: 4, title: "Patient Auth & Usage", desc: "Patients scan QR codes to verify authenticity and set reminders.", icon: UserIcon },
    { id: 5, title: "Multipowered Analytics", desc: "AI-Powered dosage reminders, safety scores & trend prediction.", icon: ChartBarIcon },
    { id: 6, title: "Feedback Loop", desc: "Sales analytics, delivery tracking, and pharmacist recommendation insights.", icon: ArrowPathIcon },
  ];

  const activeRoleConfig = ROLES.find(r => r.id === activeRole);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-8 md:mt-16 mb-8">
      <div className="flex items-center space-x-2 mb-6">
        <div className="h-px flex-1 bg-zinc-800"></div>
        <span className="text-[10px] md:text-xs font-mono text-zinc-500 uppercase tracking-wider text-center">System Architecture</span>
        <div className="h-px flex-1 bg-zinc-800"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {steps.map((step) => {
            const isActive = activeRoleConfig?.stepIds.includes(step.id);
            return (
                <div 
                    key={step.id} 
                    className={`
                        relative p-3 md:p-4 rounded-lg border transition-all duration-500
                        ${isActive 
                            ? 'bg-zinc-900/80 border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.1)]' 
                            : 'bg-zinc-900/30 border-zinc-800/50 opacity-60 hover:opacity-100'}
                    `}
                >
                    <div className="flex items-start space-x-3 md:space-x-4">
                        <div className={`p-1.5 md:p-2 rounded-md shrink-0 ${isActive ? 'bg-teal-500/20 text-teal-400' : 'bg-zinc-800 text-zinc-500'}`}>
                            <step.icon className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <div>
                            <h4 className={`text-xs md:text-sm font-bold mb-1 ${isActive ? 'text-zinc-100' : 'text-zinc-400'}`}>
                                Step {step.id}: {step.title}
                            </h4>
                            <p className="text-[10px] md:text-xs text-zinc-500 leading-relaxed">
                                {step.desc}
                            </p>
                        </div>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

const AuthScreen = ({ onLogin, onSignup }: { onLogin: (u: User) => void, onSignup: (u: User) => void }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'reset'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Role specific fields
  const [companyName, setCompanyName] = useState('');
  const [licenseId, setLicenseId] = useState('');
  const [factoryId, setFactoryId] = useState('');

  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
        const storedUserStr = localStorage.getItem(`user_${email}`);
        if (storedUserStr) {
            const storedUser = JSON.parse(storedUserStr);
            if (storedUser.password === btoa(password)) { // Simple mock hash check
                onLogin(storedUser.profile);
            } else {
                alert("Invalid password");
            }
        } else {
             // Fallback demo login if no user found
            onLogin({
                name: "Demo User",
                email: email,
                role: selectedRole,
                companyName: companyName || "Demo Entity"
            });
        }
        setLoading(false);
    }, 800);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Prepare user profile
    const newUser: User = {
        name,
        email,
        role: selectedRole,
        companyName: (selectedRole !== 'patient') ? companyName : undefined,
        licenseId: (selectedRole === 'pharmacist') ? licenseId : undefined,
        factoryId: (selectedRole === 'manufacturer') ? factoryId : undefined,
    };

    // Simulate API call
    setTimeout(() => {
        // Save to mock DB
        localStorage.setItem(`user_${email}`, JSON.stringify({
            profile: newUser,
            password: btoa(password) 
        }));
        
        onSignup(newUser);
        setLoading(false);
    }, 1000);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending email
    setTimeout(() => {
        setLoading(false);
        setResetSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative z-20 overflow-y-auto">
      <div className="w-full max-w-md bg-[#0E0E10] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col my-auto">
        
        {/* Header */}
        <div className="p-6 text-center border-b border-zinc-800 bg-zinc-900/50 shrink-0 rounded-t-2xl">
           <h2 className="text-2xl font-bold text-white mb-1">
             {activeTab === 'reset' ? 'Account Recovery' : 'Welcome to Pharma-Sure'}
           </h2>
           <p className="text-sm text-zinc-500">
             {activeTab === 'reset' ? 'Reset your secure access' : 'Secure Supply Chain Access'}
           </p>
        </div>

        {/* Tabs */}
        {activeTab !== 'reset' && (
            <div className="flex border-b border-zinc-800 shrink-0">
                <button 
                    onClick={() => setActiveTab('login')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'login' ? 'text-teal-400 border-b-2 border-teal-400 bg-zinc-900/30' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    Log In
                </button>
                <button 
                    onClick={() => setActiveTab('signup')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'signup' ? 'text-teal-400 border-b-2 border-teal-400 bg-zinc-900/30' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    Sign Up
                </button>
            </div>
        )}

        <div className="p-6">
            {/* Role Selector - Only for Signup */}
            {activeTab === 'signup' && (
                <div className="mb-6">
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Select Account Type</label>
                    <div className="grid grid-cols-3 gap-2">
                        {ROLES.map(role => (
                            <button
                                key={role.id}
                                type="button"
                                onClick={() => setSelectedRole(role.id)}
                                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${selectedRole === role.id ? `bg-zinc-800 ${role.color.replace('text-', 'border-')} ring-1 ring-${role.color.split('-')[1]}-500` : 'border-zinc-800 hover:bg-zinc-800/50'}`}
                            >
                                <role.icon className={`w-5 h-5 mb-1 ${selectedRole === role.id ? role.color : 'text-zinc-500'}`} />
                                <span className={`text-[10px] font-medium text-center leading-tight ${selectedRole === role.id ? 'text-zinc-200' : 'text-zinc-500'}`}>{role.title.split(' ')[0]}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'reset' ? (
                resetSent ? (
                    <div className="text-center py-8 space-y-4 animate-in fade-in">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircleIcon className="w-8 h-8 text-green-500" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">Check your inbox</h3>
                            <p className="text-zinc-400 text-sm mt-1">
                                We've sent a secure reset link to <span className="text-zinc-200">{email}</span>
                            </p>
                        </div>
                        <button 
                            onClick={() => setActiveTab('login')}
                            className="text-teal-400 hover:text-teal-300 text-sm font-medium mt-4 block w-full"
                        >
                            Return to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleResetSubmit} className="space-y-4 animate-in fade-in">
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Registered Email</label>
                            <div className="relative">
                                <EnvelopeIcon className="w-5 h-5 text-zinc-600 absolute left-3 top-2.5" />
                                <input 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
                                    placeholder="Enter your email address"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-lg transition-all transform active:scale-[0.98] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                             {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : 'Send Reset Link'}
                        </button>
                        <button 
                            type="button"
                            onClick={() => setActiveTab('login')}
                            className="w-full text-zinc-500 hover:text-zinc-300 text-xs py-2"
                        >
                            Cancel
                        </button>
                    </form>
                )
            ) : (
                <form onSubmit={activeTab === 'login' ? handleLoginSubmit : handleSignupSubmit} className="space-y-4 animate-in fade-in">
                    
                    {/* Common Fields */}
                    {activeTab === 'signup' && (
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Full Name</label>
                            <input 
                                type="text" 
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black border border-zinc-800 rounded-lg py-2.5 px-3 text-sm text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Email Address</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black border border-zinc-800 rounded-lg py-2.5 px-3 text-sm text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
                            placeholder="name@example.com"
                        />
                    </div>

                    {/* Role Specific Fields */}
                    {activeTab === 'signup' && selectedRole === 'pharmacist' && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Pharmacy Name</label>
                                <input type="text" required value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-lg py-2.5 px-3 text-sm text-white focus:border-teal-500 outline-none" placeholder="City Meds Store" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">License Number (DL No)</label>
                                <input type="text" required value={licenseId} onChange={e => setLicenseId(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-lg py-2.5 px-3 text-sm text-white focus:border-teal-500 outline-none" placeholder="MH-TZ-12345" />
                            </div>
                        </>
                    )}

                    {activeTab === 'signup' && selectedRole === 'manufacturer' && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Company Name</label>
                                <input type="text" required value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-lg py-2.5 px-3 text-sm text-white focus:border-teal-500 outline-none" placeholder="Pharma Corp Ltd" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Factory ID</label>
                                <input type="text" required value={factoryId} onChange={e => setFactoryId(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-lg py-2.5 px-3 text-sm text-white focus:border-teal-500 outline-none" placeholder="FAC-001-IN" />
                            </div>
                        </>
                    )}

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-bold text-zinc-500 uppercase">Password</label>
                            {activeTab === 'login' && (
                                <button type="button" onClick={() => setActiveTab('reset')} className="text-xs text-teal-500 hover:text-teal-400">Forgot?</button>
                            )}
                        </div>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black border border-zinc-800 rounded-lg py-2.5 px-3 text-sm text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`
                            w-full font-bold py-3 rounded-lg transition-all transform active:scale-[0.98] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed
                            ${activeTab === 'login' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-teal-600 text-white hover:bg-teal-500'}
                        `}
                    >
                        {loading ? (
                            <div className={`w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${activeTab === 'login' ? 'border-black' : 'border-white'}`} />
                        ) : (
                            activeTab === 'login' ? 'Access Dashboard' : 'Create Account'
                        )}
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [creation, setCreation] = useState<Creation | null>(null);
  const [history, setHistory] = useState<Creation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pharma_history');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Rehydrate dates
            const rehydrated = parsed.map((p: any) => ({...p, timestamp: new Date(p.timestamp)}));
            setHistory(rehydrated);
        } catch(e) { console.error("Failed to load history", e); }
    }
  }, []);

  // Save history
  useEffect(() => {
    if(history.length > 0) {
        localStorage.setItem('pharma_history', JSON.stringify(history));
    }
  }, [history]);

  const handleGenerate = async (prompt: string, file?: File) => {
    if (isGenerating || !user) return;
    setIsGenerating(true);

    let fileBase64: string | undefined;
    let mimeType: string | undefined;

    if (file) {
      mimeType = file.type;
      fileBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    try {
      const { html, sources } = await bringToLife(prompt, user, fileBase64, mimeType);
      const newCreation: Creation = {
        id: Date.now().toString(),
        name: file ? `Analysis: ${file.name}` : `Dashboard: ${user.role}`,
        html,
        originalImage: fileBase64,
        timestamp: new Date(),
        sources: sources
      };
      setCreation(newCreation);
      setHistory((prev) => [newCreation, ...prev]);
    } catch (error) {
      console.error(error);
      alert("Failed to process request. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogout = () => {
    if(confirm("Are you sure you want to verify session termination?")) {
        setUser(null);
        setCreation(null);
    }
  };

  // If not logged in, show Auth Screen
  if (!user) {
    return (
      <div className="relative min-h-screen overflow-hidden font-sans selection:bg-teal-500/30">
         {/* Background Elements */}
         <div className="fixed inset-0 bg-[#09090b]">
            <div className="absolute inset-0 bg-dot-grid opacity-[0.15] pointer-events-none"></div>
         </div>
         <Hero compact={false} />
         <AuthScreen onLogin={setUser} onSignup={setUser} />
      </div>
    );
  }

  // Logged In Dashboard
  return (
    <div className="relative min-h-screen overflow-hidden font-sans selection:bg-teal-500/30">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-[#09090b] -z-10">
         <div className="absolute inset-0 bg-dot-grid opacity-[0.15] pointer-events-none"></div>
         <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/80 to-transparent"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-30 h-16 border-b border-zinc-800 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
           <Hero compact={true} />
           
           <div className="flex items-center space-x-4">
              <div className="hidden md:flex flex-col items-end mr-2">
                  <span className="text-xs font-bold text-zinc-200">{user.name}</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{user.role}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-xs font-medium px-3 py-1.5 rounded border border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition-all"
              >
                Log Out
              </button>
           </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative pt-24 pb-12 px-4 flex flex-col items-center min-h-screen z-10">
        
        <SystemProcessSteps activeRole={user.role} />

        <InputArea 
            onGenerate={handleGenerate} 
            isGenerating={isGenerating} 
            user={user}
        />

        <div className="w-full max-w-4xl mt-12">
            <CreationHistory history={history} onSelect={setCreation} />
        </div>

        <LivePreview 
            creation={creation} 
            isLoading={isGenerating} 
            isFocused={!!creation || isGenerating}
            onReset={() => setCreation(null)}
        />
      </main>
      
      {/* Secure B2B Chat - Hidden for Patients */}
      <ChatInterface user={user} />
      
      {/* Footer */}
      <footer className="relative z-20 border-t border-zinc-800 bg-black/80 mt-auto py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
             <div className="text-zinc-500 text-xs mb-4 md:mb-0">
                © 2024 Pharma-Sure. <span className="hidden md:inline">Blockchain-Verified Supply Chain Protocol.</span>
             </div>
             <div className="flex space-x-6 text-xs font-medium">
                <button onClick={() => setShowPrivacyPolicy(true)} className="text-zinc-400 hover:text-teal-400 transition-colors">Privacy Policy</button>
                <a href="#" className="text-zinc-400 hover:text-teal-400 transition-colors">Documentation</a>
                <button onClick={handleLogout} className="text-zinc-400 hover:text-red-400 transition-colors">Log Out</button>
             </div>
        </div>
      </footer>

      <PrivacyPolicy isOpen={showPrivacyPolicy} onClose={() => setShowPrivacyPolicy(false)} />
    </div>
  );
}

export default App;
