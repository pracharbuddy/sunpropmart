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

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
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
