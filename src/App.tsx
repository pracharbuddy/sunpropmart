import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { FeaturedProperties } from './components/home/FeaturedProperties';
import { ProjectsBanner } from './components/home/ProjectsBanner';
import { NewLaunchProjects } from './components/home/NewLaunchProjects';
import { ServicesSection } from './components/home/ServicesSection';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { PopularLocations } from './components/home/PopularLocations';
import { TestimonialsSection } from './components/home/TestimonialsSection';
import { BlogInsightsSection } from './components/home/BlogInsightsSection';
import { PropertyList } from './components/properties/PropertyList';
import { PropertyDetail } from './components/properties/PropertyDetail';
import { ProjectsView } from './components/projects/ProjectsView';
import { GovernmentWorksView } from './components/government/GovernmentWorksView';
import { ConstructionView } from './components/construction/ConstructionView';
import { ServicesView } from './components/services/ServicesView';
import { BlogView } from './components/blog/BlogView';
import { AboutView } from './components/about/AboutView';
import { ContactView } from './components/contact/ContactView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AgentDashboard } from './components/agent/AgentDashboard';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { EnquiryModal } from './components/modals/EnquiryModal';
import { SiteVisitModal } from './components/modals/SiteVisitModal';
import { AuthModal } from './components/modals/AuthModal';
import { CareersView } from './components/careers/CareersView';
import { PrivacyPolicyView } from './components/legal/PrivacyPolicyView';
import { TermsView } from './components/legal/TermsView';
import { SEOHead } from './components/common/SEOHead';
import { Property, Project } from './types';
import { Bell, CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, toastMessage } = useApp();

  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isSiteVisitModalOpen, setIsSiteVisitModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [modalProperty, setModalProperty] = useState<Property | null>(null);
  const [modalProject, setModalProject] = useState<Project | null>(null);

  const handleOpenEnquiry = (property?: Property, project?: Project) => {
    setModalProperty(property || null);
    setModalProject(project || null);
    setIsEnquiryModalOpen(true);
  };

  const handleOpenSiteVisit = (property?: Property) => {
    setModalProperty(property || null);
    setIsSiteVisitModalOpen(true);
  };

  // Dynamic SEO Configuration based on Route
  const getRouteSeo = () => {
    switch (currentView) {
      case 'home':
        return {
          title: 'SunPropMart | Real Estate & Construction in Greater Noida & Delhi NCR',
          description:
            'Leading corporate real estate and heavy civil infrastructure firm delivering verified residential apartments, luxury villas, commercial plots, and government public works in Greater Noida and Delhi NCR.',
          canonicalUrl: 'https://sunpropmart.in/',
          ogType: 'website' as const,
        };
      case 'properties':
        return {
          title: 'Properties in Greater Noida & Delhi NCR | SunPropMart Listings',
          description:
            'Browse verified residential flats, luxury builder floors, commercial office spaces, and RERA-approved plots for sale and rent across Greater Noida West and Delhi NCR.',
          canonicalUrl: 'https://sunpropmart.in/properties',
        };
      case 'projects':
        return {
          title: 'Featured Real Estate Projects in Delhi NCR | SunPropMart Developments',
          description:
            'Explore premier new launch and ongoing residential townships, commercial complexes, and YEIDA expressway developments in Greater Noida.',
          canonicalUrl: 'https://sunpropmart.in/projects',
        };
      case 'services':
      case 'investment':
        return {
          title: 'Real Estate & Investment Advisory Services | SunPropMart',
          description:
            'End-to-end real estate solutions: Property sales, rental management, NRI property care, commercial leasing, and portfolio advisory.',
          canonicalUrl: 'https://sunpropmart.in/services',
        };
      case 'government-work':
        return {
          title: 'Government Works & Public Infrastructure | SunPropMart Civil Division',
          description:
            'Institutional public sector execution: Roadways, civic utilities, institutional structures, and government infrastructure contracts across Uttar Pradesh.',
          canonicalUrl: 'https://sunpropmart.in/government-work',
        };
      case 'construction':
        return {
          title: 'Civil Construction & Turnkey Contracting | SunPropMart Engineering',
          description:
            'Commercial contracting, residential multi-story development, architectural planning, and turnkey structural engineering in Delhi NCR.',
          canonicalUrl: 'https://sunpropmart.in/construction',
        };
      case 'blog':
        return {
          title: 'NCR Real Estate News & Market Insights | SunPropMart Blog',
          description:
            'Authoritative real estate market research, Jewar airport growth trends, RERA legal buyer guides, and property investment tips.',
          canonicalUrl: 'https://sunpropmart.in/blog',
        };
      case 'about':
        return {
          title: 'About SunPropMart | Trusted Real Estate & Construction Partner',
          description:
            'Over 15 years delivering trusted residential, commercial, and civil infrastructure excellence in Greater Noida and Delhi NCR.',
          canonicalUrl: 'https://sunpropmart.in/about',
        };
      case 'contact':
        return {
          title: 'Contact SunPropMart | Real Estate Office in Greater Noida',
          description:
            'Visit our corporate headquarters at Alpha-I Commercial Belt, Greater Noida. Call +91 98730 83899 or email info@sunpropmart.in.',
          canonicalUrl: 'https://sunpropmart.in/contact',
        };
      case 'careers':
        return {
          title: 'Careers at SunPropMart | Join NCR’s Premier Real Estate Team',
          description:
            'Career openings for senior property consultants, civil engineers, CRM managers, and legal specialists in Greater Noida.',
          canonicalUrl: 'https://sunpropmart.in/careers',
        };
      case 'privacy':
        return {
          title: 'Privacy Policy | SunPropMart Data Governance',
          description:
            'How SunPropMart safeguards your personal information, inquiries, and transaction records under Indian data protection laws.',
          canonicalUrl: 'https://sunpropmart.in/privacy',
        };
      case 'terms':
        return {
          title: 'Terms & Conditions | SunPropMart Legal Mandate',
          description:
            'Governing terms and conditions for property listings, advisory mandates, site visits, and civil contracts.',
          canonicalUrl: 'https://sunpropmart.in/terms',
        };
      case 'admin':
      case 'admin-dashboard':
      case 'agents':
      case 'agent-dashboard':
      case 'customer-portal':
        return {
          title: 'Staff Control Portal | SunPropMart',
          description: 'Restricted administrative and agent dashboard.',
          noIndex: true, // NEVER index staff and admin routes
        };
      default:
        return {};
    }
  };

  const seoData = getRouteSeo();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Dynamic SEO Meta Injection */}
      <SEOHead {...seoData} />

      {/* Primary Header */}
      <Header
        onOpenEnquiryModal={() => handleOpenEnquiry()}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <Hero />
            <FeaturedProperties />
            <ProjectsBanner />
            <NewLaunchProjects />
            <ServicesSection />
            <WhyChooseUs />
            <PopularLocations />
            <TestimonialsSection />
            <BlogInsightsSection />
          </>
        )}

        {currentView === 'properties' && (
          <PropertyList onOpenEnquiryModal={() => handleOpenEnquiry()} />
        )}

        {currentView === 'property-detail' && (
          <PropertyDetail
            onOpenEnquiryModal={handleOpenEnquiry}
            onOpenSiteVisitModal={handleOpenSiteVisit}
          />
        )}

        {(currentView === 'projects' || currentView === 'project-detail') && (
          <ProjectsView onOpenEnquiryModal={() => handleOpenEnquiry()} />
        )}

        {currentView === 'services' && (
          <ServicesView onOpenEnquiryModal={() => handleOpenEnquiry()} />
        )}

        {currentView === 'government-work' && (
          <GovernmentWorksView onOpenEnquiryModal={() => handleOpenEnquiry()} />
        )}

        {currentView === 'construction' && (
          <ConstructionView onOpenEnquiryModal={() => handleOpenEnquiry()} />
        )}

        {currentView === 'investment' && (
          <ServicesView onOpenEnquiryModal={() => handleOpenEnquiry()} />
        )}

        {(currentView === 'blog' || currentView === 'blog-detail') && <BlogView />}

        {currentView === 'about' && <AboutView />}

        {currentView === 'contact' && <ContactView />}

        {currentView === 'careers' && <CareersView />}

        {currentView === 'privacy' && <PrivacyPolicyView />}

        {currentView === 'terms' && <TermsView />}

        {(currentView === 'admin-dashboard' || currentView === 'admin') && <AdminDashboard />}

        {(currentView === 'agent-dashboard' || currentView === 'agents') && <AgentDashboard />}

        {currentView === 'customer-portal' && (
          <CustomerPortal onOpenSiteVisitModal={() => handleOpenSiteVisit()} />
        )}
      </main>

      {/* Primary Footer */}
      <Footer onOpenEnquiryModal={() => handleOpenEnquiry()} />

      {/* Modals */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        selectedProperty={modalProperty}
        selectedProject={modalProject}
      />

      <SiteVisitModal
        isOpen={isSiteVisitModalOpen}
        onClose={() => setIsSiteVisitModalOpen(false)}
        selectedProperty={modalProperty}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce bg-[#0B1528] text-white border border-amber-400/40 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 text-xs max-w-md">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
