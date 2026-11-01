-- ==============================================================================
-- SUNPROPMART COMPLETE SUPABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- Production-Ready Real Estate, Construction, & Government Works Database
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Enumerations & Custom Types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM (
    'super_admin', 'admin', 'property_manager', 'sales_manager', 
    'agent', 'content_manager', 'crm_manager', 'construction_manager', 
    'account_manager', 'customer'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE property_status AS ENUM (
    'draft', 'submitted', 'under_review', 'changes_required', 
    'approved', 'published', 'rejected', 'sold', 'rented', 
    'archived', 'delete_requested'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE listing_type AS ENUM ('sale', 'rent', 'lease');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE project_category AS ENUM (
    'Government Projects', 'Private Projects', 'Residential Projects', 
    'Commercial Projects', 'Infrastructure Projects', 'Construction Projects'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE project_status AS ENUM ('upcoming', 'ongoing', 'completed', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE lead_status AS ENUM (
    'New', 'Contacted', 'Interested', 'Follow-up', 
    'Site Visit', 'Negotiation', 'Converted', 'Lost'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE site_visit_status AS ENUM (
    'Requested', 'Confirmed', 'Rescheduled', 'Completed', 'Cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. Profiles / Users Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR(30) UNIQUE,
  full_name TEXT NOT NULL,
  email CITEXT NOT NULL UNIQUE,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  designation TEXT DEFAULT 'Property Consultant',
  territory TEXT DEFAULT 'Delhi NCR',
  avatar_url TEXT,
  experience_years INT DEFAULT 5,
  bio TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Properties Sequence & Table
CREATE SEQUENCE IF NOT EXISTS property_seq START 1;

CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id VARCHAR(30) UNIQUE NOT NULL DEFAULT ('SPM-' || LPAD(nextval('property_seq')::TEXT, 6, '0')),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  property_type TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'residential',
  listing_type listing_type NOT NULL DEFAULT 'sale',
  status property_status NOT NULL DEFAULT 'draft',
  description TEXT NOT NULL,
  short_description TEXT,
  
  -- Financials
  price NUMERIC(15, 2) NOT NULL DEFAULT 0,
  price_per_sqft NUMERIC(10, 2),
  rent NUMERIC(12, 2) DEFAULT 0,
  security_deposit NUMERIC(12, 2) DEFAULT 0,
  maintenance NUMERIC(10, 2) DEFAULT 0,
  
  -- Specifications
  area NUMERIC(10, 2) NOT NULL,
  carpet_area NUMERIC(10, 2),
  builtup_area NUMERIC(10, 2),
  bedrooms INT DEFAULT 0,
  bathrooms INT DEFAULT 0,
  floor INT DEFAULT 0,
  total_floors INT DEFAULT 1,
  parking INT DEFAULT 0,
  facing TEXT,
  furnishing TEXT DEFAULT 'Semi-Furnished',
  construction_year INT,
  rera_number TEXT,
  
  -- Location
  state TEXT DEFAULT 'Uttar Pradesh',
  district TEXT DEFAULT 'Gautam Budh Nagar',
  city TEXT NOT NULL DEFAULT 'Greater Noida',
  locality TEXT NOT NULL,
  sector TEXT,
  address TEXT NOT NULL,
  pincode TEXT,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  
  -- Media & Highlights
  featured_image TEXT,
  gallery_images JSONB DEFAULT '[]'::JSONB,
  amenities JSONB DEFAULT '[]'::JSONB,
  video_url TEXT,
  floor_plan_url TEXT,
  brochure_url TEXT,
  virtual_tour_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT true,
  views_count INT DEFAULT 0,
  tag TEXT,
  
  -- Workflow & Assignments
  assigned_agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  review_notes TEXT,
  published_at TIMESTAMPTZ,
  
  -- Soft Delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  delete_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Property Documents (Private & Secure)
CREATE TABLE IF NOT EXISTS public.property_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  is_verified BOOLEAN DEFAULT false,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Property Price Change Requests
CREATE TABLE IF NOT EXISTS public.property_price_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  old_price NUMERIC(15, 2) NOT NULL,
  new_price NUMERIC(15, 2) NOT NULL,
  reason TEXT NOT NULL,
  status approval_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  review_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- 7. Property Price History
CREATE TABLE IF NOT EXISTS public.property_price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  price NUMERIC(15, 2) NOT NULL,
  changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Property Delete Requests
CREATE TABLE IF NOT EXISTS public.property_delete_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status approval_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  review_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- 9. Projects & Construction Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id VARCHAR(30) UNIQUE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  client TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  sector TEXT,
  project_type project_category NOT NULL,
  status project_status NOT NULL DEFAULT 'ongoing',
  start_date DATE,
  completion_date DATE,
  budget NUMERIC(15, 2),
  progress_percent INT DEFAULT 0,
  description TEXT NOT NULL,
  scope TEXT,
  highlights JSONB DEFAULT '[]'::JSONB,
  images JSONB DEFAULT '[]'::JSONB,
  cover_image TEXT,
  tender_number TEXT,
  authority_name TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  seo_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Leads & CRM Table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email CITEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  assigned_agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  source TEXT DEFAULT 'Website',
  status lead_status NOT NULL DEFAULT 'New',
  budget_range TEXT,
  preferred_location TEXT,
  message TEXT,
  follow_up_date DATE,
  notes JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Lead Assignments
CREATE TABLE IF NOT EXISTS public.lead_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Lead Status History
CREATE TABLE IF NOT EXISTS public.lead_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Site Visits Table
CREATE TABLE IF NOT EXISTS public.site_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email CITEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  assigned_agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  visit_date DATE NOT NULL,
  visit_time TEXT NOT NULL,
  status site_visit_status NOT NULL DEFAULT 'Requested',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. CMS Page Sections (Homepage & Landing Pages)
CREATE TABLE IF NOT EXISTS public.page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT,
  image_url TEXT,
  button_text TEXT,
  button_url TEXT,
  sort_order INT DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. CMS Pages
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'published',
  featured_image TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Services CMS
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  full_content TEXT NOT NULL,
  category TEXT DEFAULT 'Real Estate',
  icon TEXT DEFAULT 'Building',
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  features JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Blog Posts CMS
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT NOT NULL,
  category TEXT DEFAULT 'Market Trends',
  tags JSONB DEFAULT '[]'::JSONB,
  author_name TEXT DEFAULT 'SunPropMart Research',
  author_avatar TEXT,
  read_time TEXT DEFAULT '5 min read',
  status TEXT DEFAULT 'published',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  views_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_role TEXT NOT NULL,
  company TEXT,
  quote TEXT NOT NULL,
  rating INT DEFAULT 5,
  avatar_url TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Media Library
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. SEO Metadata
CREATE TABLE IF NOT EXISTS public.seo_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  seo_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  canonical_url TEXT,
  robots TEXT DEFAULT 'index, follow',
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(entity_type, entity_id)
);

-- 21. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_target user_role,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  type TEXT DEFAULT 'system',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL DEFAULT 'System',
  user_role TEXT NOT NULL DEFAULT 'system',
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. Settings
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- DATABASE INDEXES FOR OPTIMAL QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_properties_slug ON public.properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_created_by ON public.properties(created_by);
CREATE INDEX IF NOT EXISTS idx_properties_assigned_agent ON public.properties(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_locality ON public.properties(locality);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON public.properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_published_at ON public.properties(published_at);
CREATE INDEX IF NOT EXISTS idx_properties_deleted_at ON public.properties(deleted_at);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_type ON public.projects(project_type);

CREATE INDEX IF NOT EXISTS idx_leads_agent ON public.leads(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);

CREATE INDEX IF NOT EXISTS idx_site_visits_agent ON public.site_visits(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_site_visits_customer ON public.site_visits(customer_id);
CREATE INDEX IF NOT EXISTS idx_site_visits_date ON public.site_visits(visit_date);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);

-- ==============================================================================
-- SECURE POSTGRESQL ATOMIC FUNCTIONS (RPCs)
-- ==============================================================================

-- 1. Atomic Property Approval
CREATE OR REPLACE FUNCTION public.approve_property(
  p_property_id UUID,
  p_admin_id UUID,
  p_notes TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.properties
  SET 
    status = 'published',
    approved_by = p_admin_id,
    published_at = NOW(),
    review_notes = p_notes,
    updated_at = NOW()
  WHERE id = p_property_id;

  INSERT INTO public.audit_logs (user_id, action, entity, entity_id, details)
  VALUES (p_admin_id, 'PROPERTY_APPROVED', 'properties', p_property_id::TEXT, json_build_object('notes', p_notes));

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Atomic Price Change Approval
CREATE OR REPLACE FUNCTION public.approve_price_change(
  p_request_id UUID,
  p_admin_id UUID,
  p_comment TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  v_prop_id UUID;
  v_new_price NUMERIC;
BEGIN
  SELECT property_id, new_price INTO v_prop_id, v_new_price
  FROM public.property_price_change_requests
  WHERE id = p_request_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Price request not found';
  END IF;

  UPDATE public.property_price_change_requests
  SET status = 'approved', reviewed_by = p_admin_id, reviewed_at = NOW(), review_comment = p_comment
  WHERE id = p_request_id;

  UPDATE public.properties
  SET price = v_new_price, updated_at = NOW()
  WHERE id = v_prop_id;

  INSERT INTO public.property_price_history (property_id, price, changed_by, reason)
  VALUES (v_prop_id, v_new_price, p_admin_id, p_comment);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Atomic Lead Assignment
CREATE OR REPLACE FUNCTION public.assign_lead(
  p_lead_id UUID,
  p_agent_id UUID,
  p_assigner_id UUID,
  p_notes TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.leads
  SET assigned_agent_id = p_agent_id, updated_at = NOW()
  WHERE id = p_lead_id;

  INSERT INTO public.lead_assignments (lead_id, agent_id, assigned_by, notes)
  VALUES (p_lead_id, p_agent_id, p_assigner_id, p_notes);

  INSERT INTO public.notifications (user_id, title, message, link, type)
  VALUES (p_agent_id, 'New Lead Assigned', 'You have been assigned a client enquiry.', 'agent-leads', 'lead');

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_price_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_delete_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Helper security functions
CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS TEXT AS $$
  SELECT role::TEXT FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_agent()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('agent', 'admin', 'super_admin')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles are readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admins have full profile management" ON public.profiles FOR ALL USING (public.is_admin());

-- Properties Policies
-- 1. Public can read only published, non-deleted properties
CREATE POLICY "Public read published properties" ON public.properties
  FOR SELECT USING (status = 'published' AND deleted_at IS NULL);

-- 2. Agents can view their own properties (including drafts and under_review)
CREATE POLICY "Agents view their own properties" ON public.properties
  FOR SELECT USING (
    (public.is_agent() AND (created_by = auth.uid() OR assigned_agent_id = auth.uid()))
    OR public.is_admin()
  );

-- 3. Agents can insert properties as draft or submitted only
CREATE POLICY "Agents create draft properties" ON public.properties
  FOR INSERT WITH CHECK (
    public.is_agent() 
    AND status IN ('draft', 'submitted', 'under_review')
    AND created_by = auth.uid()
  );

-- 4. Agents can update only their own properties and CANNOT directly publish
CREATE POLICY "Agents edit their properties" ON public.properties
  FOR UPDATE USING (
    public.is_agent() AND (created_by = auth.uid() OR assigned_agent_id = auth.uid())
  ) WITH CHECK (
    status != 'published' -- Direct publish blocked for agents
  );

-- 5. Admins have complete control (Approve, Publish, Soft-delete)
CREATE POLICY "Admins manage all properties" ON public.properties
  FOR ALL USING (public.is_admin());

-- Property Documents Policies (Private documents protected)
CREATE POLICY "Admins view all documents" ON public.property_documents
  FOR ALL USING (public.is_admin());

CREATE POLICY "Agents view assigned property documents" ON public.property_documents
  FOR SELECT USING (
    public.is_agent() AND EXISTS (
      SELECT 1 FROM public.properties p 
      WHERE p.id = property_id AND (p.created_by = auth.uid() OR p.assigned_agent_id = auth.uid())
    )
  );

-- Price Change Requests Policies
CREATE POLICY "Agents submit price requests" ON public.property_price_change_requests
  FOR INSERT WITH CHECK (public.is_agent() AND requested_by = auth.uid());

CREATE POLICY "Agents view their price requests" ON public.property_price_change_requests
  FOR SELECT USING (public.is_agent() AND requested_by = auth.uid());

CREATE POLICY "Admins manage price requests" ON public.property_price_change_requests
  FOR ALL USING (public.is_admin());

-- Delete Requests Policies
CREATE POLICY "Agents submit delete requests" ON public.property_delete_requests
  FOR INSERT WITH CHECK (public.is_agent() AND requested_by = auth.uid());

CREATE POLICY "Agents view their delete requests" ON public.property_delete_requests
  FOR SELECT USING (public.is_agent() AND requested_by = auth.uid());

CREATE POLICY "Admins manage delete requests" ON public.property_delete_requests
  FOR ALL USING (public.is_admin());

-- Projects Policies
CREATE POLICY "Public view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admins manage projects" ON public.projects FOR ALL USING (public.is_admin());

-- Leads Policies
CREATE POLICY "Public submit enquiries" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Agents view assigned leads" ON public.leads FOR SELECT USING (
  public.is_admin() OR (public.is_agent() AND assigned_agent_id = auth.uid())
);
CREATE POLICY "Agents update assigned leads" ON public.leads FOR UPDATE USING (
  public.is_admin() OR (public.is_agent() AND assigned_agent_id = auth.uid())
);
CREATE POLICY "Admins manage leads" ON public.leads FOR ALL USING (public.is_admin());

-- Site Visits Policies
CREATE POLICY "Public request site visits" ON public.site_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Customers view own site visits" ON public.site_visits FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "Agents view assigned site visits" ON public.site_visits FOR SELECT USING (
  public.is_admin() OR (public.is_agent() AND assigned_agent_id = auth.uid())
);
CREATE POLICY "Admins manage site visits" ON public.site_visits FOR ALL USING (public.is_admin());

-- CMS, Services & Blog Policies
CREATE POLICY "Public view page sections" ON public.page_sections FOR SELECT USING (enabled = true);
CREATE POLICY "Admins manage page sections" ON public.page_sections FOR ALL USING (public.is_admin());

CREATE POLICY "Public view published pages" ON public.pages FOR SELECT USING (status = 'published');
CREATE POLICY "Admins manage pages" ON public.pages FOR ALL USING (public.is_admin());

CREATE POLICY "Public view services" ON public.services FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage services" ON public.services FOR ALL USING (public.is_admin());

CREATE POLICY "Public view posts" ON public.posts FOR SELECT USING (status = 'published');
CREATE POLICY "Admins manage posts" ON public.posts FOR ALL USING (public.is_admin());

CREATE POLICY "Public view testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Admins manage testimonials" ON public.testimonials FOR ALL USING (public.is_admin());

CREATE POLICY "Public view seo metadata" ON public.seo_metadata FOR SELECT USING (true);
CREATE POLICY "Admins manage seo metadata" ON public.seo_metadata FOR ALL USING (public.is_admin());

CREATE POLICY "Users view their notifications" ON public.notifications FOR SELECT USING (
  user_id = auth.uid() OR role_target::TEXT = public.get_current_role()
);

CREATE POLICY "Admins view audit logs" ON public.audit_logs FOR SELECT USING (public.is_admin());
CREATE POLICY "System insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Public view settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.settings FOR ALL USING (public.is_admin());

-- Initial Settings Seed
INSERT INTO public.settings (key, value)
VALUES 
  ('company_info', '{
    "company_name": "SunPropMart Real Estate & Construction",
    "phone": "+91 98730 83899",
    "email": "info@sunpropmart.in",
    "address": "F-2, Krishna Plaza, Upper HDFC Bank, Alpha-I Commercial Belt, Greater Noida, Uttar Pradesh 201310",
    "hours": "Mon - Sat: 9:00 AM - 7:00 PM"
  }'::JSONB)
ON CONFLICT (key) DO NOTHING;
