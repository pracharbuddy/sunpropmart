import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Property, Lead, Project, UserProfile } from '../../types';
import {
  Shield,
  Building,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Users,
  Calendar,
  Layers,
  FileText,
  DollarSign,
  Search,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Check,
  X,
  TrendingUp,
  Image as ImageIcon,
  Activity,
  UserPlus,
  Database,
  RefreshCw,
  ExternalLink,
  Copy,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    properties,
    projects,
    leads,
    siteVisits,
    agents,
    priceRequests,
    deleteRequests,
    auditLogs,
    mediaItems,
    approveProperty,
    rejectProperty,
    requestChangesProperty,
    reviewPriceChange,
    reviewDelete,
    updateLeadStatus,
    assignLeadToAgent,
    updateSiteVisitStatus,
    addAgent,
    toggleAgentStatus,
    addMediaItem,
    deleteMediaItem,
    showToast,
    navigate,
    supabaseHealth,
    refreshSupabaseHealth,
    syncLocalToSupabase,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'properties'
    | 'price-requests'
    | 'delete-requests'
    | 'projects'
    | 'agents'
    | 'leads'
    | 'site-visits'
    | 'media'
    | 'audit-logs'
    | 'supabase'
  >('overview');

  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Filter state
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('all');
  const [searchPropertyText, setSearchPropertyText] = useState('');

  // Modals / forms
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentEmail, setNewAgentEmail] = useState('');
  const [newAgentPhone, setNewAgentPhone] = useState('');
  const [newAgentTerritory, setNewAgentTerritory] = useState('Greater Noida West');

  // Review comment modal state
  const [reviewNote, setReviewNote] = useState('');
  const [selectedPropertyForAction, setSelectedPropertyForAction] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'reject' | 'changes' | null>(null);

  // Statistics
  const totalProperties = properties.length;
  const publishedCount = properties.filter((p) => p.status === 'published' && !p.deleted_at).length;
  const pendingApprovalsCount = properties.filter((p) => p.status === 'under_review').length;
  const pendingPriceCount = priceRequests.filter((r) => r.status === 'pending').length;
  const pendingDeleteCount = deleteRequests.filter((r) => r.status === 'pending').length;
  const totalLeads = leads.length;
  const convertedLeads = leads.filter((l) => l.status === 'Converted').length;
  const pendingVisits = siteVisits.filter((v) => v.status === 'Requested').length;

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName || !newAgentEmail) return;
    await addAgent({
      full_name: newAgentName,
      email: newAgentEmail,
      phone: newAgentPhone,
      territory: newAgentTerritory,
    });
    setNewAgentName('');
    setNewAgentEmail('');
    setNewAgentPhone('');
    setShowAddAgentModal(false);
  };

  const handleConfirmPropertyAction = async () => {
    if (!selectedPropertyForAction || !actionType) return;
    if (actionType === 'reject') {
      await rejectProperty(selectedPropertyForAction, reviewNote);
    } else if (actionType === 'changes') {
      await requestChangesProperty(selectedPropertyForAction, reviewNote);
    }
    setSelectedPropertyForAction(null);
    setActionType(null);
    setReviewNote('');
  };

  return (
    <div className="bg-[#070D1A] min-h-screen text-slate-200">
      {/* Top Banner */}
      <div className="bg-[#0B1528] border-b border-white/10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                  Principal Control Console
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                  ADMIN
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                SunPropMart Administration Hub
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('home')}
              className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-colors"
            >
              Public Website
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className="px-4 py-2 rounded-lg bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-md transition-all"
            >
              Manage Catalog
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-white/10 text-xs font-bold scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            {
              id: 'properties',
              label: `Properties (${pendingApprovalsCount} Pending)`,
              icon: Building,
              badge: pendingApprovalsCount,
            },
            {
              id: 'price-requests',
              label: `Price Requests (${pendingPriceCount})`,
              icon: DollarSign,
              badge: pendingPriceCount,
            },
            {
              id: 'delete-requests',
              label: `Delete Requests (${pendingDeleteCount})`,
              icon: Trash2,
              badge: pendingDeleteCount,
            },
            { id: 'leads', label: `CRM Leads (${totalLeads})`, icon: Users },
            { id: 'site-visits', label: `Site Visits (${pendingVisits})`, icon: Calendar },
            { id: 'agents', label: `Agents (${agents.length})`, icon: UserPlus },
            { id: 'projects', label: `Projects (${projects.length})`, icon: Layers },
            { id: 'media', label: 'Media Library', icon: ImageIcon },
            { id: 'audit-logs', label: 'Audit Logs', icon: Activity },
            {
              id: 'supabase',
              label: 'Supabase DB',
              icon: Database,
              badge: supabaseHealth.isConnected ? 'CONNECTED' : undefined,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E5B842] text-slate-950 font-extrabold shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.badge ? (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      isActive ? 'bg-slate-950 text-white' : 'bg-amber-500 text-slate-950'
                    }`}
                  >
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-5 rounded-2xl bg-[#0F1D38] border border-white/10 shadow-sm">
                <div className="text-xs text-slate-400 font-semibold">Total Properties</div>
                <div className="text-3xl font-black text-white mt-2">{totalProperties}</div>
                <div className="text-[11px] text-emerald-400 mt-1">
                  {publishedCount} Active & Live
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F1D38] border border-white/10 shadow-sm">
                <div className="text-xs text-slate-400 font-semibold">Pending Approvals</div>
                <div className="text-3xl font-black text-amber-400 mt-2">
                  {pendingApprovalsCount}
                </div>
                <div className="text-[11px] text-amber-300 mt-1">Awaiting Review</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F1D38] border border-white/10 shadow-sm">
                <div className="text-xs text-slate-400 font-semibold">Inbound Leads</div>
                <div className="text-3xl font-black text-white mt-2">{totalLeads}</div>
                <div className="text-[11px] text-emerald-400 mt-1">
                  {convertedLeads} Deals Closed
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F1D38] border border-white/10 shadow-sm">
                <div className="text-xs text-slate-400 font-semibold">Scheduled Site Visits</div>
                <div className="text-3xl font-black text-blue-400 mt-2">{siteVisits.length}</div>
                <div className="text-[11px] text-blue-300 mt-1">{pendingVisits} New Requests</div>
              </div>
            </div>

            {/* Supabase Cloud Database Status Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0F1D38] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl ${
                    supabaseHealth.isConnected
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm">Supabase PostgreSQL Database</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        supabaseHealth.isConnected
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {supabaseHealth.isConnected ? 'Connected & Active' : 'Connecting...'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Project ID: <span className="font-mono text-amber-300/90">{supabaseHealth.projectId}</span> • Endpoint: {supabaseHealth.projectUrl}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('supabase')}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Manage Supabase</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pending Approvals Quick Banner */}
            {pendingApprovalsCount > 0 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      {pendingApprovalsCount} Property Listing(s) Waiting For Your Approval
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Agents have submitted properties for review. They will NOT appear publicly
                      until approved.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('properties')}
                  className="px-4 py-2 rounded-lg bg-[#E5B842] text-slate-950 font-bold text-xs uppercase tracking-wider shrink-0"
                >
                  Review Listings
                </button>
              </div>
            )}

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Recent Inbound Leads */}
              <div className="lg:col-span-7 bg-[#0F1D38] rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white text-base">Recent Inbound CRM Leads</h3>
                  <button
                    onClick={() => setActiveTab('leads')}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    View CRM
                  </button>
                </div>

                <div className="space-y-3">
                  {leads.slice(0, 4).map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-white">{lead.customer_name}</div>
                        <div className="text-slate-400 mt-0.5">
                          {lead.property_title || 'General Enquiry'} · {lead.customer_phone}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300">
                          {lead.status}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {lead.assigned_agent_name || 'Unassigned'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Audit Log Stream */}
              <div className="lg:col-span-5 bg-[#0F1D38] rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white text-base">Security & Audit Stream</h3>
                  <button
                    onClick={() => setActiveTab('audit-logs')}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    All Logs
                  </button>
                </div>

                <div className="space-y-2.5">
                  {auditLogs.slice(0, 5).map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-lg bg-white/5 text-xs text-slate-300 flex items-start gap-2"
                    >
                      <Activity className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white">{log.user_name}: </span>
                        <span>{log.action}</span>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {new Date(log.created_at).toLocaleTimeString()} · Entity: {log.entity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. PROPERTIES TAB (Approval Queue & Management) */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            {/* Filter toolbar */}
            <div className="bg-[#0F1D38] rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
                {['all', 'under_review', 'published', 'draft', 'changes_required', 'rejected'].map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setPropertyFilter(st)}
                      className={`px-3 py-1.5 rounded-lg capitalize whitespace-nowrap ${
                        propertyFilter === st
                          ? 'bg-[#E5B842] text-slate-950 font-bold'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  )
                )}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchPropertyText}
                  onChange={(e) => setSearchPropertyText(e.target.value)}
                  placeholder="Filter by title or ID..."
                  className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Properties Table */}
            <div className="bg-[#0F1D38] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#070D1A] text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">Property</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Agent / Creator</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Approval Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {properties
                      .filter((p) => (propertyFilter === 'all' ? true : p.status === propertyFilter))
                      .filter((p) =>
                        searchPropertyText
                          ? p.title.toLowerCase().includes(searchPropertyText.toLowerCase()) ||
                            p.property_id.toLowerCase().includes(searchPropertyText.toLowerCase())
                          : true
                      )
                      .map((property) => (
                        <tr key={property.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={property.featured_image}
                                alt=""
                                className="w-12 h-9 rounded object-cover shrink-0"
                              />
                              <div>
                                <span className="font-mono text-[10px] text-amber-400 block font-bold">
                                  {property.property_id}
                                </span>
                                <span className="font-bold text-white hover:text-amber-300">
                                  {property.title}
                                </span>
                                <div className="text-[10px] text-slate-400">
                                  {property.locality}, {property.city}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-slate-300">
                            <div>{property.property_type}</div>
                            <span className="text-[10px] text-slate-500 uppercase">
                              {property.listing_type}
                            </span>
                          </td>

                          <td className="py-3 px-4 font-bold text-white font-mono">
                            ₹{(property.price / 100000).toFixed(2)} Lac
                          </td>

                          <td className="py-3 px-4 text-slate-300">
                            <div>{property.assigned_agent_name || 'Admin'}</div>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                property.status === 'published'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : property.status === 'under_review'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : property.status === 'changes_required'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : property.status === 'rejected'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : 'bg-slate-700 text-slate-300'
                              }`}
                            >
                              {property.status.replace('_', ' ')}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Approve Button */}
                              {property.status !== 'published' && (
                                <button
                                  onClick={() => approveProperty(property.id)}
                                  className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white transition-colors"
                                  title="Approve & Publish to Website"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}

                              {/* Request Changes Button */}
                              <button
                                onClick={() => {
                                  setSelectedPropertyForAction(property.id);
                                  setActionType('changes');
                                }}
                                className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white transition-colors"
                                title="Request Changes from Agent"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {/* Reject Button */}
                              {property.status !== 'rejected' && (
                                <button
                                  onClick={() => {
                                    setSelectedPropertyForAction(property.id);
                                    setActionType('reject');
                                  }}
                                  className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white transition-colors"
                                  title="Reject Listing"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}

                              {/* View on Public Site */}
                              <button
                                onClick={() =>
                                  navigate('property-detail', { propertySlug: property.slug })
                                }
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. PRICE CHANGE REQUESTS TAB */}
        {activeTab === 'price-requests' && (
          <div className="space-y-6">
            <div className="bg-[#0F1D38] rounded-2xl p-6 border border-white/10">
              <h2 className="text-lg font-bold text-white mb-1">
                Agent Price Change Requests Approval
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Agents cannot alter listing prices directly. Admin verification ensures valuation
                integrity.
              </p>

              {priceRequests.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  No price change requests submitted.
                </div>
              ) : (
                <div className="space-y-4">
                  {priceRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-5 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-white text-sm">{req.property_title}</div>
                        <div className="text-xs text-slate-400">
                          Requested by <strong className="text-amber-300">{req.requested_by_name}</strong> ·{' '}
                          {new Date(req.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-slate-300 mt-2">
                          <strong className="text-slate-400">Reason: </strong>
                          {req.reason}
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono pt-2">
                          <span className="text-slate-400 line-through">
                            Old: ₹{(req.old_price / 100000).toFixed(2)} Lac
                          </span>
                          <span className="text-emerald-400 font-bold text-sm">
                            New: ₹{(req.new_price / 100000).toFixed(2)} Lac
                          </span>
                        </div>
                      </div>

                      {req.status === 'pending' ? (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => reviewPriceChange(req.id, true)}
                            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase"
                          >
                            Approve Price
                          </button>
                          <button
                            onClick={() => reviewPriceChange(req.id, false, 'Price hike unjustified')}
                            className="px-4 py-2 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs uppercase"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            req.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {req.status}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. DELETE REQUESTS TAB */}
        {activeTab === 'delete-requests' && (
          <div className="space-y-6">
            <div className="bg-[#0F1D38] rounded-2xl p-6 border border-white/10">
              <h2 className="text-lg font-bold text-white mb-1">
                Property Deletion Approval Queue
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Under company policy, agents cannot directly purge properties. Admin approval triggers
                safe soft-deletion.
              </p>

              {deleteRequests.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  No deletion requests pending.
                </div>
              ) : (
                <div className="space-y-4">
                  {deleteRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-5 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="font-bold text-white text-sm">{req.property_title}</div>
                        <div className="text-xs text-slate-400">
                          Submitted by {req.requested_by_name} ·{' '}
                          {new Date(req.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-rose-300 mt-2 bg-rose-950/40 p-2 rounded border border-rose-900/50">
                          <strong>Deletion Reason: </strong>
                          {req.reason}
                        </div>
                      </div>

                      {req.status === 'pending' ? (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => reviewDelete(req.id, true)}
                            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase"
                          >
                            Confirm Soft Delete
                          </button>
                          <button
                            onClick={() => reviewDelete(req.id, false, 'Property must remain active')}
                            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase"
                          >
                            Reject Deletion
                          </button>
                        </div>
                      ) : (
                        <span className="px-3 py-1 rounded text-xs font-bold uppercase bg-slate-700 text-slate-300">
                          {req.status}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. LEADS CRM TAB */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="bg-[#0F1D38] rounded-2xl p-6 border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Full Inbound Lead Pipeline</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Track client conversion lifecycle, assign authorized consultants, and record follow-up notes.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Status:</span>
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg p-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Site Visit">Site Visit</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#070D1A] text-slate-400 uppercase text-[10px] font-bold border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Property of Interest</th>
                      <th className="py-3 px-4">Assigned Agent</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {leads
                      .filter((l) => (leadStatusFilter === 'all' ? true : l.status === leadStatusFilter))
                      .map((lead) => (
                        <tr key={lead.id} className="hover:bg-white/5">
                          <td className="py-3 px-4 font-bold text-white">{lead.customer_name}</td>
                          <td className="py-3 px-4 text-slate-300">
                            <div>{lead.customer_phone}</div>
                            <div className="text-[11px] text-slate-500">{lead.customer_email}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {lead.property_title || lead.project_name || 'General Inquiry'}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={lead.assigned_agent_id || ''}
                              onChange={(e) => assignLeadToAgent(lead.id, e.target.value)}
                              className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-amber-300 focus:outline-none"
                            >
                              <option value="">Unassigned</option>
                              {agents.map((a) => (
                                <option key={a.id} value={a.id}>
                                  {a.full_name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={lead.status}
                              onChange={(e) =>
                                updateLeadStatus(lead.id, e.target.value as any, 'Status updated by Admin')
                              }
                              className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Interested">Interested</option>
                              <option value="Site Visit">Site Visit</option>
                              <option value="Negotiation">Negotiation</option>
                              <option value="Converted">Converted</option>
                              <option value="Lost">Lost</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right text-slate-400">
                            {lead.message && (
                              <span className="text-[10px] italic truncate max-w-xs block">
                                &ldquo;{lead.message}&rdquo;
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6. AGENTS TAB */}
        {activeTab === 'agents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Authorized Agent Roster</h2>
                <p className="text-xs text-slate-400">
                  Manage consultants, territories, and active licensing status.
                </p>
              </div>

              <button
                onClick={() => setShowAddAgentModal(true)}
                className="px-4 py-2 rounded-xl bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Agent</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-[#0F1D38] rounded-2xl p-6 border border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {agent.agent_id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          agent.is_active
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {agent.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={agent.avatar_url}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400/40"
                      />
                      <div>
                        <h3 className="font-bold text-white text-base">{agent.full_name}</h3>
                        <div className="text-xs text-slate-400">{agent.designation}</div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1 pt-2 border-t border-white/5">
                      <div>
                        <span className="text-slate-500">Territory: </span>
                        {agent.territory}
                      </div>
                      <div>
                        <span className="text-slate-500">Email: </span>
                        {agent.email}
                      </div>
                      <div>
                        <span className="text-slate-500">Phone: </span>
                        {agent.phone}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => toggleAgentStatus(agent.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded transition-colors ${
                        agent.is_active
                          ? 'bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white'
                          : 'bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white'
                      }`}
                    >
                      {agent.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <span className="text-[11px] text-slate-500">
                      {agent.experience_years} Years Experience
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. AUDIT LOGS TAB */}
        {activeTab === 'audit-logs' && (
          <div className="bg-[#0F1D38] rounded-2xl p-6 border border-white/10">
            <h2 className="text-lg font-bold text-white mb-1">System Security & Audit Log Trail</h2>
            <p className="text-xs text-slate-400 mb-6">
              Immutable record of property submissions, reviews, role switches, and pricing updates.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#070D1A] text-slate-400 uppercase text-[10px] font-bold border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Operator</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Entity</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5">
                      <td className="py-2.5 px-4 text-slate-400">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 font-sans font-bold text-white">
                        {log.user_name}
                      </td>
                      <td className="py-2.5 px-4 uppercase text-amber-300">{log.user_role}</td>
                      <td className="py-2.5 px-4 text-emerald-400">{log.action}</td>
                      <td className="py-2.5 px-4 text-slate-300">{log.entity}</td>
                      <td className="py-2.5 px-4 text-[11px] text-slate-400 truncate max-w-xs font-sans">
                        {JSON.stringify(log.details || {})}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 8. MEDIA LIBRARY TAB */}
        {activeTab === 'media' && (
          <div className="bg-[#0F1D38] rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Centralized Media Library</h2>
                <p className="text-xs text-slate-400">
                  Supabase Storage assets: floor plans, brochures, and high-res photography.
                </p>
              </div>

              <label className="px-4 py-2 rounded-xl bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md">
                <Plus className="w-4 h-4" />
                <span>Upload Media Asset</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      addMediaItem({
                        filename: file.name,
                        file_type: file.type.includes('video') ? 'video' : 'image',
                        file_size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                      });
                    }
                  }}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {mediaItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white/5 rounded-xl overflow-hidden border border-white/10 relative"
                >
                  <img src={item.file_url} alt="" className="w-full aspect-square object-cover" />
                  <div className="p-2 text-[11px]">
                    <div className="font-bold text-white truncate">{item.filename}</div>
                    <div className="text-slate-400 text-[10px]">{item.file_size}</div>
                  </div>
                  <button
                    onClick={() => deleteMediaItem(item.id)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. SUPABASE DATABASE TAB */}
        {activeTab === 'supabase' && (
          <div className="space-y-6">
            <div className="bg-[#0F1D38] rounded-2xl p-6 border border-white/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white flex items-center gap-2">
                        <span>Supabase Cloud Integration</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            supabaseHealth.isConnected
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {supabaseHealth.isConnected ? 'Connected' : 'Reconnecting...'}
                        </span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Production PostgreSQL relational database, Row Level Security, and Realtime CRM synchronization.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={async () => {
                      setIsTestingSupabase(true);
                      const res = await refreshSupabaseHealth();
                      setIsTestingSupabase(false);
                      showToast(res.message);
                    }}
                    disabled={isTestingSupabase}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isTestingSupabase ? 'animate-spin text-amber-400' : ''}`} />
                    <span>{isTestingSupabase ? 'Testing...' : 'Test Connection'}</span>
                  </button>

                  <button
                    onClick={async () => {
                      setIsSyncingSupabase(true);
                      const res = await syncLocalToSupabase();
                      setIsSyncingSupabase(false);
                      showToast(res.message);
                    }}
                    disabled={isSyncingSupabase}
                    className="px-4 py-2.5 rounded-xl bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncingSupabase ? 'animate-spin' : ''}`} />
                    <span>{isSyncingSupabase ? 'Syncing...' : 'Sync Local to Supabase'}</span>
                  </button>

                  <a
                    href={`https://supabase.com/dashboard/project/${supabaseHealth.projectId}/sql/new`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <span>Supabase SQL Editor</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Status Message */}
              <div className="p-3.5 rounded-xl bg-[#070D1A] border border-white/10 text-xs text-slate-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{supabaseHealth.message || 'Supabase service status operational.'}</span>
                </div>
                <span className="text-[10px] text-slate-500">
                  Last checked: {new Date(supabaseHealth.checkedAt).toLocaleTimeString()}
                </span>
              </div>

              {/* Detail Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                    Project Reference
                  </div>
                  <div className="text-base font-bold text-white mt-1 font-mono">
                    {supabaseHealth.projectId}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-1">
                    {supabaseHealth.projectUrl}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                    Client Security
                  </div>
                  <div className="text-base font-bold text-emerald-400 mt-1">
                    Anon Key Configured
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Row-Level Security (RLS) enforcement ready
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                    CRM & Lead Capture
                  </div>
                  <div className="text-base font-bold text-amber-400 mt-1">
                    Automatic Forwarding
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Live syncing to Supabase with local fallback
                  </div>
                </div>
              </div>
            </div>

            {/* Tables & Schema Section */}
            <div className="bg-[#0F1D38] rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Database Tables Status</h3>
                  <p className="text-xs text-slate-400">
                    Schema verification across relational tables:
                  </p>
                </div>

                <button
                  onClick={() => {
                    const snippet = `-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/${supabaseHealth.projectId}/sql/new
-- (Full schema available in /supabase/schema.sql)

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  property_id TEXT,
  project_id TEXT,
  assigned_agent_id TEXT,
  source TEXT DEFAULT 'Website',
  status TEXT NOT NULL DEFAULT 'New',
  budget_range TEXT,
  preferred_location TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  assigned_agent_id TEXT,
  visit_date DATE NOT NULL,
  visit_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Requested',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id VARCHAR(30) UNIQUE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  property_type TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'residential',
  listing_type TEXT NOT NULL DEFAULT 'sale',
  status TEXT NOT NULL DEFAULT 'draft',
  description TEXT NOT NULL,
  price NUMERIC(15, 2) NOT NULL DEFAULT 0,
  area NUMERIC(10, 2) NOT NULL DEFAULT 0,
  bedrooms INT DEFAULT 0,
  bathrooms INT DEFAULT 0,
  city TEXT NOT NULL DEFAULT 'Greater Noida',
  locality TEXT NOT NULL,
  address TEXT NOT NULL,
  featured_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`;
                    navigator.clipboard.writeText(snippet);
                    setCopiedSchema(true);
                    showToast('SQL schema copied to clipboard!');
                    setTimeout(() => setCopiedSchema(false), 3000);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedSchema ? 'Copied to Clipboard!' : 'Copy Schema SQL'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { name: 'properties', label: 'Properties', active: supabaseHealth.tables.properties, count: properties.length },
                  { name: 'projects', label: 'Projects', active: supabaseHealth.tables.projects, count: projects.length },
                  { name: 'leads', label: 'CRM Leads', active: supabaseHealth.tables.leads, count: leads.length },
                  { name: 'site_visits', label: 'Site Visits', active: supabaseHealth.tables.site_visits, count: siteVisits.length },
                  { name: 'profiles', label: 'Agents & Users', active: supabaseHealth.tables.profiles, count: agents.length + 1 },
                ].map((t) => (
                  <div
                    key={t.name}
                    className="p-3.5 rounded-xl bg-[#070D1A] border border-white/5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white font-mono">{t.name}</span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            t.active ? 'bg-emerald-400' : 'bg-slate-600'
                          }`}
                        />
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">{t.label}</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">Local Cache:</span>
                      <span className="text-slate-300 font-bold">{t.count} items</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Review Notes Modal */}
      {selectedPropertyForAction && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#0F1D38] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">
              {actionType === 'reject' ? 'Reject Property Listing' : 'Request Changes From Agent'}
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Provide specific feedback to the submitting agent:
            </p>
            <textarea
              rows={4}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="e.g. Please update carpet area calculation and re-upload high resolution floor plan..."
              className="w-full p-3 rounded-lg bg-[#070D1A] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedPropertyForAction(null)}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPropertyAction}
                className="px-4 py-2 rounded-lg bg-[#E5B842] text-slate-950 text-xs font-bold uppercase tracking-wider"
              >
                Confirm & Notify Agent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Agent Modal */}
      {showAddAgentModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#0F1D38] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Register Authorized Agent</h3>
              <button
                onClick={() => setShowAddAgentModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAgent} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  placeholder="e.g. Sumanth Rawat"
                  className="w-full p-2.5 rounded-lg bg-[#070D1A] border border-white/10 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newAgentEmail}
                  onChange={(e) => setNewAgentEmail(e.target.value)}
                  placeholder="e.g. s.rawat@sunpropmart.com"
                  className="w-full p-2.5 rounded-lg bg-[#070D1A] border border-white/10 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newAgentPhone}
                  onChange={(e) => setNewAgentPhone(e.target.value)}
                  placeholder="+91 98110 00000"
                  className="w-full p-2.5 rounded-lg bg-[#070D1A] border border-white/10 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Assigned Territory</label>
                <select
                  value={newAgentTerritory}
                  onChange={(e) => setNewAgentTerritory(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#070D1A] border border-white/10 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Greater Noida West">Greater Noida West</option>
                  <option value="Noida Expressway">Noida Expressway</option>
                  <option value="Yamuna Expressway">Yamuna Expressway</option>
                  <option value="Greater Noida City">Greater Noida City</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAgentModal(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#E5B842] text-slate-950 font-bold uppercase tracking-wider"
                >
                  Create Agent Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
