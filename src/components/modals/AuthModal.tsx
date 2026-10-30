import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SunLogo } from '../common/SunLogo';
import { X, Shield, UserCheck, User, Building, Lock, Mail } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { switchRole, allProfiles, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'personas' | 'credentials'>('personas');
  const [email, setEmail] = useState('info@sunpropmart.in');
  const [password, setPassword] = useState('••••••••');

  if (!isOpen) return null;

  const handleCredentialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('admin') || email.includes('info@sunpropmart.in')) {
      switchRole('admin', 'usr-admin-01');
    } else if (email.includes('agent') || email.includes('rahul')) {
      switchRole('agent', 'usr-agent-01');
    } else {
      switchRole('customer', 'usr-cust-01');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-[#0B1528] text-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="mb-3">
            <SunLogo size="sm" variant="dark" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-400/10 text-[#E5B842] text-[10px] font-bold uppercase tracking-wider mb-2">
            <span>Identity & Access Management</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">SunPropMart Staff & Client Login</h2>
          <p className="text-xs text-slate-400 mt-1">
            Company-controlled real estate portal with strict Role-Based Access Control (RBAC).
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-2 gap-1 bg-white/5 p-1 rounded-xl mb-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('personas')}
            className={`py-2 rounded-lg transition-colors ${
              activeTab === 'personas'
                ? 'bg-[#E5B842] text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            One-Click Test Personas
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`py-2 rounded-lg transition-colors ${
              activeTab === 'credentials'
                ? 'bg-[#E5B842] text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Standard Sign-In
          </button>
        </div>

        {activeTab === 'personas' ? (
          <div className="space-y-3">
            <button
              onClick={() => {
                switchRole('admin', 'usr-admin-01');
                onClose();
              }}
              className="w-full p-3.5 rounded-xl bg-white/5 hover:bg-amber-500/15 border border-white/10 hover:border-amber-400/50 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs group-hover:text-amber-300">
                    Vikram Malhotra (Principal Admin)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Full CRUD, Property Approvals, Price Reviews
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase bg-amber-400/10 px-2 py-0.5 rounded">
                Admin
              </span>
            </button>

            <button
              onClick={() => {
                switchRole('agent', 'usr-agent-01');
                onClose();
              }}
              className="w-full p-3.5 rounded-xl bg-white/5 hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-400/50 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs group-hover:text-emerald-300">
                    Rahul Sharma (Authorized Agent)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Add/Edit Drafts, Submit for Review, CRM Leads
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase bg-emerald-400/10 px-2 py-0.5 rounded">
                Agent
              </span>
            </button>

            <button
              onClick={() => {
                switchRole('customer', 'usr-cust-01');
                onClose();
              }}
              className="w-full p-3.5 rounded-xl bg-white/5 hover:bg-blue-500/15 border border-white/10 hover:border-blue-400/50 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs group-hover:text-blue-300">
                    Priya Kapoor (Prospective Client)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Wishlist, Book Site Visits, View Enquiries
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase bg-blue-400/10 px-2 py-0.5 rounded">
                Customer
              </span>
            </button>

            <button
              onClick={() => {
                switchRole('guest');
                onClose();
              }}
              className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 text-left text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                <span>Browse as Public Guest (Read-Only)</span>
              </div>
              <span className="text-[10px]">Guest</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleCredentialLogin} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Company Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#070D1A] border border-white/10 rounded-lg py-2.5 pl-10 pr-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">Secure Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#070D1A] border border-white/10 rounded-lg py-2.5 pl-10 pr-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider transition-all mt-2"
            >
              Sign In to Workspace
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
