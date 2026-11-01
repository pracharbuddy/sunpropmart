import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Property,
  Project,
  UserProfile,
  Lead,
  SiteVisit,
  ServiceItem,
  BlogPost,
  Testimonial,
  AuditLog,
  PropertyPriceChangeRequest,
  PropertyDeleteRequest,
  MediaItem,
  NotificationItem,
  UserRole,
  PermissionAction,
  CmsPageSection,
} from '../types';
import {
  SEED_PROFILES,
  SEED_PROPERTIES,
  SEED_PROJECTS,
  SEED_SERVICES,
  SEED_LEADS,
  SEED_SITE_VISITS,
  SEED_BLOG_POSTS,
  SEED_TESTIMONIALS,
  SEED_AUDIT_LOGS,
  SEED_PRICE_REQUESTS,
  SEED_DELETE_REQUESTS,
  SEED_MEDIA,
} from '../data/seedData';
import {
  SupabaseHealth,
  checkSupabaseConnection,
  isSupabaseConfigured,
  supabaseProjectId,
  supabaseUrl,
} from '../lib/supabase';
import * as services from '../services';

interface AppContextType {
  // Supabase Backend Integration
  supabaseHealth: SupabaseHealth;
  refreshSupabaseHealth: () => Promise<SupabaseHealth>;
  syncLocalToSupabase: () => Promise<{ success: boolean; message: string }>;

  // Authentication & RBAC
  currentUser: UserProfile | null;
  currentRole: UserRole | 'guest';
  switchRole: (role: UserRole | 'guest', profileId?: string) => void;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  allProfiles: UserProfile[];
  can: (action: PermissionAction) => boolean;

  // Navigation & Routing
  currentView: string;
  selectedPropertySlug: string | null;
  selectedProjectSlug: string | null;
  selectedBlogSlug: string | null;
  navigate: (
    view: string,
    params?: { propertySlug?: string; projectSlug?: string; blogSlug?: string }
  ) => void;

  // Search & Global Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterLocation: string;
  setFilterLocation: (loc: string) => void;
  filterPropertyType: string;
  setFilterPropertyType: (type: string) => void;
  filterListingType: string;
  setFilterListingType: (listingType: string) => void;
  filterBudget: string;
  setFilterBudget: (budget: string) => void;

  // Properties & Workflows (Supabase Source of Truth)
  properties: Property[];
  propertiesLoading: boolean;
  refreshProperties: () => Promise<void>;
  addProperty: (propertyData: Partial<Property>) => Promise<Property | null>;
  updateProperty: (id: string, propertyData: Partial<Property>) => Promise<void>;
  submitPropertyForReview: (id: string) => Promise<void>;
  approveProperty: (id: string, notes?: string) => Promise<void>;
  rejectProperty: (id: string, notes?: string) => Promise<void>;
  requestChangesProperty: (id: string, notes?: string) => Promise<void>;
  requestPriceChange: (propertyId: string, newPrice: number, reason: string) => Promise<void>;
  reviewPriceChange: (requestId: string, approved: boolean, comment?: string) => Promise<void>;
  priceRequests: PropertyPriceChangeRequest[];
  requestDelete: (propertyId: string, reason: string) => Promise<void>;
  reviewDelete: (requestId: string, approved: boolean, comment?: string) => Promise<void>;
  deleteRequests: PropertyDeleteRequest[];
  favorites: string[];
  toggleFavorite: (propertyId: string) => void;

