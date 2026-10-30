export type UserRole = 'admin' | 'agent' | 'customer';

export type PropertyStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'changes_required'
  | 'approved'
  | 'published'
  | 'rejected'
  | 'sold'
  | 'rented'
  | 'archived'
  | 'delete_requested';

export type ListingType = 'sale' | 'rent' | 'lease';

export type PropertyCategory = 'residential' | 'commercial' | 'plots_land';

export type PropertyType =
  // Residential
  | 'Apartment'
  | 'Flat'
  | 'Villa'
  | 'Independent House'
  | 'Builder Floor'
  | 'Farm House'
  // Commercial
  | 'Office'
  | 'Shop'
  | 'Showroom'
  | 'Warehouse'
  | 'Industrial Property'
  | 'Commercial Building'
  // Land / Plots
  | 'Residential Plot'
  | 'Commercial Plot'
  | 'Agricultural Land'
  | 'Industrial Land'
  | 'Other Land';

export interface UserProfile {
  id: string;
  agent_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  designation?: string;
  territory?: string;
  avatar_url?: string;
  experience_years?: number;
  bio?: string;
  is_active: boolean;
  created_at: string;
}

export interface PropertyMedia {
  id: string;
  property_id: string;
  media_type: 'featured_image' | 'gallery' | 'video' | 'floor_plan' | 'brochure' | '360_tour';
  url: string;
  title?: string;
  display_order: number;
}

export interface PropertyDocument {
  id: string;
  property_id: string;
  doc_type: 'ownership' | 'registry' | 'approval' | 'rera' | 'legal' | 'other';
  title: string;
  file_url: string;
  file_size?: string;
  is_verified: boolean;
  uploaded_by: string;
  created_at: string;
}

export interface PropertyPriceChangeRequest {
  id: string;
  property_id: string;
  property_title: string;
  requested_by: string;
  requested_by_name: string;
  old_price: number;
  new_price: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  review_comment?: string;
  created_at: string;
  reviewed_at?: string;
}

export interface PropertyDeleteRequest {
  id: string;
  property_id: string;
  property_title: string;
  requested_by: string;
  requested_by_name: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  review_comment?: string;
  created_at: string;
  reviewed_at?: string;
}

export interface Property {
  id: string;
  property_id: string; // SPM-000001
  title: string;
  slug: string;
  property_type: PropertyType;
  category: PropertyCategory;
  listing_type: ListingType;
  status: PropertyStatus;
  description: string;
  short_description?: string;
  
  // Financials
  price: number;
  price_per_sqft?: number;
  rent?: number;
  security_deposit?: number;
  maintenance?: number;
  
  // Dimensions & Details
  area: number; // in sq ft
  carpet_area?: number;
  builtup_area?: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  total_floors?: number;
  parking?: number;
  facing?: string;
  furnishing?: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
  construction_year?: number;
  rera_number?: string;
  
  // Location
  state: string;
  district: string;
  city: string;
  locality: string;
  sector?: string;
  address: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  
  // Media & Features
  featured_image: string;
  gallery_images: string[];
  amenities: string[];
  video_url?: string;
  floor_plan_url?: string;
  brochure_url?: string;
  virtual_tour_url?: string;
  
  // Flags & Stats
  is_featured: boolean;
  is_verified: boolean;
  views_count: number;
  tag?: string; // e.g. "Ready to Move", "New Launch", "Pre-Launch", "Under Construction"
  
  // Workflow & Assignment
  assigned_agent_id?: string;
  assigned_agent_name?: string;
  assigned_agent_phone?: string;
  created_by: string;
  approved_by?: string;
  review_notes?: string;
  published_at?: string;
  
  // Soft delete
  deleted_at?: string;
  deleted_by?: string;
  delete_reason?: string;
  
  created_at: string;
  updated_at: string;
}

export type ProjectCategory =
  | 'Government Projects'
  | 'Private Projects'
  | 'Residential Projects'
  | 'Commercial Projects'
  | 'Infrastructure Projects'
  | 'Construction Projects';

export type ProjectStatus = 'upcoming' | 'ongoing' | 'completed' | 'archived';

export interface ConstructionMilestone {
  id: string;
  project_id: string;
  title: string;
  description: string;
  progress_percent: number;
  target_date: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface Project {
  id: string;
  project_id: string;
  name: string;
  slug: string;
  client: string;
  location: string;
  city: string;
  sector?: string;
  project_type: ProjectCategory;
  status: ProjectStatus;
  start_date: string;
  completion_date?: string;
  budget?: string;
  progress_percent: number;
  description: string;
  scope?: string;
  highlights: string[];
  images: string[];
  cover_image: string;
  tender_number?: string;
  authority_name?: string;
  created_by?: string;
  seo_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export type LeadSource =
  | 'Website'
  | 'Property Page'
  | 'Phone'
  | 'WhatsApp'
  | 'Facebook'
  | 'Instagram'
  | 'Google'
  | 'Referral'
  | 'Agent';

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Interested'
  | 'Follow-up'
  | 'Site Visit'
  | 'Negotiation'
  | 'Converted'
  | 'Lost';

export interface LeadNote {
  id: string;
  author: string;
  note: string;
  created_at: string;
}

export interface Lead {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  property_id?: string;
  property_title?: string;
  project_id?: string;
  project_name?: string;
  assigned_agent_id?: string;
  assigned_agent_name?: string;
  source: LeadSource;
  status: LeadStatus;
  budget_range?: string;
  preferred_location?: string;
  message?: string;
  follow_up_date?: string;
  notes: LeadNote[];
  created_at: string;
  updated_at: string;
}

export type SiteVisitStatus =
  | 'Requested'
  | 'Confirmed'
  | 'Rescheduled'
  | 'Completed'
  | 'Cancelled';

export interface SiteVisit {
  id: string;
  property_id: string;
  property_title: string;
  customer_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  assigned_agent_id?: string;
  assigned_agent_name?: string;
  visit_date: string;
  visit_time: string;
  status: SiteVisitStatus;
  notes?: string;
  created_at: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_content: string;
  category: string;
  icon: string;
  image_url: string;
  display_order: number;
  is_published: boolean;
  features: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  tags: string[];
  author_name: string;
  author_avatar?: string;
  read_time: string;
  status: 'draft' | 'published' | 'scheduled';
  published_at: string;
  views_count: number;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_role: string;
  company?: string;
  quote: string;
  rating: number;
  avatar_url: string;
  location?: string;
}

export interface NotificationItem {
  id: string;
  user_id?: string;
  role_target?: UserRole;
  title: string;
  message: string;
  link?: string;
  type: 'lead' | 'approval' | 'price_request' | 'delete_request' | 'site_visit' | 'system';
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  user_name: string;
  user_role: string;
  action: string;
  entity: string;
  entity_id: string;
  details?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  file_url: string;
  file_type: 'image' | 'video' | 'document' | 'pdf';
  file_size: string;
  category: string;
  uploaded_by: string;
  created_at: string;
}
