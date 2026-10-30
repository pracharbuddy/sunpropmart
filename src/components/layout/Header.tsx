import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SunLogo } from '../common/SunLogo';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Search,
  Menu,
  X,
  Shield,
  UserCheck,
  User,
  Heart,
  ChevronDown,
  LogOut,
  Building,
  ArrowRight,
} from 'lucide-react';

interface HeaderProps {
  onOpenEnquiryModal: () => void;
  onOpenAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenEnquiryModal,
  onOpenAuthModal,
}) => {
  const {
    currentRole,
    currentUser,
    switchRole,
    logout,
    currentView,
    navigate,
    favorites,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navItems = [
    { label: 'Home', view: 'home' },
    { label: 'Properties', view: 'properties' },
    { label: 'Projects', view: 'projects' },
    { label: 'Services', view: 'services' },
    { label: 'Govt Works', view: 'government-work' },
    { label: 'Construction', view: 'construction' },
    { label: 'Investment', view: 'investment' },
    { label: 'Blog', view: 'blog' },
    { label: 'About Us', view: 'about' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleNavClick = (view: string) => {
    navigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B1528] text-white shadow-xl border-b border-white/10 w-full max-w-full overflow-hidden">
      {/* 1. Top Utility Contact & RBAC Bar (Desktop Only) */}
      <div className="hidden lg:block border-b border-white/10 bg-[#070D1A] py-1.5 px-4 sm:px-6 lg:px-8 text-xs text-slate-300">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          {/* Contact Details */}
          <div className="flex items-center gap-5 xl:gap-6 shrink-0">
            <a
              href="tel:+919873083899"
              className="flex items-center gap-1.5 hover:text-[#E5B842] transition-colors whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-[#E5B842] shrink-0" />
              <span>+91 98730 83899</span>
            </a>
            <a
              href="mailto:info@sunpropmart.in"
              className="hidden xl:flex items-center gap-1.5 hover:text-[#E5B842] transition-colors whitespace-nowrap"
            >
              <Mail className="w-3.5 h-3.5 text-[#E5B842] shrink-0" />
              <span>info@sunpropmart.in</span>
            </a>
            <div
              className="hidden 2xl:flex items-center gap-1.5 text-slate-400 whitespace-nowrap cursor-default"
              title="F-2, Krishna Plaza, Upper HDFC Bank, Alpha-I Commercial Belt, Greater Noida, Uttar Pradesh 201310"
            >
              <MapPin className="w-3.5 h-3.5 text-[#E5B842] shrink-0" />
              <span>Alpha-I Commercial Belt, Greater Noida, U.P.</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 text-[#E5B842] shrink-0" />
              <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
            </div>
          </div>

          {/* Quick RBAC Persona Switcher & Account */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-amber-300 font-medium transition-colors cursor-pointer"
                title="Switch test persona"
              >
                {currentRole === 'admin' && <Shield className="w-3.5 h-3.5 text-amber-400" />}
                {currentRole === 'agent' && <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
                {currentRole === 'customer' && <User className="w-3.5 h-3.5 text-blue-400" />}
                {currentRole === 'guest' && <Building className="w-3.5 h-3.5 text-slate-400" />}
                <span className="whitespace-nowrap">
                  Role: <strong className="uppercase">{currentRole}</strong>
                  {currentUser ? ` (${currentUser.full_name.split(' ')[0]})` : ''}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-60 bg-[#0F1D38] border border-amber-500/30 rounded-xl shadow-2xl py-2 z-50 text-slate-200">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-amber-400 uppercase tracking-wider border-b border-white/10">
                    Switch Test Persona
                  </div>
                  <button
                    onClick={() => {
                      switchRole('admin', 'usr-admin-01');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-white/10 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                      <span>Vikram (Admin)</span>
                    </span>
                    <span className="text-[10px] text-amber-300 font-mono">Full Control</span>
                  </button>
                  <button
                    onClick={() => {
                      switchRole('agent', 'usr-agent-01');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-white/10 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Rahul (Agent)</span>
                    </span>
                    <span className="text-[10px] text-emerald-300 font-mono">Approvals Required</span>
                  </button>
                  <button
                    onClick={() => {
                      switchRole('customer', 'usr-cust-01');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-white/10 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      <span>Priya (Customer)</span>
                    </span>
                    <span className="text-[10px] text-blue-300 font-mono">Buyer View</span>
                  </button>
                  <button
                    onClick={() => {
                      switchRole('guest');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-white/10 flex items-center justify-between border-t border-white/10 transition-colors"
                  >
                    <span className="flex items-center gap-2 text-slate-400">
                      <Building className="w-3.5 h-3.5" />
                      <span>Public Guest</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Browse Only</span>
                  </button>
                </div>
              )}
            </div>

            {/* Saved Wishlist */}
            <button
              onClick={() => navigate('customer-portal')}
              className="flex items-center gap-1.5 hover:text-[#E5B842] transition-colors whitespace-nowrap cursor-pointer"
              title="Saved Properties"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30 shrink-0" />
              <span>Saved ({favorites.length})</span>
            </button>

            {currentUser ? (
              <button
                onClick={logout}
                className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="text-[#E5B842] hover:underline font-semibold cursor-pointer whitespace-nowrap"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo - flex-1 min-w-0 on mobile so it scales smoothly */}
        <button
          onClick={() => navigate('home')}
          className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg p-0.5 min-w-0 cursor-pointer shrink"
        >
          <SunLogo size="md" variant="dark" />
        </button>

        {/* Desktop Nav Links (Hidden on < xl) */}
        <nav className="hidden xl:flex items-center gap-4 2xl:gap-6 text-[13px] font-medium tracking-normal shrink-0">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => navigate(item.view)}
                className={`transition-colors whitespace-nowrap py-1 relative cursor-pointer ${
                  isActive
                    ? 'text-[#E5B842] font-bold'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E5B842] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls on the Right */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Search Icon Trigger (Visible on sm+) */}
          <button
            onClick={() => navigate('properties')}
            className="hidden sm:flex w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10 items-center justify-center shrink-0 cursor-pointer"
            title="Search Properties"
            aria-label="Search Properties"
          >
            <Search className="w-4 h-4 text-[#E5B842]" />
          </button>

          {/* Role Portal Shortcut Button (Hidden on < md to prevent button squeeze) */}
          {currentRole === 'admin' && (
            <button
              onClick={() => navigate('admin-dashboard')}
              className={`hidden md:flex h-9 px-3 rounded-lg text-xs font-bold transition-all shadow-sm items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                currentView.startsWith('admin')
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                  : 'bg-white/10 text-amber-300 hover:bg-white/20 border border-amber-500/40'
              }`}
            >
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>Admin Panel</span>
            </button>
          )}

          {currentRole === 'agent' && (
            <button
              onClick={() => navigate('agent-dashboard')}
              className={`hidden md:flex h-9 px-3 rounded-lg text-xs font-bold transition-all shadow-sm items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                currentView.startsWith('agent')
                  ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300'
                  : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/80 border border-emerald-500/40'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Agent Portal</span>
            </button>
          )}

          {currentRole === 'customer' && (
            <button
              onClick={() => navigate('customer-portal')}
              className={`hidden md:flex h-9 px-3 rounded-lg text-xs font-bold transition-all shadow-sm items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'customer-portal'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-blue-300 hover:bg-white/20 border border-blue-400/30'
              }`}
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span>My Portal</span>
            </button>
          )}

          {/* Enquiry Button (Visible on sm+, collapsed into drawer on small mobile) */}
          <button
            onClick={onOpenEnquiryModal}
            className="hidden sm:flex h-9 px-3.5 sm:px-4.5 rounded-lg bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-amber-500/20 transition-all active:scale-95 whitespace-nowrap shrink-0 items-center justify-center cursor-pointer"
          >
            Enquiry Now
          </button>

          {/* Mobile Hamburger Toggle for < xl screens */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="xl:hidden w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/15 text-slate-200 border border-white/10 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
            aria-label="Open mobile navigation drawer"
          >
            <Menu className="w-5 h-5 text-amber-300" />
          </button>
        </div>
      </div>

      {/* 3. Off-Canvas Left Mobile Navigation Drawer & Overlay */}
      {mobileMenuOpen && (
        <div
          className="sidebar-overlay xl:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar ${
          mobileMenuOpen ? 'open' : ''
        } xl:hidden bg-[#070D1A] border-r border-amber-500/20 text-slate-200 flex flex-col shadow-2xl overflow-y-auto`}
        aria-label="Mobile Navigation"
      >
        {/* Drawer Header with Logo & Close Button */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3 bg-[#0B1528] sticky top-0 z-10 shrink-0">
          <SunLogo size="sm" variant="dark" />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-5 flex-1">
          {/* Prominent Quick Actions */}
          <div className="space-y-2">
            <button
              onClick={() => {
                onOpenEnquiryModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>Enquiry Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Portal Access on Mobile */}
            {currentRole === 'admin' && (
              <button
                onClick={() => handleNavClick('admin-dashboard')}
                className="w-full py-2 px-3 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Admin Control Console</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                  Open
                </span>
              </button>
            )}

            {currentRole === 'agent' && (
              <button
                onClick={() => handleNavClick('agent-dashboard')}
                className="w-full py-2 px-3 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  <span>Agent Workspace Portal</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950">
                  Open
                </span>
              </button>
            )}

            {currentRole === 'customer' && (
              <button
                onClick={() => handleNavClick('customer-portal')}
                className="w-full py-2 px-3 rounded-lg bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Customer Buyer Portal</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500 text-white">
                  Open
                </span>
              </button>
            )}
          </div>

          {/* Persona Switcher Box */}
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#E5B842] uppercase tracking-wider">
              <span>Test Role Persona</span>
              <span className="text-[10px] text-slate-400 lowercase">({currentRole})</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={() => {
                  switchRole('admin', 'usr-admin-01');
                  setMobileMenuOpen(false);
                }}
                className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                  currentRole === 'admin'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="font-semibold text-xs">Admin</div>
                <div className="text-[9px] text-slate-400">Full Access</div>
              </button>
              <button
                onClick={() => {
                  switchRole('agent', 'usr-agent-01');
                  setMobileMenuOpen(false);
                }}
                className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                  currentRole === 'agent'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="font-semibold text-xs">Agent</div>
                <div className="text-[9px] text-slate-400">Approvals</div>
              </button>
              <button
                onClick={() => {
                  switchRole('customer', 'usr-cust-01');
                  setMobileMenuOpen(false);
                }}
                className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                  currentRole === 'customer'
                    ? 'bg-blue-500/20 border-blue-400 text-blue-300 font-bold'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="font-semibold text-xs">Customer</div>
                <div className="text-[9px] text-slate-400">Buyer View</div>
              </button>
              <button
                onClick={() => {
                  switchRole('guest');
                  setMobileMenuOpen(false);
                }}
                className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                  currentRole === 'guest'
                    ? 'bg-slate-700 border-white text-white font-bold'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className="font-semibold text-xs">Guest</div>
                <div className="text-[9px] text-slate-400">Browse</div>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
              Menu Navigation
            </div>
            <div className="grid grid-cols-1 gap-1">
              {navItems.map((item) => {
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => handleNavClick(item.view)}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-[#E5B842] text-slate-950 font-bold shadow-sm'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Saved Properties & Search Links */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <button
              onClick={() => handleNavClick('customer-portal')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Saved Wishlist</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] font-bold">
                {favorites.length}
              </span>
            </button>
            <button
              onClick={() => handleNavClick('properties')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Search All Properties</span>
            </button>
          </div>

          {/* Contact Details in Drawer */}
          <div className="pt-2 border-t border-white/10 space-y-2.5 text-xs text-slate-400">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              SunPropMart Desk
            </div>
            <a
              href="tel:+919873083899"
              className="flex items-center gap-2 text-slate-300 hover:text-[#E5B842] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#E5B842] shrink-0" />
              <span>+91 98730 83899</span>
            </a>
            <a
              href="mailto:info@sunpropmart.in"
              className="flex items-center gap-2 text-slate-300 hover:text-[#E5B842] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#E5B842] shrink-0" />
              <span>info@sunpropmart.in</span>
            </a>
            <div className="flex items-start gap-2 text-slate-400 text-[11px] leading-relaxed">
              <MapPin className="w-3.5 h-3.5 text-[#E5B842] shrink-0 mt-0.5" />
              <span>F-2, Krishna Plaza, Alpha-I Commercial Belt, Greater Noida</span>
            </div>
          </div>

          {/* Account Login / Settings */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                onOpenAuthModal();
                setMobileMenuOpen(false);
              }}
              className="text-[#E5B842] hover:underline font-semibold cursor-pointer"
            >
              {currentUser ? 'Switch Account' : 'Login / Register'}
            </button>
            {currentUser && (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-slate-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </header>
  );
};