  // Projects & Construction
  projects: Project[];
  addProject: (projectData: Partial<Project>) => Promise<Project | null>;
  updateProject: (id: string, projectData: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Leads & CRM
  leads: Lead[];
  leadsLoading: boolean;
  refreshLeads: () => Promise<void>;
  addLead: (leadData: Partial<Lead>) => Promise<void>;
  updateLeadStatus: (leadId: string, status: Lead['status'], noteText?: string) => Promise<void>;
  assignLeadToAgent: (leadId: string, agentId: string) => Promise<void>;

  // Site Visits
  siteVisits: SiteVisit[];
  bookSiteVisit: (visitData: Partial<SiteVisit>) => Promise<void>;
  updateSiteVisitStatus: (visitId: string, status: SiteVisit['status'], notes?: string) => Promise<void>;

  // Services & Blog
  services: ServiceItem[];
  servicesList: ServiceItem[];
  addService: (service: Partial<ServiceItem>) => Promise<void>;
  updateService: (id: string, service: Partial<ServiceItem>) => Promise<void>;
  blogPosts: BlogPost[];
  addBlogPost: (post: Partial<BlogPost>) => Promise<void>;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => Promise<void>;

  // CMS Homepage Sections
  homepageSections: CmsPageSection[];
  updateSection: (id: string, data: Partial<CmsPageSection>) => Promise<void>;

  // Agents
  agents: UserProfile[];
  addAgent: (agentData: Partial<UserProfile>) => Promise<void>;
  updateAgent: (id: string, agentData: Partial<UserProfile>) => Promise<void>;
  toggleAgentStatus: (id: string) => Promise<void>;

  // Media Library
  mediaItems: MediaItem[];
  addMediaItem: (media: Partial<MediaItem>) => Promise<void>;
  deleteMediaItem: (id: string) => Promise<void>;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Audit Logs
  auditLogs: AuditLog[];
  logAuditAction: (action: string, entity: string, entityId: string, details?: any) => void;

  // Testimonials
  testimonials: Testimonial[];

  // Toast / Status Notification
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const parseUrlRoute = (
  pathname: string
): { view: string; propertySlug?: string; projectSlug?: string; blogSlug?: string } => {
  const clean = pathname.replace(/\/$/, '') || '/';
  if (clean === '/' || clean === '') return { view: 'home' };
  if (clean === '/about') return { view: 'about' };
  if (clean === '/properties') return { view: 'properties' };
  if (clean.startsWith('/properties/')) {
    const slug = clean.replace('/properties/', '');
    return { view: 'property-detail', propertySlug: slug };
  }
  if (clean === '/projects') return { view: 'projects' };
  if (clean.startsWith('/projects/')) {
    const slug = clean.replace('/projects/', '');
    return { view: 'project-detail', projectSlug: slug };
  }
  if (clean === '/agents' || clean === '/agent-dashboard') return { view: 'agent-dashboard' };
  if (clean === '/admin' || clean === '/admin-dashboard') return { view: 'admin-dashboard' };
  if (clean === '/contact') return { view: 'contact' };
  if (clean === '/services') return { view: 'services' };
  if (clean === '/government-work') return { view: 'government-work' };
  if (clean === '/construction') return { view: 'construction' };
  if (clean === '/investment') return { view: 'investment' };
  if (clean === '/blog') return { view: 'blog' };
  if (clean.startsWith('/blog/')) {
    const slug = clean.replace('/blog/', '');
    return { view: 'blog-detail', blogSlug: slug };
  }
  if (clean === '/careers') return { view: 'careers' };
  if (clean === '/privacy') return { view: 'privacy' };
  if (clean === '/terms') return { view: 'terms' };
  if (clean === '/customer-portal') return { view: 'customer-portal' };
  return { view: 'home' };
};

const routeToPath = (
  view: string,
  params?: { propertySlug?: string; projectSlug?: string; blogSlug?: string }
): string => {
  switch (view) {
    case 'home':
      return '/';
    case 'about':
      return '/about';
    case 'properties':
      return '/properties';
    case 'property-detail':
      return params?.propertySlug ? `/properties/${params.propertySlug}` : '/properties';
    case 'projects':
      return '/projects';
    case 'project-detail':
      return params?.projectSlug ? `/projects/${params.projectSlug}` : '/projects';
    case 'agent-dashboard':
    case 'agents':
      return '/agents';
    case 'admin-dashboard':
    case 'admin':
      return '/admin';
    case 'contact':
      return '/contact';
    case 'services':
      return '/services';
    case 'government-work':
      return '/government-work';
    case 'construction':
      return '/construction';
    case 'investment':
      return '/investment';
    case 'blog':
      return '/blog';
    case 'blog-detail':
      return params?.blogSlug ? `/blog/${params.blogSlug}` : '/blog';
    case 'careers':
      return '/careers';
    case 'privacy':
      return '/privacy';
    case 'terms':
      return '/terms';
    case 'customer-portal':
      return '/customer-portal';
    default:
      return `/${view}`;
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Profiles & Auth State
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>(SEED_PROFILES);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(SEED_PROFILES[0]);
  const [currentRole, setCurrentRole] = useState<UserRole | 'guest'>(SEED_PROFILES[0].role);

  // Router & View State
  const initialRoute = typeof window !== 'undefined' ? parseUrlRoute(window.location.pathname) : { view: 'home' };
  const [currentView, setCurrentView] = useState<string>(initialRoute.view);
  const [selectedPropertySlug, setSelectedPropertySlug] = useState<string | null>(initialRoute.propertySlug || null);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(initialRoute.projectSlug || null);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(initialRoute.blogSlug || null);

  // Global Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('Any');
  const [filterPropertyType, setFilterPropertyType] = useState('Any');
  const [filterListingType, setFilterListingType] = useState('All');
  const [filterBudget, setFilterBudget] = useState('Any');

  // Supabase Source-of-Truth Data Collections
  const [properties, setProperties] = useState<Property[]>(SEED_PROPERTIES);
  const [propertiesLoading, setPropertiesLoading] = useState(true);

  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [leads, setLeads] = useState<Lead[]>(SEED_LEADS);
  const [leadsLoading, setLeadsLoading] = useState(true);

  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>(SEED_SITE_VISITS);
  const [servicesList, setServicesList] = useState<ServiceItem[]>(SEED_SERVICES);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(SEED_BLOG_POSTS);
  const [homepageSections, setHomepageSections] = useState<CmsPageSection[]>(services.DEFAULT_HOMEPAGE_SECTIONS);
  const [priceRequests, setPriceRequests] = useState<PropertyPriceChangeRequest[]>(SEED_PRICE_REQUESTS);
  const [deleteRequests, setDeleteRequests] = useState<PropertyDeleteRequest[]>(SEED_DELETE_REQUESTS);
  const [favorites, setFavorites] = useState<string[]>(['prop-001']);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(SEED_MEDIA);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(SEED_AUDIT_LOGS);
  const [testimonials] = useState<Testimonial[]>(SEED_TESTIMONIALS);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Database Connection Health State
  const [dbHealth, setDbHealth] = useState<SupabaseHealth>({
    isConfigured: isSupabaseConfigured,
    isConnected: false,
    projectId: supabaseProjectId,
    projectUrl: supabaseUrl,
    tables: {
      properties: false,
      projects: false,
      leads: false,
      site_visits: false,
      profiles: false,
    },
    hasTables: false,
    message: isSupabaseConfigured ? 'Connecting to Supabase...' : 'Supabase credentials not configured',
    checkedAt: new Date().toISOString(),
  });

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  }, []);

  const refreshDbHealth = useCallback(async (): Promise<SupabaseHealth> => {
    const health = await checkSupabaseConnection();
    setDbHealth(health);
    return health;
  }, []);

  // RBAC Permission checker
  const can = useCallback(
    (action: PermissionAction): boolean => {
      return services.can(currentUser, action);
    },
    [currentUser]
  );

  // Popstate listener for browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseUrlRoute(window.location.pathname);
      setCurrentView(parsed.view);
      setSelectedPropertySlug(parsed.propertySlug || null);
      setSelectedProjectSlug(parsed.projectSlug || null);
      setSelectedBlogSlug(parsed.blogSlug || null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation
  const navigate = (
    view: string,
    params?: { propertySlug?: string; projectSlug?: string; blogSlug?: string }
  ) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
    if (params?.propertySlug) setSelectedPropertySlug(params.propertySlug);
    if (params?.projectSlug) setSelectedProjectSlug(params.projectSlug);
    if (params?.blogSlug) setSelectedBlogSlug(params.blogSlug);

    if (typeof window !== 'undefined') {
      const targetPath = routeToPath(view, params);
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ view, params }, '', targetPath);
      }
    }
  };

  // ---------------------------------------------------------------------------
  // Load Production Data Directly from Supabase PostgreSQL
  // ---------------------------------------------------------------------------
  const refreshProperties = useCallback(async () => {
    setPropertiesLoading(true);
    try {
      const res = await services.getProperties({ pageSize: 50 });
      if (res.data && res.data.length > 0) {
        setProperties(res.data);
      }
    } catch (err: any) {
      console.warn('Properties load note:', err);
    } finally {
      setPropertiesLoading(false);
    }
  }, []);

  const refreshLeads = useCallback(async () => {
    setLeadsLoading(true);
    try {
      const res = await services.getLeads(currentRole === 'guest' ? undefined : currentRole, currentUser?.id);
      if (res && res.length > 0) {
        setLeads(res);
      }
    } catch (err: any) {
      console.warn('Leads load note:', err);
    } finally {
      setLeadsLoading(false);
    }
  }, [currentRole, currentUser?.id]);

  const loadInitialData = useCallback(async () => {
    const health = await checkSupabaseConnection();
    setDbHealth(health);

    // 1. Properties
    await refreshProperties();

    // 2. Leads
    await refreshLeads();

    // 3. Projects
    try {
      const prjs = await services.getProjects();
      if (prjs && prjs.length > 0) setProjects(prjs);
    } catch {}

    // 4. Site Visits
    try {
      const visits = await services.getSiteVisits(currentRole === 'guest' ? undefined : currentRole, currentUser?.id);
      if (visits && visits.length > 0) setSiteVisits(visits);
    } catch {}

    // 5. Price & Delete Requests
    try {
      const pReqs = await services.getPriceChangeRequests();
      if (pReqs && pReqs.length > 0) setPriceRequests(pReqs);
      const dReqs = await services.getDeleteRequests();
      if (dReqs && dReqs.length > 0) setDeleteRequests(dReqs);
    } catch {}

    // 6. Agents
    try {
      const ags = await services.getAgents();
      if (ags && ags.length > 0) {
        setAllProfiles((prev) => {
          const nonAgents = prev.filter((p) => p.role !== 'agent');
          return [...nonAgents, ...ags];
        });
      }
    } catch {}

    // 7. Services & Posts & CMS
    try {
      const srvs = await services.getServices();
      if (srvs && srvs.length > 0) setServicesList(srvs);

      const posts = await services.getPosts();
      if (posts && posts.length > 0) setBlogPosts(posts);

      const secs = await services.getHomepageSections();
      if (secs && secs.length > 0) setHomepageSections(secs);

      const notifs = await services.getNotifications(currentUser?.id, currentRole === 'guest' ? undefined : currentRole);
      if (notifs && notifs.length > 0) setNotifications(notifs);

      const logs = await services.getAuditLogs();
      if (logs && logs.length > 0) setAuditLogs(logs);
    } catch {}
  }, [currentRole, currentUser?.id, refreshProperties, refreshLeads]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Sync Local Seed Data to Supabase (Admin helper button)
  const syncLocalToSupabase = async (): Promise<{ success: boolean; message: string }> => {
    const health = await refreshDbHealth();
    if (!health.isConnected) {
      return { success: false, message: 'Cannot connect to Supabase endpoint.' };
    }
    if (!health.hasTables) {
      return {
        success: false,
        message: 'Database tables not yet created in Supabase. Please execute the SQL schema in Supabase SQL Editor.',
      };
    }

    try {
      let count = 0;
      for (const p of properties) {
        await services.createProperty(p, currentUser?.id);
        count++;
      }
      for (const l of leads) {
        await services.createLead(l);
      }
      for (const v of siteVisits) {
        await services.createSiteVisit(v);
      }
      await refreshProperties();
      showToast(`Successfully seeded ${count} properties to Supabase!`);
      return { success: true, message: `Successfully seeded ${count} properties to Supabase.` };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Sync failed.' };
    }
  };

  // ---------------------------------------------------------------------------
  // Auth & Role Switching
  // ---------------------------------------------------------------------------
  const switchRole = (role: UserRole | 'guest', profileId?: string) => {
    if (role === 'guest') {
      setCurrentUser(null);
      setCurrentRole('guest');
      showToast('Switched to Public Guest view');
      return;
    }

    const profile = profileId
      ? allProfiles.find((p) => p.id === profileId)
      : allProfiles.find((p) => p.role === role);

    if (profile) {
      setCurrentUser(profile);
      setCurrentRole(profile.role);
      services.logAudit('ROLE_SWITCH', 'auth', profile.id, null, { role: profile.role }, profile.id);
      showToast(`Logged in as ${profile.full_name} (${profile.role.toUpperCase()})`);
    }
  };

  const loginAs = (role: UserRole) => {
    const profile = allProfiles.find((p) => p.role === role);
    if (profile) {
      setCurrentUser(profile);
      setCurrentRole(profile.role);
      services.logAudit('USER_LOGIN', 'auth', profile.id, null, { role }, profile.id);
      showToast(`Welcome back, ${profile.full_name}!`);
    }
  };

  const logout = async () => {
    await services.signOut();
    setCurrentUser(null);
    setCurrentRole('guest');
    showToast('Logged out successfully');
    navigate('home');
  };

  // ---------------------------------------------------------------------------
  // Production Mutations Delegated to Supabase Services
  // ---------------------------------------------------------------------------

  const addProperty = async (propertyData: Partial<Property>): Promise<Property | null> => {
    if (!can('property.create')) {
      showToast('Unauthorized: You do not have permission to create properties.');
      return null;
    }

    // Agents can create in 'draft' or 'under_review' only; Admins can publish directly
    const targetStatus = currentRole === 'admin' || currentRole === 'super_admin'
      ? propertyData.status || 'published'
      : 'draft';

    const { property, error } = await services.createProperty(
      {
        ...propertyData,
        status: targetStatus,
        created_by: currentUser?.id || 'usr-admin-01',
        assigned_agent_id: propertyData.assigned_agent_id || currentUser?.id,
      },
      currentUser?.id
    );

    if (error) {
      showToast(`Database Notice: ${error}`);
      return null;
    }

    if (property) {
      setProperties((prev) => [property, ...prev]);
      showToast(
        currentRole === 'admin'
          ? `Property ${property.property_id} created and published!`
          : `Property saved as draft #${property.property_id}`
      );
      return property;
    }

    return null;
  };

  const updateProperty = async (id: string, propertyData: Partial<Property>) => {
    if (!can('property.edit')) {
      showToast('Unauthorized: Cannot edit property.');
      return;
    }

    const { success, error } = await services.updateProperty(id, propertyData, currentUser?.id);
    if (!success) {
      showToast(`Database Notice: ${error}`);
      return;
    }

    setProperties((prev) =>
      prev.map((prop) => (prop.id === id ? { ...prop, ...propertyData, updated_at: new Date().toISOString() } : prop))
    );
    showToast('Property listing updated successfully');
  };

  const submitPropertyForReview = async (id: string) => {
    const { success, error } = await services.submitPropertyForReview(id, currentUser?.id);
    if (!success) {
      showToast(`Database Notice: ${error}`);
      return;
    }

    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'under_review', updated_at: new Date().toISOString() } : p))
    );
    showToast('Property submitted to SunPropMart Admin for review');
  };

  const approveProperty = async (id: string, notes?: string) => {
    if (!can('property.approve')) {
      showToast('Unauthorized: Admin approval required.');
      return;
    }

    const { success, error } = await services.approveProperty(id, currentUser?.id || 'usr-admin-01', notes);
    if (!success) {
      showToast(`Database Notice: ${error}`);
      return;
    }

    setProperties((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'published',
              approved_by: currentUser?.id,
              published_at: new Date().toISOString(),
              review_notes: notes,
            }
          : p
      )
    );
    showToast('Property approved and published to website!');
  };

  const rejectProperty = async (id: string, notes?: string) => {
    if (!can('property.reject')) {
      showToast('Unauthorized: Admin authorization required.');
      return;
    }

    const { success, error } = await services.rejectProperty(id, currentUser?.id || 'usr-admin-01', notes);
    if (!success) {
      showToast(`Database Notice: ${error}`);
      return;
    }

    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'rejected', review_notes: notes } : p))
    );
    showToast('Property rejected with feedback');
  };

  const requestChangesProperty = async (id: string, notes?: string) => {
    const { success, error } = await services.requestChangesProperty(id, currentUser?.id || 'usr-admin-01', notes);
    if (!success) {
      showToast(`Database Notice: ${error}`);
      return;
    }

    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'changes_required', review_notes: notes } : p))
    );
    showToast('Feedback sent to submitting agent');
  };

  const requestPriceChange = async (propertyId: string, newPrice: number, reason: string) => {
    const prop = properties.find((p) => p.id === propertyId);
    if (!prop) return;

    const { success, error } = await services.requestPriceChange(
      propertyId,
      prop.title,
      currentUser?.id || 'usr-agent-01',
      currentUser?.full_name || 'Agent',
      prop.price,
      newPrice,
      reason
    );

    if (!success) {
      showToast(`Database Notice: ${error}`);
      return;
    }

    const pReqs = await services.getPriceChangeRequests();
    setPriceRequests(pReqs);
    showToast('Price change request submitted to Admin for approval');
  };

  const reviewPriceChange = async (requestId: string, approved: boolean, comment?: string) => {
    if (!can('property.price_change_direct')) {
      showToast('Unauthorized: Admin approval required.');
      return;
    }

    const req = priceRequests.find((r) => r.id === requestId);
    if (!req) return;

    const { success, error } = await services.reviewPriceChange(
      requestId,
      req.property_id,
      req.new_price,
      currentUser?.id || 'usr-admin-01',
      approved,
      comment
    );

    if (!success) {
      showToast(`Database Notice: ${error}`);
      return;
    }

    if (approved) {
      setProperties((prev) =>
        prev.map((p) => (p.id === req.property_id ? { ...p, price: req.new_price } : p))
      );
    }

    const pReqs = await services.getPriceChangeRequests();
    setPriceRequests(pReqs);
    showToast(approved ? 'Price change approved & property updated' : 'Price request rejected');
  };

  const requestDelete = async (propertyId: string, reason: string) => {
    const prop = properties.find((p) => p.id === propertyId);
    if (!prop) return;

    const { success, error } = await services.requestDelete(
      propertyId,
      prop.title,
      currentUser?.id || 'usr-agent-01',
      currentUser?.full_name || 'Agent',
      reason
    );

    if (!success) {
      showToast(`Database Notice: ${error}`);
      return;
    }

    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, status: 'delete_requested' } : p))
    );

    const dReqs = await services.getDeleteRequests();
    setDeleteRequests(dReqs);
    showToast('Delete request submitted to Admin for review');
  };

  const reviewDelete = async (requestId: string, approved: boolean, comment?: string) => {
    if (!can('property.delete')) {
      showToast('Unauthorized: Admin authorization required.');
      return;
    }

    const req = deleteRequests.find((r) => r.id === requestId);
    if (!req) return;

    const { success, error } = await services.reviewDeleteRequest(
      requestId,
      req.property_id,
      currentUser?.id || 'usr-admin-01',
      approved,
      comment
    );

    if (!success) {
      showToast(`Database Notice: ${error}`);
      return;
    }

    if (approved) {
      setProperties((prev) =>
        prev.map((p) =>
          p.id === req.property_id
            ? {
                ...p,
                status: 'archived',
                deleted_at: new Date().toISOString(),
                deleted_by: currentUser?.id,
                delete_reason: req.reason,
              }
            : p
        )
      );
      showToast('Property deletion approved. Soft-deleted and archived.');
    } else {
      setProperties((prev) =>
        prev.map((p) => (p.id === req.property_id ? { ...p, status: 'published' } : p))
      );
      showToast('Property delete request rejected. Listing preserved.');
    }

    const dReqs = await services.getDeleteRequests();
    setDeleteRequests(dReqs);
  };

  // Leads & CRM
  const addLead = async (leadData: Partial<Lead>) => {
    const { lead, error } = await services.createLead(leadData);
    if (error) {
      showToast(`Database Notice: ${error}`);
      return;
    }

    if (lead) {
      setLeads((prev) => [lead, ...prev]);
      showToast('Thank you! Your enquiry has been received. Our property specialist will contact you shortly.');
    }
  };

  const updateLeadStatus = async (leadId: string, status: Lead['status'], noteText?: string) => {
    const { success, error } = await services.updateLeadStatus(
      leadId,
      status,
      noteText,
      currentUser?.full_name || 'Agent',
      currentUser?.id
    );

    if (!success) {
      showToast(`Database Notice: ${error}`);
      return;
    }

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== leadId) return l;
        const notes = Array.isArray(l.notes) ? [...l.notes] : [];
        if (noteText) {
          notes.unshift({
            id: `note-${Date.now()}`,
            author: currentUser?.full_name || 'Agent',
            note: noteText,
            created_at: new Date().toISOString(),
          });
        }
        return { ...l, status, notes };
      })
    );
    showToast(`Lead status updated to ${status}`);
  };

  const assignLeadToAgent = async (leadId: string, agentId: string) => {
    const agent = allProfiles.find((p) => p.id === agentId);
    if (!agent) return;

    const { success, error } = await services.assignLead(
      leadId,
      agentId,
      agent.full_name,
      currentUser?.id
    );

    if (!success) {
      showToast(`Database Notice: ${error}`);
      return;
    }

    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, assigned_agent_id: agentId, assigned_agent_name: agent.full_name } : l))
    );
    showToast(`Lead assigned to ${agent.full_name}`);
  };

  // Site Visits
  const bookSiteVisit = async (visitData: Partial<SiteVisit>) => {
    const { siteVisit, error } = await services.createSiteVisit(visitData);
    if (error) {
      showToast(`Database Notice: ${error}`);
      return;
    }

    if (siteVisit) {
      setSiteVisits((prev) => [siteVisit, ...prev]);
      showToast(`Site visit request booked for ${siteVisit.visit_date} at ${siteVisit.visit_time}!`);
    }
  };

  const updateSiteVisitStatus = async (visitId: string, status: SiteVisit['status'], notes?: string) => {
    const { success, error } = await services.updateSiteVisitStatus(visitId, status, notes, currentUser?.id);
    if (!success) {
      showToast(`Database Notice: ${error}`);
      return;
    }

    setSiteVisits((prev) =>
      prev.map((v) => (v.id === visitId ? { ...v, status, notes: notes || v.notes } : v))
    );
    showToast(`Site visit status updated to ${status}`);
  };

  // Projects
  const addProject = async (projectData: Partial<Project>): Promise<Project | null> => {
    const { project, error } = await services.createProject(projectData, currentUser?.id);
    if (error) {
      showToast(`Database Notice: ${error}`);
      return null;
    }

    if (project) {
      setProjects((prev) => [project, ...prev]);
      showToast('Project created successfully');
      return project;
    }
    return null;
  };

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    const { success, error } = await services.updateProject(id, projectData, currentUser?.id);
    if (!success) {
      showToast(`Database Notice: ${error}`);
      return;
    }

    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...projectData } : p))
    );
    showToast('Project updated successfully');
  };

  const deleteProject = async (id: string) => {
    const { success, error } = await services.deleteProject(id, currentUser?.id);
    if (!success) {
      showToast(`Database Notice: ${error}`);
      return;
    }

    setProjects((prev) => prev.filter((p) => p.id !== id));
    showToast('Project removed');
  };

  // Agents Management
  const addAgent = async (agentData: Partial<UserProfile>) => {
    const { agent, error } = await services.createAgent(agentData, currentUser?.id);
    if (error) {
      showToast(`Database Notice: ${error}`);
      return;
    }

    if (agent) {
      setAllProfiles((prev) => [...prev, agent]);
      showToast(`Agent ${agent.full_name} registered successfully`);
    }
  };

  const updateAgent = async (id: string, agentData: Partial<UserProfile>) => {
    const { success, error } = await services.updateAgent(id, agentData, currentUser?.id);
    if (!success) {
      showToast(`Database Notice: ${error}`);
      return;
    }

    setAllProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...agentData } : p))
    );
    showToast('Agent details updated successfully');
  };

  const toggleAgentStatus = async (id: string) => {
    const target = allProfiles.find((p) => p.id === id);
    if (!target) return;

    const newStatus = !target.is_active;
    const { success, error } = await services.toggleAgentStatus(id, newStatus, currentUser?.id);
    if (!success) {
      showToast(`Database Notice: ${error}`);
      return;
    }

    setAllProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: newStatus } : p))
    );
    showToast(`Agent account ${newStatus ? 'activated' : 'deactivated'}`);
  };

  // Services & Blog CMS
  const addService = async (service: Partial<ServiceItem>) => {
    setServicesList((prev) => [service as ServiceItem, ...prev]);
    showToast('Service added to catalogue');
  };

  const updateService = async (id: string, service: Partial<ServiceItem>) => {
    setServicesList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...service } : s))
    );
    showToast('Service updated');
  };

  const addBlogPost = async (post: Partial<BlogPost>) => {
    const { post: newPost, error } = await services.createPost(post, currentUser?.id);
    if (error) {
      showToast(`Database Notice: ${error}`);
      return;
    }
    if (newPost) {
      setBlogPosts((prev) => [newPost, ...prev]);
      showToast('Blog article published');
    }
  };

  const updateBlogPost = async (id: string, post: Partial<BlogPost>) => {
    setBlogPosts((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...post } : b))
    );
    showToast('Article updated');
  };

  const updateSection = async (id: string, data: Partial<CmsPageSection>) => {
    const { success, error } = await services.updateHomepageSection(id, data, currentUser?.id);
    if (!success) {
      showToast(`Database Notice: ${error}`);
      return;
    }

    setHomepageSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
    showToast('Section settings updated');
  };

  // Media & Notifications
  const addMediaItem = async (media: Partial<MediaItem>) => {
    setMediaItems((prev) => [media as MediaItem, ...prev]);
    showToast('Media item recorded');
  };

  const deleteMediaItem = async (id: string) => {
    setMediaItems((prev) => prev.filter((m) => m.id !== id));
    showToast('Media item deleted');
  };

  const markNotificationRead = (id: string) => {
    services.markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const logAuditAction = (action: string, entity: string, entityId: string, details?: any) => {
    services.logAudit(
      action,
      entity,
      entityId,
      null,
      details,
      currentUser?.id,
      currentUser?.full_name,
      currentRole
    );
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(propertyId);
      if (exists) {
        showToast('Removed from saved properties');
        return prev.filter((id) => id !== propertyId);
      } else {
        showToast('Saved to your favorites');
        return [...prev, propertyId];
      }
    });
  };

  return (
    <AppContext.Provider
      value={{
        supabaseHealth: dbHealth,
        refreshSupabaseHealth: refreshDbHealth,
        syncLocalToSupabase,
        currentUser,
        currentRole,
        switchRole,
        loginAs,
        logout,
        allProfiles,
        can,
        currentView,
        selectedPropertySlug,
        selectedProjectSlug,
        selectedBlogSlug,
        navigate,
        searchQuery,
        setSearchQuery,
        filterLocation,
        setFilterLocation,
        filterPropertyType,
        setFilterPropertyType,
        filterListingType,
        setFilterListingType,
        filterBudget,
        setFilterBudget,
        properties,
        propertiesLoading,
        refreshProperties,
        addProperty,
        updateProperty,
        submitPropertyForReview,
        approveProperty,
        rejectProperty,
        requestChangesProperty,
        requestPriceChange,
        reviewPriceChange,
        priceRequests,
        requestDelete,
        reviewDelete,
        deleteRequests,
        favorites,
        toggleFavorite,
        projects,
        addProject,
        updateProject,
        deleteProject,
        leads,
        leadsLoading,
        refreshLeads,
        addLead,
        updateLeadStatus,
        assignLeadToAgent,
        siteVisits,
        bookSiteVisit,
        updateSiteVisitStatus,
        services: servicesList,
        servicesList,
        addService,
        updateService,
        blogPosts,
        addBlogPost,
        updateBlogPost,
        homepageSections,
        updateSection,
        agents: allProfiles.filter((p) => p.role === 'agent'),
        addAgent,
        updateAgent,
        toggleAgentStatus,
        mediaItems,
        addMediaItem,
        deleteMediaItem,
        notifications,
        markNotificationRead,
        clearNotifications,
        auditLogs,
        logAuditAction,
        testimonials,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
