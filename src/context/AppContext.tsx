import React, { createContext, useContext, useState, useEffect } from 'react';
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
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface AppContextType {
  // Authentication & RBAC
  currentUser: UserProfile | null;
  currentRole: UserRole | 'guest';
  switchRole: (role: UserRole | 'guest', profileId?: string) => void;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  allProfiles: UserProfile[];

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

  // Properties & Workflows
  properties: Property[];
  addProperty: (propertyData: Partial<Property>) => Promise<Property>;
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
  addProject: (projectData: Partial<Project>) => Promise<Project>;
  updateProject: (id: string, projectData: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Leads & CRM
  leads: Lead[];
  addLead: (leadData: Partial<Lead>) => Promise<void>;
  updateLeadStatus: (leadId: string, status: Lead['status'], noteText?: string) => Promise<void>;
  assignLeadToAgent: (leadId: string, agentId: string) => Promise<void>;

  // Site Visits
  siteVisits: SiteVisit[];
  bookSiteVisit: (visitData: Partial<SiteVisit>) => Promise<void>;
  updateSiteVisitStatus: (visitId: string, status: SiteVisit['status'], notes?: string) => Promise<void>;

  // Services & Blog
  services: ServiceItem[];
  addService: (service: Partial<ServiceItem>) => Promise<void>;
  updateService: (id: string, service: Partial<ServiceItem>) => Promise<void>;
  blogPosts: BlogPost[];
  addBlogPost: (post: Partial<BlogPost>) => Promise<void>;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => Promise<void>;

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

const parseUrlRoute = (pathname: string): { view: string; propertySlug?: string; projectSlug?: string; blogSlug?: string } => {
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
  if (clean === '/customer-portal') return { view: 'customer-portal' };
  return { view: 'home' };
};

const routeToPath = (view: string, params?: { propertySlug?: string; projectSlug?: string; blogSlug?: string }): string => {
  switch (view) {
    case 'home': return '/';
    case 'about': return '/about';
    case 'properties': return '/properties';
    case 'property-detail': return params?.propertySlug ? `/properties/${params.propertySlug}` : '/properties';
    case 'projects': return '/projects';
    case 'project-detail': return params?.projectSlug ? `/projects/${params.projectSlug}` : '/projects';
    case 'agent-dashboard':
    case 'agents': return '/agents';
    case 'admin-dashboard':
    case 'admin': return '/admin';
    case 'contact': return '/contact';
    case 'services': return '/services';
    case 'government-work': return '/government-work';
    case 'construction': return '/construction';
    case 'investment': return '/investment';
    case 'blog': return '/blog';
    case 'blog-detail': return params?.blogSlug ? `/blog/${params.blogSlug}` : '/blog';
    case 'customer-portal': return '/customer-portal';
    default: return `/${view}`;
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage cache keys
  const getStorage = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`spm_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const setStorage = (key: string, value: any) => {
    try {
      localStorage.setItem(`spm_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  };

  // State initialization
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>(() =>
    getStorage('profiles', SEED_PROFILES)
  );
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = getStorage<UserProfile | null>('currentUser', null);
    // default to Guest or Admin for demo ease, but let's provide Vikram (Admin) by default
    return saved || SEED_PROFILES[0];
  });
  const [currentRole, setCurrentRole] = useState<UserRole | 'guest'>(() => {
    return currentUser ? currentUser.role : 'admin';
  });

  const initialRoute = typeof window !== 'undefined' ? parseUrlRoute(window.location.pathname) : { view: 'home' };
  const [currentView, setCurrentView] = useState<string>(initialRoute.view);
  const [selectedPropertySlug, setSelectedPropertySlug] = useState<string | null>(initialRoute.propertySlug || null);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(initialRoute.projectSlug || null);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(initialRoute.blogSlug || null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('Any');
  const [filterPropertyType, setFilterPropertyType] = useState('Any');
  const [filterListingType, setFilterListingType] = useState('All');
  const [filterBudget, setFilterBudget] = useState('Any');

  // Entities
  const [properties, setProperties] = useState<Property[]>(() =>
    getStorage('properties', SEED_PROPERTIES)
  );
  const [projects, setProjects] = useState<Project[]>(() =>
    getStorage('projects', SEED_PROJECTS)
  );
  const [leads, setLeads] = useState<Lead[]>(() => getStorage('leads', SEED_LEADS));
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>(() =>
    getStorage('site_visits', SEED_SITE_VISITS)
  );
  const [services, setServices] = useState<ServiceItem[]>(() =>
    getStorage('services', SEED_SERVICES)
  );
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() =>
    getStorage('blog_posts', SEED_BLOG_POSTS)
  );
  const [priceRequests, setPriceRequests] = useState<PropertyPriceChangeRequest[]>(() =>
    getStorage('price_requests', SEED_PRICE_REQUESTS)
  );
  const [deleteRequests, setDeleteRequests] = useState<PropertyDeleteRequest[]>(() =>
    getStorage('delete_requests', SEED_DELETE_REQUESTS)
  );
  const [favorites, setFavorites] = useState<string[]>(() =>
    getStorage('favorites', ['prop-001'])
  );
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() =>
    getStorage('media', SEED_MEDIA)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    getStorage('audit_logs', SEED_AUDIT_LOGS)
  );
  const [testimonials] = useState<Testimonial[]>(SEED_TESTIMONIALS);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'New Lead Assigned',
      message: 'Priya Kapoor requested a site visit for ATS Nobility Luxury 3 BHK.',
      type: 'lead',
      link: 'agent-leads',
      is_read: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 'notif-2',
      title: 'Price Change Requested',
      message: 'Rahul Sharma submitted a price change request for Gaur City 2.',
      type: 'price_request',
      link: 'admin-properties',
      is_read: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Sync to local storage
  useEffect(() => {
    setStorage('properties', properties);
  }, [properties]);

  useEffect(() => {
    setStorage('projects', projects);
  }, [projects]);

  useEffect(() => {
    setStorage('leads', leads);
  }, [leads]);

  useEffect(() => {
    setStorage('site_visits', siteVisits);
  }, [siteVisits]);

  useEffect(() => {
    setStorage('price_requests', priceRequests);
  }, [priceRequests]);

  useEffect(() => {
    setStorage('delete_requests', deleteRequests);
  }, [deleteRequests]);

  useEffect(() => {
    setStorage('favorites', favorites);
  }, [favorites]);

  useEffect(() => {
    setStorage('blog_posts', blogPosts);
  }, [blogPosts]);

  useEffect(() => {
    setStorage('services', services);
  }, [services]);

  useEffect(() => {
    setStorage('profiles', allProfiles);
  }, [allProfiles]);

  useEffect(() => {
    setStorage('audit_logs', auditLogs);
  }, [auditLogs]);

  useEffect(() => {
    setStorage('currentUser', currentUser);
  }, [currentUser]);

  // Audit Logging
  const logAuditAction = (action: string, entity: string, entityId: string, details?: any) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      user_id: currentUser?.id,
      user_name: currentUser?.full_name || 'Anonymous',
      user_role: currentRole,
      action,
      entity,
      entity_id: entityId,
      details,
      ip_address: '103.24.120.45',
      created_at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Role switching & Auth
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
      logAuditAction('ROLE_SWITCH', 'auth', profile.id, { role: profile.role });
      showToast(`Logged in as ${profile.full_name} (${profile.role.toUpperCase()})`);
    }
  };

  const loginAs = (role: UserRole) => {
    const profile = allProfiles.find((p) => p.role === role);
    if (profile) {
      setCurrentUser(profile);
      setCurrentRole(profile.role);
      logAuditAction('USER_LOGIN', 'auth', profile.id, { role });
      showToast(`Welcome back, ${profile.full_name}!`);
    }
  };

  const logout = () => {
    if (currentUser) {
      logAuditAction('USER_LOGOUT', 'auth', currentUser.id);
    }
    setCurrentUser(null);
    setCurrentRole('guest');
    showToast('Logged out successfully');
    navigate('home');
  };

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

  // Favorites
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

  // Property CRUD & Workflows
  const addProperty = async (propertyData: Partial<Property>): Promise<Property> => {
    const seqNum = properties.length + 1;
    const propertyIdCode = `SPM-${String(seqNum).padStart(6, '0')}`;
    const slug = (propertyData.title || `Property ${seqNum}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      property_id: propertyIdCode,
      title: propertyData.title || 'Untitled Property',
      slug,
      property_type: propertyData.property_type || 'Apartment',
      category: propertyData.category || 'residential',
      listing_type: propertyData.listing_type || 'sale',
      // Agents can only create in 'draft' or 'under_review' status; Admin can create directly 'published'
      status: currentRole === 'admin' ? (propertyData.status || 'published') : (propertyData.status || 'draft'),
      description: propertyData.description || '',
      short_description: propertyData.short_description || '',
      price: Number(propertyData.price) || 0,
      price_per_sqft: propertyData.area ? Math.round(Number(propertyData.price) / Number(propertyData.area)) : undefined,
      rent: propertyData.rent ? Number(propertyData.rent) : undefined,
      maintenance: propertyData.maintenance ? Number(propertyData.maintenance) : undefined,
      area: Number(propertyData.area) || 1000,
      bedrooms: propertyData.bedrooms ? Number(propertyData.bedrooms) : undefined,
      bathrooms: propertyData.bathrooms ? Number(propertyData.bathrooms) : undefined,
      floor: propertyData.floor ? Number(propertyData.floor) : undefined,
      total_floors: propertyData.total_floors ? Number(propertyData.total_floors) : undefined,
      parking: propertyData.parking ? Number(propertyData.parking) : undefined,
      facing: propertyData.facing || 'East',
      furnishing: propertyData.furnishing || 'Semi-Furnished',
      construction_year: propertyData.construction_year || 2024,
      rera_number: propertyData.rera_number || '',
      state: propertyData.state || 'Uttar Pradesh',
      district: propertyData.district || 'Gautam Budh Nagar',
      city: propertyData.city || 'Greater Noida West',
      locality: propertyData.locality || 'Sector 4',
      sector: propertyData.sector || 'Sector 4',
      address: propertyData.address || 'Greater Noida West, U.P.',
      pincode: propertyData.pincode || '201306',
      featured_image:
        propertyData.featured_image ||
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
      gallery_images: propertyData.gallery_images?.length
        ? propertyData.gallery_images
        : [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
          ],
      amenities: propertyData.amenities || ['Power Backup', 'Security 24/7', 'Car Parking'],
      video_url: propertyData.video_url || '',
      floor_plan_url: propertyData.floor_plan_url || '',
      is_featured: Boolean(propertyData.is_featured),
      is_verified: true,
      views_count: 0,
      assigned_agent_id: currentUser?.id || 'usr-agent-01',
      assigned_agent_name: currentUser?.full_name || 'Rahul Sharma',
      assigned_agent_phone: currentUser?.phone || '+91 98112 34567',
      created_by: currentUser?.id || 'usr-agent-01',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: currentRole === 'admin' ? new Date().toISOString() : undefined,
    };

    setProperties((prev) => [newProperty, ...prev]);
    logAuditAction('PROPERTY_CREATED', 'properties', newProperty.id, {
      title: newProperty.title,
      status: newProperty.status,
    });

    showToast(
      currentRole === 'admin'
        ? `Property ${propertyIdCode} created and published successfully!`
        : `Property ${propertyIdCode} saved as ${newProperty.status}!`
    );

    return newProperty;
  };

  const updateProperty = async (id: string, propertyData: Partial<Property>) => {
    setProperties((prev) =>
      prev.map((prop) => {
        if (prop.id !== id) return prop;

        // Security enforcement: Agents cannot directly set status to 'published'
        let targetStatus = prop.status;
        if (propertyData.status) {
          if (currentRole === 'admin') {
            targetStatus = propertyData.status;
          } else {
            // Agent can only set 'draft' or 'under_review'
            targetStatus =
              propertyData.status === 'published' ? 'under_review' : propertyData.status;
          }
        }

        return {
          ...prop,
          ...propertyData,
          status: targetStatus,
          updated_at: new Date().toISOString(),
        };
      })
    );

    logAuditAction('PROPERTY_EDITED', 'properties', id, { updates: propertyData });
    showToast('Property updated successfully');
  };

  const submitPropertyForReview = async (id: string) => {
    setProperties((prev) =>
      prev.map((prop) =>
        prop.id === id
          ? { ...prop, status: 'under_review', updated_at: new Date().toISOString() }
          : prop
      )
    );
    logAuditAction('PROPERTY_SUBMITTED_FOR_REVIEW', 'properties', id);
    // Notification for admin
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Property Submitted for Review',
      message: `${currentUser?.full_name || 'Agent'} submitted property #${id} for approval.`,
      type: 'approval',
      link: 'admin-properties',
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast('Property submitted to SunPropMart Admin for review');
  };

  const approveProperty = async (id: string, notes?: string) => {
    if (currentRole !== 'admin') {
      showToast('Unauthorized: Admin approval required');
      return;
    }
    setProperties((prev) =>
      prev.map((prop) =>
        prop.id === id
          ? {
              ...prop,
              status: 'published',
              approved_by: currentUser?.id,
              published_at: new Date().toISOString(),
              review_notes: notes,
              updated_at: new Date().toISOString(),
            }
          : prop
      )
    );
    logAuditAction('PROPERTY_APPROVED', 'properties', id, { notes });
    showToast('Property approved and published to website!');
  };

  const rejectProperty = async (id: string, notes?: string) => {
    if (currentRole !== 'admin') return;
    setProperties((prev) =>
      prev.map((prop) =>
        prop.id === id
          ? {
              ...prop,
              status: 'rejected',
              review_notes: notes,
              updated_at: new Date().toISOString(),
            }
          : prop
      )
    );
    logAuditAction('PROPERTY_REJECTED', 'properties', id, { notes });
    showToast('Property rejected with feedback');
  };

  const requestChangesProperty = async (id: string, notes?: string) => {
    if (currentRole !== 'admin') return;
    setProperties((prev) =>
      prev.map((prop) =>
        prop.id === id
          ? {
              ...prop,
              status: 'changes_required',
              review_notes: notes,
              updated_at: new Date().toISOString(),
            }
          : prop
      )
    );
    logAuditAction('PROPERTY_CHANGES_REQUESTED', 'properties', id, { notes });
    showToast('Status changed to Changes Required');
  };

  // Price Change Workflow
  const requestPriceChange = async (propertyId: string, newPrice: number, reason: string) => {
    const prop = properties.find((p) => p.id === propertyId);
    if (!prop) return;

    const newReq: PropertyPriceChangeRequest = {
      id: `pr-${Date.now()}`,
      property_id: propertyId,
      property_title: prop.title,
      requested_by: currentUser?.id || 'usr-agent-01',
      requested_by_name: currentUser?.full_name || 'Agent',
      old_price: prop.price,
      new_price: newPrice,
      reason,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    setPriceRequests((prev) => [newReq, ...prev]);
    logAuditAction('PRICE_CHANGE_REQUESTED', 'property_price_change_requests', newReq.id, {
      old_price: prop.price,
      new_price: newPrice,
      reason,
    });
    showToast('Price change request submitted to Admin for approval');
  };

  const reviewPriceChange = async (requestId: string, approved: boolean, comment?: string) => {
    if (currentRole !== 'admin') return;
    const req = priceRequests.find((r) => r.id === requestId);
    if (!req) return;

    setPriceRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: approved ? 'approved' : 'rejected',
              reviewed_by: currentUser?.id,
              review_comment: comment,
              reviewed_at: new Date().toISOString(),
            }
          : r
      )
    );

    if (approved) {
      setProperties((prev) =>
        prev.map((p) =>
          p.id === req.property_id
            ? {
                ...p,
                price: req.new_price,
                price_per_sqft: p.area ? Math.round(req.new_price / p.area) : p.price_per_sqft,
                updated_at: new Date().toISOString(),
              }
            : p
        )
      );
      showToast(`Price change approved! Property price updated to ₹${(req.new_price / 100000).toFixed(2)} Lac`);
    } else {
      showToast('Price change request rejected');
    }

    logAuditAction('PRICE_CHANGE_REVIEWED', 'property_price_change_requests', requestId, {
      approved,
      comment,
    });
  };

  // Delete Request Workflow (Soft Delete)
  const requestDelete = async (propertyId: string, reason: string) => {
    const prop = properties.find((p) => p.id === propertyId);
    if (!prop) return;

    const newReq: PropertyDeleteRequest = {
      id: `dr-${Date.now()}`,
      property_id: propertyId,
      property_title: prop.title,
      requested_by: currentUser?.id || 'usr-agent-01',
      requested_by_name: currentUser?.full_name || 'Agent',
      reason,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    setDeleteRequests((prev) => [newReq, ...prev]);
    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, status: 'delete_requested' } : p))
    );

    logAuditAction('DELETE_REQUESTED', 'property_delete_requests', newReq.id, { reason });
    showToast('Delete request submitted to Admin for review');
  };

  const reviewDelete = async (requestId: string, approved: boolean, comment?: string) => {
    if (currentRole !== 'admin') return;
    const req = deleteRequests.find((r) => r.id === requestId);
    if (!req) return;

    setDeleteRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: approved ? 'approved' : 'rejected',
              reviewed_by: currentUser?.id,
              review_comment: comment,
              reviewed_at: new Date().toISOString(),
            }
          : r
      )
    );

    if (approved) {
      // Soft delete: keep record, set deleted_at & reason
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
      showToast('Property delete request rejected. Listing kept active.');
    }

    logAuditAction('DELETE_REQUEST_REVIEWED', 'property_delete_requests', requestId, {
      approved,
      comment,
    });
  };

  // Projects & Construction
  const addProject = async (projectData: Partial<Project>): Promise<Project> => {
    const seq = projects.length + 1;
    const slug = (projectData.name || `Project ${seq}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      project_id: `SPM-PRJ-${String(seq).padStart(2, '0')}`,
      name: projectData.name || 'New Project',
      slug,
      client: projectData.client || 'SunPropMart Infrastructure',
      location: projectData.location || 'Greater Noida',
      city: projectData.city || 'Greater Noida',
      project_type: projectData.project_type || 'Residential Projects',
      status: projectData.status || 'ongoing',
      start_date: projectData.start_date || new Date().toISOString().split('T')[0],
      completion_date: projectData.completion_date,
      budget: projectData.budget || '₹100 Cr',
      progress_percent: projectData.progress_percent || 0,
      description: projectData.description || '',
      scope: projectData.scope || '',
      highlights: projectData.highlights || [],
      images: projectData.images?.length
        ? projectData.images
        : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80'],
      cover_image:
        projectData.cover_image ||
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
      created_by: currentUser?.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setProjects((prev) => [newProject, ...prev]);
    logAuditAction('PROJECT_CREATED', 'projects', newProject.id, { name: newProject.name });
    showToast(`Project "${newProject.name}" added successfully`);
    return newProject;
  };

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === id ? { ...proj, ...projectData, updated_at: new Date().toISOString() } : proj
      )
    );
    logAuditAction('PROJECT_EDITED', 'projects', id);
    showToast('Project updated successfully');
  };

  const deleteProject = async (id: string) => {
    if (currentRole !== 'admin') return;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    logAuditAction('PROJECT_DELETED', 'projects', id);
    showToast('Project removed');
  };

  // Leads & CRM
  const addLead = async (leadData: Partial<Lead>) => {
    const assignedAgent = allProfiles.find((p) => p.role === 'agent') || allProfiles[1];
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      customer_name: leadData.customer_name || 'Enquiry Visitor',
      customer_email: leadData.customer_email || 'visitor@example.com',
      customer_phone: leadData.customer_phone || '+91 98000 00000',
      property_id: leadData.property_id,
      property_title: leadData.property_title,
      project_id: leadData.project_id,
      project_name: leadData.project_name,
      assigned_agent_id: leadData.assigned_agent_id || assignedAgent?.id,
      assigned_agent_name: leadData.assigned_agent_name || assignedAgent?.full_name,
      source: leadData.source || 'Website',
      status: 'New',
      budget_range: leadData.budget_range,
      preferred_location: leadData.preferred_location,
      message: leadData.message,
      notes: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setLeads((prev) => [newLead, ...prev]);
    logAuditAction('LEAD_RECEIVED', 'leads', newLead.id, {
      customer: newLead.customer_name,
      property: newLead.property_title,
    });

    // Notify agent
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Lead Inbound',
      message: `${newLead.customer_name} enquired about ${newLead.property_title || 'a property'}.`,
      type: 'lead',
      link: 'agent-leads',
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast('Thank you! Your enquiry has been received. Our property specialist will contact you shortly.');
  };

  const updateLeadStatus = async (leadId: string, status: Lead['status'], noteText?: string) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== leadId) return lead;
        const updatedNotes = [...lead.notes];
        if (noteText) {
          updatedNotes.unshift({
            id: `note-${Date.now()}`,
            author: currentUser?.full_name || 'Agent',
            note: noteText,
            created_at: new Date().toISOString(),
          });
        }
        return {
          ...lead,
          status,
          notes: updatedNotes,
          updated_at: new Date().toISOString(),
        };
      })
    );
    logAuditAction('LEAD_STATUS_UPDATED', 'leads', leadId, { status, noteText });
    showToast(`Lead status updated to ${status}`);
  };

  const assignLeadToAgent = async (leadId: string, agentId: string) => {
    const agent = allProfiles.find((p) => p.id === agentId);
    if (!agent) return;

    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              assigned_agent_id: agent.id,
              assigned_agent_name: agent.full_name,
              updated_at: new Date().toISOString(),
            }
          : l
      )
    );
    showToast(`Lead assigned to ${agent.full_name}`);
    logAuditAction('LEAD_REASSIGNED', 'leads', leadId, { new_agent: agent.full_name });
  };

  // Site Visits
  const bookSiteVisit = async (visitData: Partial<SiteVisit>) => {
    const assignedAgent = allProfiles.find((p) => p.role === 'agent') || allProfiles[1];
    const newVisit: SiteVisit = {
      id: `sv-${Date.now()}`,
      property_id: visitData.property_id || '',
      property_title: visitData.property_title || 'SunPropMart Property',
      customer_id: currentUser?.id,
      customer_name: visitData.customer_name || currentUser?.full_name || 'Prospective Buyer',
      customer_email: visitData.customer_email || currentUser?.email || 'buyer@example.com',
      customer_phone: visitData.customer_phone || currentUser?.phone || '+91 98000 00000',
      assigned_agent_id: visitData.assigned_agent_id || assignedAgent?.id,
      assigned_agent_name: visitData.assigned_agent_name || assignedAgent?.full_name,
      visit_date: visitData.visit_date || new Date().toISOString().split('T')[0],
      visit_time: visitData.visit_time || '11:00 AM',
      status: 'Requested',
      notes: visitData.notes,
      created_at: new Date().toISOString(),
    };

    setSiteVisits((prev) => [newVisit, ...prev]);
    logAuditAction('SITE_VISIT_BOOKED', 'site_visits', newVisit.id, {
      date: newVisit.visit_date,
      time: newVisit.visit_time,
    });
    showToast(`Site visit request booked for ${newVisit.visit_date} at ${newVisit.visit_time}!`);
  };

  const updateSiteVisitStatus = async (
    visitId: string,
    status: SiteVisit['status'],
    notes?: string
  ) => {
    setSiteVisits((prev) =>
      prev.map((sv) =>
        sv.id === visitId
          ? { ...sv, status, notes: notes || sv.notes, updated_at: new Date().toISOString() }
          : sv
      )
    );
    showToast(`Site visit status changed to ${status}`);
    logAuditAction('SITE_VISIT_STATUS_UPDATED', 'site_visits', visitId, { status });
  };

  // Services & Blog
  const addService = async (service: Partial<ServiceItem>) => {
    const seq = services.length + 1;
    const newSrv: ServiceItem = {
      id: `srv-${Date.now()}`,
      title: service.title || 'New Service',
      slug: (service.title || `service-${seq}`).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      short_description: service.short_description || '',
      full_content: service.full_content || '',
      category: service.category || 'Real Estate',
      icon: service.icon || 'Building',
      image_url: service.image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
      display_order: seq,
      is_published: true,
      features: service.features || [],
    };
    setServices((prev) => [...prev, newSrv]);
    showToast(`Service "${newSrv.title}" added`);
  };

  const updateService = async (id: string, service: Partial<ServiceItem>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...service } : s)));
    showToast('Service updated');
  };

  const addBlogPost = async (post: Partial<BlogPost>) => {
    const newPost: BlogPost = {
      id: `blog-${Date.now()}`,
      title: post.title || 'Market Update',
      slug: (post.title || 'market-update').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: post.excerpt || '',
      content: post.content || '',
      featured_image:
        post.featured_image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
      category: post.category || 'Market Insights',
      tags: post.tags || ['Real Estate'],
      author_name: currentUser?.full_name || 'SunPropMart Editorial',
      read_time: '4 min read',
      status: post.status || 'published',
      published_at: new Date().toISOString(),
      views_count: 0,
    };
    setBlogPosts((prev) => [newPost, ...prev]);
    showToast(`Blog article "${newPost.title}" published`);
  };

  const updateBlogPost = async (id: string, post: Partial<BlogPost>) => {
    setBlogPosts((prev) => prev.map((b) => (b.id === id ? { ...b, ...post } : b)));
    showToast('Blog article updated');
  };

  // Agents Management
  const addAgent = async (agentData: Partial<UserProfile>) => {
    const seq = allProfiles.filter((p) => p.role === 'agent').length + 1;
    const newAgent: UserProfile = {
      id: `usr-agent-${Date.now()}`,
      agent_id: `SPM-AG-${100 + seq}`,
      full_name: agentData.full_name || 'New Consultant',
      email: agentData.email || `agent${seq}@sunpropmart.com`,
      phone: agentData.phone || '+91 98000 00000',
      role: 'agent',
      designation: agentData.designation || 'Property Consultant',
      territory: agentData.territory || 'Delhi NCR',
      experience_years: agentData.experience_years || 3,
      bio: agentData.bio || 'Authorized SunPropMart property consultant.',
      is_active: true,
      avatar_url:
        agentData.avatar_url ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
    };
    setAllProfiles((prev) => [...prev, newAgent]);
    logAuditAction('AGENT_CREATED', 'profiles', newAgent.id, { name: newAgent.full_name });
    showToast(`Agent ${newAgent.full_name} (${newAgent.agent_id}) added`);
  };

  const updateAgent = async (id: string, agentData: Partial<UserProfile>) => {
    setAllProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, ...agentData } : p)));
    showToast('Agent details updated');
  };

  const toggleAgentStatus = async (id: string) => {
    setAllProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: !p.is_active } : p))
    );
    showToast('Agent active status toggled');
  };

  // Media Library
  const addMediaItem = async (media: Partial<MediaItem>) => {
    const newItem: MediaItem = {
      id: `med-${Date.now()}`,
      filename: media.filename || 'uploaded-file.jpg',
      file_url:
        media.file_url ||
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
      file_type: media.file_type || 'image',
      file_size: media.file_size || '1.8 MB',
      category: media.category || 'general',
      uploaded_by: currentUser?.full_name || 'Admin',
      created_at: new Date().toISOString(),
    };
    setMediaItems((prev) => [newItem, ...prev]);
    showToast(`Asset "${newItem.filename}" added to media library`);
  };

  const deleteMediaItem = async (id: string) => {
    setMediaItems((prev) => prev.filter((m) => m.id !== id));
    showToast('Media asset removed');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        switchRole,
        loginAs,
        logout,
        allProfiles,
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
        addLead,
        updateLeadStatus,
        assignLeadToAgent,
        siteVisits,
        bookSiteVisit,
        updateSiteVisitStatus,
        services,
        addService,
        updateService,
        blogPosts,
        addBlogPost,
        updateBlogPost,
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
