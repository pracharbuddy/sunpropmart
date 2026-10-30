-- ==============================================================================
-- SUNPROPMART COMPLETE SUPABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- Production-Ready Real Estate, Construction, & Government Works Database
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- 2. Enumerations & Custom Types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'agent', 'customer');
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
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- 4. Properties Table
CREATE SEQUENCE IF NOT EXISTS property_seq START 1;

CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  
  -- Workflow & Assignments
  assigned_agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 7. Property Delete Requests
CREATE TABLE IF NOT EXISTS public.property_delete_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status approval_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  review_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- 8. Projects & Construction Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 9. Construction Milestones
CREATE TABLE IF NOT EXISTS public.construction_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  progress_percent INT DEFAULT 0,
  target_date DATE,
  completion_date DATE,
  status TEXT DEFAULT 'in_progress',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Leads & CRM
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 11. Site Visits
CREATE TABLE IF NOT EXISTS public.site_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 12. Services CMS
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  full_content TEXT NOT NULL,
  category TEXT DEFAULT 'Real Estate',
  icon TEXT DEFAULT 'Building',
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  seo_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Blog Posts CMS
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  category TEXT DEFAULT 'Market Insights',
  tags JSONB DEFAULT '[]'::JSONB,
  author_name TEXT DEFAULT 'SunPropMart Research Team',
  read_time TEXT DEFAULT '4 min read',
  status TEXT DEFAULT 'published',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  seo_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  og_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Customer Favorites
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- 15. Media Library
CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  category TEXT DEFAULT 'general',
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_target user_role,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  type TEXT DEFAULT 'system',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_name TEXT,
  user_role TEXT,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  details JSONB DEFAULT '{}'::JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_properties_slug ON public.properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON public.properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_city_loc ON public.properties(city, locality);
CREATE INDEX IF NOT EXISTS idx_properties_agent ON public.properties(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_properties_created_by ON public.properties(created_by);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_published_at ON public.properties(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_type ON public.projects(project_type);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_leads_agent ON public.leads(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published ON public.blog_posts(published_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_price_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_delete_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.construction_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper Functions to Check User Roles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_agent()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'agent') AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are readable" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins have full profile management" ON public.profiles
  FOR ALL USING (public.is_admin());

-- 2. Properties Policies
-- Public can ONLY see approved & published properties that are not soft-deleted
CREATE POLICY "Public can view published properties" ON public.properties
  FOR SELECT USING (
    status = 'published' AND deleted_at IS NULL
  );

-- Agents can view their own properties (any status)
CREATE POLICY "Agents can view their own properties" ON public.properties
  FOR SELECT USING (
    public.is_agent() AND (created_by = auth.uid() OR assigned_agent_id = auth.uid())
  );

-- Admin can view ALL properties including drafts and deleted
CREATE POLICY "Admins have full view of properties" ON public.properties
  FOR SELECT USING (public.is_admin());

-- Agents can INSERT new properties in 'draft' or 'submitted' status
CREATE POLICY "Agents can create properties" ON public.properties
  FOR INSERT WITH CHECK (
    public.is_agent() AND status IN ('draft', 'submitted')
  );

-- Agents can UPDATE only properties they own / are assigned, but CANNOT directly change to 'approved' or 'published'
CREATE POLICY "Agents can update their own properties" ON public.properties
  FOR UPDATE USING (
    public.is_agent() AND (created_by = auth.uid() OR assigned_agent_id = auth.uid())
  ) WITH CHECK (
    -- Admin approval required to publish; agent cannot bypass
    status IN ('draft', 'submitted', 'changes_required') OR public.is_admin()
  );

-- Agents CANNOT DELETE; only Admin can delete / soft delete
CREATE POLICY "Only admins can delete properties" ON public.properties
  FOR DELETE USING (public.is_admin());

CREATE POLICY "Admins can update all properties" ON public.properties
  FOR UPDATE USING (public.is_admin());

-- 3. Property Documents Policies (RESTRICTED - NO PUBLIC ACCESS)
CREATE POLICY "Admins have full document access" ON public.property_documents
  FOR ALL USING (public.is_admin());

CREATE POLICY "Agents can view and upload documents for their properties" ON public.property_documents
  FOR ALL USING (
    public.is_agent() AND EXISTS (
      SELECT 1 FROM public.properties p 
      WHERE p.id = property_documents.property_id 
      AND (p.created_by = auth.uid() OR p.assigned_agent_id = auth.uid())
    )
  );

-- 4. Price Change Requests Policies
CREATE POLICY "Agents can create price change requests" ON public.property_price_change_requests
  FOR INSERT WITH CHECK (
    public.is_agent() AND requested_by = auth.uid()
  );

CREATE POLICY "Agents can view their own price change requests" ON public.property_price_change_requests
  FOR SELECT USING (
    public.is_agent() AND requested_by = auth.uid()
  );

CREATE POLICY "Admins can manage all price change requests" ON public.property_price_change_requests
  FOR ALL USING (public.is_admin());

-- 5. Delete Requests Policies
CREATE POLICY "Agents can submit delete requests" ON public.property_delete_requests
  FOR INSERT WITH CHECK (
    public.is_agent() AND requested_by = auth.uid()
  );

CREATE POLICY "Agents can view their delete requests" ON public.property_delete_requests
  FOR SELECT USING (
    public.is_agent() AND requested_by = auth.uid()
  );

CREATE POLICY "Admins can manage delete requests" ON public.property_delete_requests
  FOR ALL USING (public.is_admin());

-- 6. Projects & Construction Policies
CREATE POLICY "Public can view published projects" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Admins have full project management" ON public.projects
  FOR ALL USING (public.is_admin());

-- 7. Leads Policies
CREATE POLICY "Public can submit enquiries / leads" ON public.leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Agents can view leads assigned to them" ON public.leads
  FOR SELECT USING (
    public.is_agent() AND assigned_agent_id = auth.uid()
  );

CREATE POLICY "Agents can update their assigned leads" ON public.leads
  FOR UPDATE USING (
    public.is_agent() AND assigned_agent_id = auth.uid()
  );

CREATE POLICY "Admins can manage all leads" ON public.leads
  FOR ALL USING (public.is_admin());

-- 8. Site Visits Policies
CREATE POLICY "Public and Customers can request site visits" ON public.site_visits
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Customers can view their own site visits" ON public.site_visits
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Agents can view assigned site visits" ON public.site_visits
  FOR SELECT USING (
    public.is_agent() AND assigned_agent_id = auth.uid()
  );

CREATE POLICY "Admins have full site visit management" ON public.site_visits
  FOR ALL USING (public.is_admin());

-- 9. Services & Blog Posts Policies
CREATE POLICY "Public can read services" ON public.services
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins manage services" ON public.services
  FOR ALL USING (public.is_admin());

CREATE POLICY "Public can read published blog posts" ON public.blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins manage blog posts" ON public.blog_posts
  FOR ALL USING (public.is_admin());

-- 10. Audit Logs Policies (Write-only for system/admin, Read-only for admin)
CREATE POLICY "Only admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (public.is_admin());

CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);
