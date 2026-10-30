import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Property, PropertyType, PropertyCategory, ListingType } from '../../types';
import {
  UserCheck,
  Building,
  Plus,
  Send,
  Trash2,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  Edit,
  Users,
  Calendar,
  FileText,
  X,
  Upload,
} from 'lucide-react';

export const AgentDashboard: React.FC = () => {
  const {
    currentUser,
    properties,
    leads,
    siteVisits,
    priceRequests,
    deleteRequests,
    notifications,
    addProperty,
    updateProperty,
    submitPropertyForReview,
    requestPriceChange,
    requestDelete,
    updateLeadStatus,
    updateSiteVisitStatus,
    navigate,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'my-properties' | 'add-property' | 'leads' | 'site-visits' | 'notifications'
  >('my-properties');

  // Form State for Add Property
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('Apartment');
  const [category, setCategory] = useState<PropertyCategory>('residential');
  const [listingType, setListingType] = useState<ListingType>('sale');
  const [price, setPrice] = useState('');
  const [rent, setRent] = useState('');
  const [area, setArea] = useState('');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('3');
  const [locality, setLocality] = useState('Sector 4');
  const [city, setCity] = useState('Greater Noida West');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [reraNumber, setReraNumber] = useState('');
  const [furnishing, setFurnishing] = useState<'Furnished' | 'Semi-Furnished' | 'Unfurnished'>('Semi-Furnished');
  const [amenitiesList, setAmenitiesList] = useState<string[]>([
    'Power Backup',
    '24/7 Security',
    'Swimming Pool',
    'Clubhouse',
  ]);
  const [featuredImage, setFeaturedImage] = useState(
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80'
  );

  // Price Change Request Modal State
  const [priceModalProperty, setPriceModalProperty] = useState<Property | null>(null);
  const [newPriceInput, setNewPriceInput] = useState('');
  const [priceReasonInput, setPriceReasonInput] = useState('');

  // Delete Request Modal State
  const [deleteModalProperty, setDeleteModalProperty] = useState<Property | null>(null);
  const [deleteReasonInput, setDeleteReasonInput] = useState('');

  // Filter Agent's Authorized Properties (By creator or assigned agent)
  const agentProperties = properties.filter(
    (p) =>
      p.created_by === currentUser?.id ||
      p.assigned_agent_id === currentUser?.id ||
      currentUser?.role === 'admin'
  );

  // Filter Agent's Authorized Leads
  const agentLeads = leads.filter(
    (l) => l.assigned_agent_id === currentUser?.id || currentUser?.role === 'admin'
  );

  // Filter Agent's Authorized Visits
  const agentVisits = siteVisits.filter(
    (v) => v.assigned_agent_id === currentUser?.id || currentUser?.role === 'admin'
  );

  // Metrics
  const myTotal = agentProperties.length;
  const myDraft = agentProperties.filter((p) => p.status === 'draft').length;
  const myUnderReview = agentProperties.filter((p) => p.status === 'under_review').length;
  const myPublished = agentProperties.filter((p) => p.status === 'published' && !p.deleted_at).length;
  const myChangesRequired = agentProperties.filter((p) => p.status === 'changes_required').length;

  const handleCreateProperty = async (e: React.FormEvent, submitDirectly: boolean) => {
    e.preventDefault();
    if (!title || (!price && !rent) || !area) {
      showToast('Please fill in property title, pricing, and area specifications');
      return;
    }

    const created = await addProperty({
      title,
      property_type: propertyType,
      category,
      listing_type: listingType,
      price: Number(price) || 0,
      rent: Number(rent) || 0,
      area: Number(area),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      locality,
      city,
      address: address || `${locality}, ${city}`,
      description,
      rera_number: reraNumber,
      furnishing,
      amenities: amenitiesList,
      featured_image: featuredImage,
      status: submitDirectly ? 'under_review' : 'draft',
    });

    // Reset Form
    setTitle('');
    setPrice('');
    setRent('');
    setArea('');
    setDescription('');
    setActiveTab('my-properties');
  };

  const handlePriceChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!priceModalProperty || !newPriceInput || !priceReasonInput) return;
    await requestPriceChange(
      priceModalProperty.id,
      Number(newPriceInput),
      priceReasonInput
    );
    setPriceModalProperty(null);
    setNewPriceInput('');
    setPriceReasonInput('');
  };

  const handleDeleteRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteModalProperty || !deleteReasonInput) return;
    await requestDelete(deleteModalProperty.id, deleteReasonInput);
    setDeleteModalProperty(null);
    setDeleteReasonInput('');
  };

  return (
    <div className="bg-[#070D1A] min-h-screen text-slate-200">
      {/* Top Banner */}
      <div className="bg-[#0B1528] border-b border-white/10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  Agent Workspace
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950">
                  {currentUser?.agent_id || 'SPM-AG-102'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {currentUser?.full_name || 'Rahul Sharma'} — Consultant Console
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('add-property')}
              className="px-4 py-2 rounded-lg bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Property</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-white/10 text-xs font-bold scrollbar-none">
          {[
            { id: 'my-properties', label: `My Properties (${myTotal})`, icon: Building },
            { id: 'add-property', label: 'Add New Property', icon: Plus },
            { id: 'leads', label: `Assigned Leads (${agentLeads.length})`, icon: Users },
            { id: 'site-visits', label: `My Site Visits (${agentVisits.length})`, icon: Calendar },
            {
              id: 'notifications',
              label: `Notifications (${notifications.length})`,
              icon: AlertCircle,
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
                    ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. MY PROPERTIES TAB */}
        {activeTab === 'my-properties' && (
          <div className="space-y-6">
            {/* KPI Metric Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="p-4 rounded-xl bg-[#0F1D38] border border-white/10">
                <div className="text-[11px] text-slate-400">Total Portfolio</div>
                <div className="text-2xl font-black text-white mt-1">{myTotal}</div>
              </div>
              <div className="p-4 rounded-xl bg-[#0F1D38] border border-white/10">
                <div className="text-[11px] text-slate-400">Published Live</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">{myPublished}</div>
              </div>
              <div className="p-4 rounded-xl bg-[#0F1D38] border border-white/10">
                <div className="text-[11px] text-slate-400">Under Review</div>
                <div className="text-2xl font-black text-amber-400 mt-1">{myUnderReview}</div>
              </div>
              <div className="p-4 rounded-xl bg-[#0F1D38] border border-white/10">
                <div className="text-[11px] text-slate-400">Drafts</div>
                <div className="text-2xl font-black text-slate-300 mt-1">{myDraft}</div>
              </div>
              <div className="p-4 rounded-xl bg-[#0F1D38] border border-white/10">
                <div className="text-[11px] text-slate-400">Changes Required</div>
                <div className="text-2xl font-black text-blue-400 mt-1">{myChangesRequired}</div>
              </div>
            </div>

            {/* Explanatory Policy Callout */}
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong>Company Policy Enforced (RBAC): </strong>
                Agents can add and edit listings in Draft. To go live, submit for review. Price changes
                and property removals require Admin approval to ensure data consistency.
              </div>
            </div>

            {/* Properties Table */}
            <div className="bg-[#0F1D38] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#070D1A] text-slate-400 uppercase text-[10px] font-bold border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">Property</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Specs</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Permitted Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {agentProperties.map((prop) => (
                      <tr key={prop.id} className="hover:bg-white/5">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prop.featured_image}
                              alt=""
                              className="w-12 h-9 rounded object-cover shrink-0"
                            />
                            <div>
                              <span className="font-mono text-[10px] text-amber-400 block font-bold">
                                {prop.property_id}
                              </span>
                              <span className="font-bold text-white">{prop.title}</span>
                              <div className="text-[10px] text-slate-400">
                                {prop.locality}, {prop.city}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-white">
                          ₹{(prop.price / 100000).toFixed(2)} Lac
                        </td>

                        <td className="py-3 px-4 text-slate-300">
                          {prop.bedrooms ? `${prop.bedrooms} BHK · ` : ''}
                          {prop.area} sq.ft
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              prop.status === 'published'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : prop.status === 'under_review'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : prop.status === 'changes_required'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {prop.status.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Submit for review button */}
                            {prop.status === 'draft' || prop.status === 'changes_required' ? (
                              <button
                                onClick={() => submitPropertyForReview(prop.id)}
                                className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-[11px] flex items-center gap-1 transition-colors"
                                title="Submit to Admin for Publishing Approval"
                              >
                                <Send className="w-3 h-3" />
                                <span>Submit Review</span>
                              </button>
                            ) : null}

                            {/* Price Change Request Button */}
                            <button
                              onClick={() => {
                                setPriceModalProperty(prop);
                                setNewPriceInput(String(prop.price));
                              }}
                              className="p-1.5 rounded bg-white/5 hover:bg-amber-500/20 text-amber-300 transition-colors"
                              title="Request Price Revision (Requires Admin Approval)"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Request Button (No direct delete) */}
                            <button
                              onClick={() => setDeleteModalProperty(prop)}
                              className="p-1.5 rounded bg-white/5 hover:bg-rose-600/30 text-rose-400 transition-colors"
                              title="Request Property Deletion (Requires Admin Approval)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Public View */}
                            <button
                              onClick={() =>
                                navigate('property-detail', { propertySlug: prop.slug })
                              }
                              className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                              title="Preview on Public Website"
                            >
                              <Eye className="w-3.5 h-3.5" />
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

        {/* 2. ADD PROPERTY TAB */}
        {activeTab === 'add-property' && (
          <div className="bg-[#0F1D38] rounded-2xl p-6 sm:p-8 border border-white/10 max-w-4xl mx-auto">
            <div className="mb-6 border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white">Add New SunPropMart Property</h2>
              <p className="text-xs text-slate-400 mt-1">
                Authorized consultant submission form. You can save as Draft or submit directly for
                Admin review.
              </p>
            </div>

            <form className="space-y-6 text-xs">
              {/* Category & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-slate-300 font-bold block mb-1">Property Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. ATS Nobility 3 BHK Luxury Corner Unit"
                    className="w-full p-2.5 rounded-lg bg-[#070D1A] border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Listing Type</label>
                  <select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg bg-[#070D1A] border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                    <option value="lease">Long Term Lease</option>
                  </select>
                </div>
              </div>

              {/* Types */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg bg-[#070D1A] border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Independent House">Independent House</option>
                    <option value="Builder Floor">Builder Floor</option>
                    <option value="Office">Commercial Office</option>
                    <option value="Shop">Shop / Retail</option>
                    <option value="Residential Plot">Residential Plot</option>
                    <option value="Industrial Land">Industrial Land</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    {listingType === 'rent' ? 'Monthly Rent (₹) *' : 'Total Price (₹) *'}
                  </label>
                  <input
                    type="number"
                    required
                    value={listingType === 'rent' ? rent : price}
                    onChange={(e) =>
                      listingType === 'rent' ? setRent(e.target.value) : setPrice(e.target.value)
                    }
                    placeholder={listingType === 'rent' ? 'e.g. 60000' : 'e.g. 12500000'}
                    className="w-full p-2.5 rounded-lg bg-[#070D1A] border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Super Area (Sq.ft) *</label>
                  <input
                    type="number"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. 1520"
                    className="w-full p-2.5 rounded-lg bg-[#070D1A] border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Location Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#070D1A] border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Greater Noida West">Greater Noida West</option>
                    <option value="Noida">Noida</option>
                    <option value="Yamuna Expressway">Yamuna Expressway</option>
                    <option value="Greater Noida">Greater Noida</option>
                    <option value="Ghaziabad">Ghaziabad</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Locality / Sector</label>
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Sector 4, Gaur City 2"
                    className="w-full p-2.5 rounded-lg bg-[#070D1A] border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">RERA Number</label>
                  <input
                    type="text"
                    value={reraNumber}
                    onChange={(e) => setReraNumber(e.target.value)}
                    placeholder="e.g. UPRERAPRJ2845"
                    className="w-full p-2.5 rounded-lg bg-[#070D1A] border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#070D1A] border border-white/10 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#070D1A] border border-white/10 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Furnishing</label>
                  <select
                    value={furnishing}
                    onChange={(e) => setFurnishing(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg bg-[#070D1A] border border-white/10 text-white focus:outline-none"
                  >
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Furnished">Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">Property Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail architectural features, balcony views, club privileges, and proximity to expressways..."
                  className="w-full p-2.5 rounded-lg bg-[#070D1A] border border-white/10 text-white focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={(e) => handleCreateProperty(e, false)}
                  className="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-bold uppercase tracking-wider"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={(e) => handleCreateProperty(e, true)}
                  className="px-6 py-2.5 rounded-lg bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit for Admin Review</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 3. ASSIGNED LEADS TAB */}
        {activeTab === 'leads' && (
          <div className="bg-[#0F1D38] rounded-2xl p-6 border border-white/10">
            <h2 className="text-lg font-bold text-white mb-1">My Assigned CRM Leads</h2>
            <p className="text-xs text-slate-400 mb-6">
              Prospective clients allocated to your territory. Update conversation milestones and
              add follow-up notes.
            </p>

            <div className="space-y-4">
              {agentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-5 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm">{lead.customer_name}</div>
                    <div className="text-xs text-slate-400">
                      Phone: <a href={`tel:${lead.customer_phone}`} className="text-amber-400 hover:underline">{lead.customer_phone}</a> · {lead.customer_email}
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong>Target: </strong>
                      {lead.property_title || 'General Enquiry'}
                    </div>
                    {lead.message && (
                      <p className="text-xs text-slate-400 italic mt-1 bg-black/30 p-2 rounded">
                        &ldquo;{lead.message}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        updateLeadStatus(
                          lead.id,
                          e.target.value as any,
                          `Agent updated status to ${e.target.value}`
                        )
                      }
                      className="bg-[#070D1A] border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Interested">Interested</option>
                      <option value="Site Visit">Site Visit</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Converted">Converted</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SITE VISITS TAB */}
        {activeTab === 'site-visits' && (
          <div className="bg-[#0F1D38] rounded-2xl p-6 border border-white/10">
            <h2 className="text-lg font-bold text-white mb-1">Scheduled Site Visits</h2>
            <p className="text-xs text-slate-400 mb-6">
              On-site inspections with prospective buyers. Coordinate AC vehicle transport and
              sample unit keys.
            </p>

            <div className="space-y-4">
              {agentVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="p-5 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="font-bold text-white text-sm">{visit.property_title}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      Client: <strong className="text-white">{visit.customer_name}</strong> ·{' '}
                      {visit.customer_phone}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-amber-300 mt-2 font-mono">
                      <span>Date: {visit.visit_date}</span>
                      <span>Time: {visit.visit_time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={visit.status}
                      onChange={(e) => updateSiteVisitStatus(visit.id, e.target.value as any)}
                      className="bg-[#070D1A] border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="Requested">Requested</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Rescheduled">Rescheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="bg-[#0F1D38] rounded-2xl p-6 border border-white/10">
            <h2 className="text-lg font-bold text-white mb-4">Inbound Workflow Alerts</h2>
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3 text-xs"
                >
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">{n.title}</div>
                    <div className="text-slate-300 mt-0.5">{n.message}</div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {new Date(n.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Price Change Request Modal */}
      {priceModalProperty && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#0F1D38] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Request Listing Price Change</h3>
            <p className="text-xs text-slate-400 mb-4">
              Property: <strong>{priceModalProperty.title}</strong>
            </p>

            <form onSubmit={handlePriceChangeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Current Official Price</label>
                <input
                  type="text"
                  disabled
                  value={`₹${(priceModalProperty.price / 100000).toFixed(2)} Lac`}
                  className="w-full p-2.5 rounded-lg bg-black/30 border border-white/5 text-slate-400 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Requested New Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={newPriceInput}
                  onChange={(e) => setNewPriceInput(e.target.value)}
                  placeholder="e.g. 13000000"
                  className="w-full p-2.5 rounded-lg bg-[#070D1A] border border-white/10 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Justification / Reason *</label>
                <textarea
                  rows={3}
                  required
                  value={priceReasonInput}
                  onChange={(e) => setPriceReasonInput(e.target.value)}
                  placeholder="e.g. Builder announced price escalation of ₹500/sq.ft from next month..."
                  className="w-full p-2.5 rounded-lg bg-[#070D1A] border border-white/10 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPriceModalProperty(null)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#E5B842] text-slate-950 font-bold uppercase tracking-wider"
                >
                  Submit to Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Request Modal */}
      {deleteModalProperty && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#0F1D38] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Submit Delete Request</h3>
            <p className="text-xs text-rose-300 mb-4">
              Agents cannot delete directly. Submit a formal removal justification for Admin
              approval.
            </p>

            <form onSubmit={handleDeleteRequestSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Reason for Deletion *</label>
                <textarea
                  rows={4}
                  required
                  value={deleteReasonInput}
                  onChange={(e) => setDeleteReasonInput(e.target.value)}
                  placeholder="e.g. Property sold out / Landowner decided to occupy the villa..."
                  className="w-full p-2.5 rounded-lg bg-[#070D1A] border border-white/10 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalProperty(null)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase tracking-wider"
                >
                  Send Delete Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
